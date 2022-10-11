import plugin from '../../lib/plugins/plugin.js'
import {
  segment
} from "oicq";
import moment from "moment"

/* 
插件说明:你是否遇到过这种情景:你点进一个99+的QQ群，发现有人艾特/回复过你，你满心期待地去查看，结果腾讯告诉你消息过多无法定义到上下文。现在你只需要这个插件即可找出到底是谁艾特了你。
插件制作:花海里的秋刀鱼(717157592)
首发群:258623209
版本:1.0
时间:2022.10.10
触发指令: 谁艾特我
*/

export class whoAtme extends plugin {
  constructor() {
    super({
      name: '谁艾特我',
      dsc: '看看哪个狗崽子天天艾特人',
      event: 'message',
      priority: 1,
      rule: [{
          reg: '^谁(艾特|@|at)(我|他|她|它)$|哪个逼(艾特|@|at)我$',
          fnc: 'whoAtme',
        },
        {
          reg: '.*',
          fnc: 'whoAtmeData',
          log: false
        },

      ]
    })
  }
  async whoAtmeData (e) {
    let dateTime = 'YYYY-MM-DD 12:00:00' //每天中午十二点清除at数据
    let time = moment(Date.now()).add(1, 'days').format(dateTime)
    let new_date = (new Date(time).getTime() - new Date().getTime()) / 1000
    let isAt = false
    let imgUrls = []
    let faceId = []
    
    for (let msg of e.message) {

      if (msg.type == 'at') {
        isAt = true
      }
      if (msg.type == 'image') {
        imgUrls.push(msg.url)
      }
      if (msg.type == 'face') {
        faceId.push(msg.id)
      }

    }

    if (!isAt || e.atBot) return false
    let data = JSON.parse(await redis.get(`Yz:whoAtme:${e.group_id}+${e.at}`))
    let currentTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    let redis_data

    e.raw_message = e.raw_message.replace(/\[.*\]/g, '').trim()

    if (data) {
      redis_data = {
        User: e.user_id,
        message: currentTime + '\n' + e.raw_message,
        image: imgUrls,
        name: e.nickname,
        faceId: faceId
      }

      data.push(redis_data)

      await redis.set(`Yz:whoAtme:${e.group_id}+${e.at}`, JSON.stringify(data), {
        EX: parseInt(new_date) 
      })

      return false
    }

    redis_data = [{
      User: e.user_id,
      message: currentTime + '\n' + e.raw_message,
      image: imgUrls,
      name: e.nickname,
      faceId: faceId
    }]

    await redis.set(`Yz:whoAtme:${e.group_id}+${e.at}`, JSON.stringify(redis_data), {
      EX: parseInt(new_date)
    })

    return false

  }

  async whoAtme(e) {
    if (!e.isGroup) {
      e.reply('只支持群聊使用')
      return false
    }
    
    let data
    if (e.at) {
      data = JSON.parse(await redis.get(`Yz:whoAtme:${e.group_id}+${e.at}`))
    } else {
      data = JSON.parse(await redis.get(`Yz:whoAtme:${e.group_id}+${e.user_id}`))
    }
    if (!data) {
       e.reply('没有人艾特噢')
      return false
    }
    let msgList = []

    for (let i = 0; i < data.length; i++) {
      let msg = []
      msg.push(data[i].message)

      for (let face of data[i].faceId) {
        msg.push(segment.face(face))
      }

      for (let img of data[i].image) {
        msg.push(segment.image(img))
      }

      msgList.push({
        message: msg,
        user_id: data[i].User,
        nickname: data[i].name
      })
    }


    await e.reply(await e.group.makeForwardMsg(msgList))
   
    return false
  }

}