//by 癫癫博士 比较忙，有问题可以在gitee上提，q群里的话没法及时回
//生成cp卡片或者cp文章的插件
//可以给自己喜欢的cp使用，也可以用于恶心群友
//发送cp文攻 受 来获取cp文，注意中间有且只有一个空格
//发送cp卡片攻 受 来获取cp卡片，注意中间有且只有一个空格
import plugin from '../../lib/plugins/plugin.js'
import fetch from 'node-fetch'
import{segment}from'oicq'
import cfg from'../../lib/config/config.js'
import common from'../../lib/common/common.js'
const _path=process.cwd()

export class cp extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: 'cp卡片/文生成器',
      /** 功能描述 */
      dsc: '随机生成cp卡片/文',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 5000,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^#*cp卡片(.*)$',
          /** 执行方法 */
          fnc: 'cp_img'
        },
        {
          /** 命令正则匹配 */
          reg: '^#*cp文(.*)$',
          /** 执行方法 */
          fnc: 'cp_create'
        },
      ]
    })
  }
  
    async cp_img(e) {
        logger.info('[用户命令]', e.msg)
        let msg = e.msg.replace("#cp卡片","").trim()
        let string = msg
        let stringlist = string.split(" ")
        let a = stringlist[0]
        let b = stringlist[1]
        if(stringlist['length']==2 && a.length<=6 && b.length<=6){
            let type_list = ["夏日棒冰","奇异触手","蒲公英","鸽子羽毛","金属零件","折扇","玫瑰弓箭","湛蓝药丸","烧瓶","猫爪"]
            let random = Math.ceil(Math.random()*type_list['length'])-1
            
            //这个api比较慢，用这个办法限制一下访问速度
            await e.reply(`请稍等,正在选择本次旅行使用的道具`)
            await common.sleep(3000)
            await e.reply(`本次使用道具:${type_list[random]}`)
            await common.sleep(3000)
            await e.reply(`正在前往cp世界...`)
            let url = `https://api.xingzhige.com/API/cp_generate_2/?type=${type_list[random]}&name1=${a}&name2=${b}&data=img`
            url=encodeURI(url)
            await e.reply(await segment.image(url))
            return true    
        }
        else{
            await e.reply(`输入格式错误或名字长度大于6！`)
            return false
        }
        
        
    }


      async cp_create(e) {
        /** e.msg 用户的命令消息 */
        logger.info('[用户命令]', e.msg)
        let msg = e.msg.replace("#cp文","").trim()
        if(e.message[1]){
            if (e.message[1].type == 'at') {
                let name
                name = e.message[1].text.replace("@","")
                let url = `https://xiaobapi.top/api/xb/api/cp.php?a=${this.e.member.card}&b=${name}`
                /** 调用接口获取数据 */
                let res = await fetch(url).catch((err) => logger.error(err))
                res = await res.text()
                /** 最后回复消息 */
                await this.reply(`${res}`)
                return true;
                }
            } 
        else{
            let string = msg
            let stringlist = string.split(" ")
            let a = stringlist[0]
            let b = stringlist[1]
            let random = Math.ceil(Math.random()*2)
            if (random == 1){
                let url = `https://xiaobapi.top/api/xb/api/cp.php?a=${a}&b=${b}`
                let res = await fetch(url).catch((err) => logger.error(err))
                res = await res.text()
                await this.reply(`${res}`)
                return true
            }
            else if(random == 2){
                let url = `https://api.xingzhige.com/API/cp_generate/?g=${a}&s=${b}`
                let res = await fetch(url).catch((err) => logger.error(err))
                res = await res.json()
                await this.reply(`${res.data.msg}`)
                return true
                }

            }
        }
}
