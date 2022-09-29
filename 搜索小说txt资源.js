//by 癫癫博士
//仓库地址：https://gitee.com/huangshx2001/yunzai-js-plug-in
//欢迎访问仓库评论和留个star！
//遇到了问题和bug也可以来仓库反馈
//发送【#搜小说帮助】获得帮助

import plugin from '../../lib/plugins/plugin.js'
import fetch from 'node-fetch'



export class example extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: '一言',
      /** 功能描述 */
      dsc: '简单开发示例',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 5000,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '#搜小说帮助',
          /** 执行方法 */
          fnc: 'search_help'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?#搜小说(.*)$',
          /** 执行方法 */
          fnc: 'search_novel'
        }
      ]
    })
  }


  async search_help (e) {
    /** e.msg 用户的命令消息 */
    logger.info('[用户命令]', e.msg)
    await this.reply(`输入【#搜小说书名】获得小说列表\n输入【#搜小说书名 序号】获得小说资源\n例如：#搜小说斗罗大陆\n#搜小说斗罗大陆 1\n请注意搜小说和书名间没有空格，小说和序号中间有1个空格！`)
  }

  async search_novel (e) {
    /** e.msg 用户的命令消息 */
    logger.info('[用户命令]', e.msg)
    let msg = e.msg.replace("#搜小说","").trim()
    msg = msg.split(" ")
    if(msg['length']==1){

        let url = `https://xiaobai.klizi.cn/API/other/novel.php?msg=${msg[0]}&n=`
        let res = await fetch(url).catch((err) => logger.error(err))
        res = await res.text()
        await e.reply(`${res}`)
    }
    else if(msg['length']==2){
        await e.reply(`柚恩正在探索图书馆……`)
        let url = `https://xiaobai.klizi.cn/API/other/novel.php?msg=${msg[0]}&n=${msg[1]}`
        let res = await fetch(url).catch((err) => logger.error(err))
        res = await res.json()

        await this.reply(`书名：${res.title}\n\n作者：${res.author}\n\n简介：${res.js}\n\ntxt小说资源下载链接：\n${res.download}`)
    }
    
  }
}
