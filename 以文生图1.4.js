import fetch from 'node-fetch'
import {
  segment
} from 'oicq'
import plugin from '../../lib/plugins/plugin.js'
import moment from "moment"

/* 
https://wenxin.baidu.com/moduleApi/ernieVilg //原网站
https://wenxin.baidu.com/moduleApi/key //创建API KEY
插件制作:花海里的秋刀鱼(717157592)
首发群:258623209
版本:1.4
更新内容:增加图片尺寸和发多图选择，自定义发图时间，解锁关键词限制,增加检测图片生成任务
时间：2022.10.9
*/


const client_id = '' //应用的API Key(AK)
const client_secret = '' //应用的Secret Key(SK)
const size = 3 //图片尺寸，1为方图1024*1024 ，2为长图1024*1536 ， 3为横图1536*1024
const forword = true //是否发多张图片并制作合并转发,false为发一张,true为发多张,私聊只支持发单张
const time = 10 //指令CD，默认十分钟，不建议改动，图片发完自动解除CD
const isApply = false //账号是否申请了探索无限功能,是填true,否为false

export class text_Painting extends plugin {
  constructor() {
    super({
      name: '以文生图',
      dsc: '根据输入的文案Ai作画',
      event: 'message',
      priority: 8,
      rule: [{
        reg: '^#?以文生图.*$',
        fnc: 'text_Painting',
      //  permission: 'master'
      }]
    })

    this.task = {
      cron: '0 0/1 * * * ?',
      name: '以文生图',
      fnc: () => this.sendImg(),

    }
  }

  async text_Painting(e) {
    if (e.msg == `以文生图帮助`) {
      e.reply("关键词:古风|油画|水彩画|卡通|二次元|浮世绘|蒸汽波|low poly|像素|概念|未来主义|赛博朋克|写实风格|洛丽塔风格|巴洛克风格|超现实主义", true)
      return true
    }

    if (client_id == '' || client_secret == '') {
      e.reply('请先在代码里填写API_Key\nAPI_Key可在https://wenxin.baidu.com/moduleApi/key创建', true)
      return false
    }

    let currentTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    let lastTime = await redis.get('Yz:text_Painting')
    if (lastTime) {
      let seconds = moment(currentTime).diff(moment(lastTime), 'seconds')
      e.reply(`图片生成中，请等待${60 * time - seconds}秒后再使用`)
      return true
    }

    let msglist = e.msg
    if (e.source) {
      let reply = (await e.group.getChatHistory(e.source.seq, 1)).pop()

      msglist = reply.raw_message

    }
    try {
      if (isApply) {
        var type = '探索无限'
        var msg = msglist.replace(/#|以文生图/g, '').trim()
      } else {
        var type = msglist.match(/古风|油画|水彩画|卡通|二次元|浮世绘|蒸汽波|low poly|像素|概念|未来主义|赛博朋克|写实风格|洛丽塔风格|巴洛克风格|超现实主义/g)[0].toString()

        var msg = msglist.replace(/#|探索无限|以文生图|古风|油画|水彩画|卡通|二次元|浮世绘|蒸汽波|low poly|像素|概念|未来主义|赛博朋克|写实风格|洛丽塔风格|巴洛克风格|超现实主义/g, "").trim()
      }
      if (msg == '') {
        e.reply("格式:以文生图 + 关键词 + 修辞词,可发[以文生图帮助]查看关键词", true)
        return true
      }
    } catch (err) {
      e.reply("格式:以文生图 + 关键词 + 修辞词,可发[以文生图帮助]查看关键词", true)
      return false
    }
    let token_Response = await fetch('https://wenxin.baidu.com/moduleApi/portal/api/oauth/token', {
      method: "post",
      body: `grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}`,
      headers: {
        'Content-Type': "application/x-www-form-urlencoded"
      }
    })

    let token_Res = await token_Response.json()

    let accessToken = token_Res.data


    let resolution = size == 1 ? '1024*1024' : size == 2 ? '1024*1536' : '1536*1024'

    let taskId_Response = await fetch(`https://wenxin.baidu.com/moduleApi/portal/api/rest/1.0/ernievilg/v1/txt2img?access_token=${accessToken}`, {
      method: "post",
      body: JSON.stringify({
        text: msg,
        style: type,
        resolution: resolution
      }),
      headers: {
        'Content-Type': "application/json"
      }
    })


    let taskId_Res = await taskId_Response.json()

    logger.info(taskId_Res)
    if (taskId_Res.msg.includes('超限') || taskId_Res.msg.includes('不支持') || taskId_Res.msg.includes('白名单' || taskId_Res.msg.includes('失败'))) {
      e.reply(taskId_Res.msg)
      return false
    }


    let taskId = taskId_Res.data.taskId



    let image_Response = await fetch(`https://wenxin.baidu.com/moduleApi/portal/api/rest/1.0/ernievilg/v1/getImg?access_token=${accessToken}`, {
      method: "post",
      body: JSON.stringify({
        taskId: taskId
      }),
      headers: {
        'Content-Type': "application/json"
      }
    })

    let image_Res = await image_Response.json()
    logger.info(`${type},${accessToken},${taskId}`)
    logger.info(image_Res)
    if (image_Res.data.waiting != '0') {
      e.reply(`图片生成中......\n${time}分钟内检测到图片生成完将自动发送`)


      await redis.set('Yz:text_Painting', currentTime, {
        EX: time * 60
      })

      if (e.isGroup) {
        await redis.set('Yz:text_Painting:group', e.group_id, {
          EX: 100 * time
        })
      } else {
        await redis.set('Yz:text_Painting:user', e.user_id, {
          EX: 100 * time
        })
      }

      await redis.set('Yz:text_Painting:token', accessToken, {
        EX: 100 * time
      })
      await redis.set('Yz:text_Painting:taskId', taskId, {
        EX: 100 * time
      })



      return true
    }

    let image = image_Res.data.img
    e.reply(segment.image(image))

  }

  async sendImg() {
    let textToken = await redis.get('Yz:text_Painting:token')
    let textTaskid = await redis.get('Yz:text_Painting:taskId')
    let textGroup = await redis.get('Yz:text_Painting:group')
    let textUser = await redis.get('Yz:text_Painting:user')

    if (textToken && textTaskid) {
      let image_Response = await fetch(`https://wenxin.baidu.com/moduleApi/portal/api/rest/1.0/ernievilg/v1/getImg?access_token=${textToken}`, {
        method: "post",
        body: JSON.stringify({
          taskId: textTaskid
        }),
        headers: {
          'Content-Type': "application/json"
        }
      })

      let image_Res = await image_Response.json()
      let image = image_Res.data.img

      if (image == '') {
        return false
      }

      let imgUrls = []
      let imageUrls = []
      for (let i = 0; i < image_Res.data.imgUrls.length; i++) {
        imgUrls.push(image_Res.data.imgUrls[i].image)
      }

      if (forword) {
        for (let i = 0; i < imgUrls.length; i++) {
          imageUrls.push(segment.image(imgUrls[i]))
        }
        let msglist = []
        for (let i of imageUrls) {
          msglist.push({
            message: i,
            nickname: Bot.nickname,
            user_id: Bot.uin
          })
        }


        if (textGroup) {
          await Bot.pickGroup(textGroup).sendMsg(await Bot.makeForwardMsg(msglist))
        }

        if (textUser) {
          await Bot.pickFriend(textUser).sendMsg(await Bot.makeForwardMsg(msglist))
        }
      } else {
        if (textGroup) {
          await Bot.pickGroup(textGroup).sendMsg(segment.image(image))
        }

        if (textUser) {
          await Bot.pickFriend(textUser).sendMsg(segment.image(image))
        }

      }

      await redis.del('Yz:text_Painting:token')
      await redis.del('Yz:text_Painting:taskId')
      await redis.del('Yz:text_Painting')
      await redis.del('Yz:text_Painting:user')
      await redis.del('Yz:text_Painting:group')
    }
  }
}