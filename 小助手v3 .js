import plugin from '../../lib/plugins/plugin.js';
import { segment } from "oicq";
import fetch from 'node-fetch';
import cfg from '../../lib/config/config.js';
let Qzonedetermine;
/**
 * 作者：超市椰羊(746659424)
 * 
 * "#发好友" 和 "#发群聊" 一定要加空格
 * 可以发送"#助手帮助"查看指令
 * 增加QQ空间的操作
 */

export class example extends plugin {
  constructor() {
    super({
      /** 功能名称 */
      name: '小助手',
      /** 功能描述 */
      dsc: '远程对机器人进行一些操作',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 5000,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^#?助手帮助$',
          fnc: 'help'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?改头像.*$',
          fnc: 'Photo'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?改昵称.*$',
          fnc: 'Myname'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?改签名.*$',
          fnc: 'Sign'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?改状态.*$',
          fnc: 'State'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?发好友.*$',
          fnc: 'Friends'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?发群聊.*$',
          fnc: 'Groupmsg'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?退群.*$',
          fnc: 'Quit'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?删好友.*$',
          fnc: 'Deletes'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?改性别.*$',
          fnc: 'Sex'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?取直链.*$',
          fnc: 'Picture'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?取face.*$',
          fnc: 'Face'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?取说说列表.*$',
          fnc: 'Qzonelist'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?删说说.*$',
          fnc: 'Qzonedel'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?发说说.*$',
          fnc: 'Qzonesay'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?(清空说说|清空留言)$',
          fnc: 'Other'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?改群名片.*$',
          fnc: 'MyGroupname'
        },
      ]
    })
  }
  //帮助
  async help(e) {
    let msg = [
      segment.image("https://api.ixiaowai.cn/api/api.php"),
      "小助手v3 by 超市椰羊 \n",
      "--------------------\n",
      "#发群聊 <群号> <内容> \n",
      "#发好友 <QQ> <内容> \n",
      "#改头像 <图片> \n",
      "#改状态 <状态> \n",
      "#改昵称 <昵称> \n",
      "#改签名 <签名> \n",
      "#改性别 <性别> \n",
      "#改群名片 <群号> <内容>",
      "#删好友 <QQ> \n",
      "#退群 <群号> \n",
      "#取说说列表 <页数> \n",
      "#发说说 <内容> \n",
      "#删说说 <序号>\n",
      "#清空说说\n",
      "#清空留言\n",
      "#取直链 <图片>\n",
      "#取face <face表情>"
    ]
    e.reply(msg);
  }

  /**改头像*/
  async Photo(e) {
    if (!e.isMaster) return e.reply("❎ 该命令仅限管理员可用", true);

    if (!e.img) {
      this.setContext('Photos')
      e.reply("✳️ 请发送图片");
      return;
    }

    await Bot.setAvatar(e.img[0])
      .then(e.reply("✅ 头像修改成功"))
      .catch((err) => {
        e.reply("❎ 头像修改失败");
        console.log(err);
      })

  }
  async Photos() {
    let img = this.e.img
    if (this.e.msg === "取消") {
      this.finish('Photos')
      await this.reply('✅ 已取消')
      return;
    }
    if (!img) {
      this.setContext('Photos')
      await this.reply('❎ 请发送图片或取消')
      return;
    }
    await Bot.setAvatar(img[0])
      .then(this.e.reply("✅ 头像修改成功"))
      .catch((err) => {
        this.e.reply("❎ 头像修改失败");
        console.log(err)
      })

    this.finish('Photos')
  }

  /** 改昵称*/
  async Myname(e) {
    if (!e.isMaster) return e.reply("❎ 该命令仅限管理员可用", true);

    let name = e.msg.replace(/#|改昵称/g, "").trim()

    await Bot.setNickname(name)
      .then(e.reply("✅ 昵称修改成功"))
      .catch((err) => {
        e.reply("❎ 昵称修改失败");
        console.log(err);
      })
  }

  /** 改群名片 */
  async MyGroupname(e) {
    if (!e.isMaster) return e.reply("❎ 该命令仅限管理员可用", true);

    let msg = e.msg.split(" ")
    if (e.isPrivate) {
      if (msg.length != 3) return e.reply("❎ 您输入的指令不合法");
    }

    let group = '';
    let card = '';
    if (msg.length == 2) {
      group = e.group_id; card = msg[1]
    } else if (msg.length == 3) {
      group = msg[1]; card = msg[2];

      if (!(/^\d+$/.test(msg[1]))) return e.reply("❎ 您的群号不合法");

      if (!Bot.gl.get(Number(msg[1]))) return e.reply("❎ 群聊列表查无此群");

    } else return e.reply("❎ 您输入的指令不合法");

    Bot.pickGroup(group).setCard(cfg.qq, card)
      .then(e.reply("✅ 群名片修改成功"))
      .catch(err => {
        e.reply("✅ 群名片修改失败")
        console.log(err);
      })
  }

  /** 改签名*/
  async Sign(e) {
    if (!e.isMaster) return e.reply("❎ 该命令仅限管理员可用", true);

    let signs = e.msg.replace(/#|改签名/g, "").trim()
    await Bot.setSignature(signs)
      .then(e.reply("✅ 签名修改成功"))
      .catch((err) => {
        e.reply("❎ 签名修改失败");
        console.log(err)
      })
  }

  /** 改状态*/
  async State(e) {
    if (!e.isMaster) return e.reply("❎ 该命令仅限管理员可用", true);

    let signs = e.msg.replace(/#|改状态/g, "").trim()

    if (!signs) return e.reply("❎ 状态不为空，可选值：我在线上，离开，隐身，忙碌，Q我吧，请勿打扰");

    let res = {
      "离开": 31,
      "忙碌": 50,
      "隐身": 41,
      "Q我吧": 60,
      "请勿打扰": 70,
      "我在线上": 11,
    }

    let status = {
      31: "离开",
      50: "忙碌",
      70: "请勿打扰",
      41: "隐身",
      11: "我在线上",
      60: "Q我吧",
    };

    if (!(signs in res)) return e.reply("❎ 可选值：我在线上，离开，隐身，忙碌，Q我吧，请勿打扰")

    await Bot.setOnlineStatus(res[signs])
      .then(e.reply("✅ 在线状态修改成功"))
      .then(e.reply(`✅ 现在的在线状态为【${status[Bot.status]}】`))
      .catch(err => {
        e.reply("❎ 在线状态修改失败");
        console.log(err);
      })
    return true;
  }

  /** 发好友*/
  async Friends(e) {
    if (!e.isMaster) return e.reply("❎ 该命令仅限管理员可用", true);

    let msgs = e.message[0].text.split(" ")
    e.message[0].text = msgs[2]

    if (msgs.length < 2) return e.reply("❎ 您输入的指令不合法");

    if (!/^\d+$/.test(msgs[1])) return e.reply("❎ 您输入的QQ号不合法");

    if (!Bot.fl.get(Number(msgs[1]))) return e.reply("❎ 好友列表查无此人");

    if (!e.message[0].text) e.message.shift()

    if (e.message.length === 0) return e.reply("❎ 消息不能为空");

    await Bot.pickFriend(msgs[1]).sendMsg(e.message)
      .then(e.reply("✅ 私聊消息已送达"))
      .catch(err => e.reply(`❎ 发送失败\n错误信息为:${err.message}`))

  }

  /** 发群聊*/
  async Groupmsg(e) {
    if (!e.isMaster) return e.reply("❎ 该命令仅限管理员可用", true);

    let msgs = e.message[0].text.split(" ")
    e.message[0].text = msgs[2]

    if (msgs.length < 2) return e.reply("❎ 您输入的指令不合法");


    if (!/^\d+$/.test(msgs[1])) return e.reply("❎ 您输入的群号不合法");

    if (!Bot.gl.get(Number(msgs[1]))) return e.reply("❎ 群聊列表查无此群");

    if (!e.message[0].text) e.message.shift()

    if (e.message.length === 0) return e.reply("❎ 消息不能为空");


    await Bot.pickGroup(msgs[1]).sendMsg(e.message)
      .then(e.reply("✅ 群聊消息已送达"))
      .catch((err) => e.reply(`❎ 发送失败\n错误信息为:${err.message}`))
  }

  /**退群 */
  async Quit(e) {
    if (!e.isMaster) return e.reply("❎ 该命令仅限管理员可用", true);

    let quits = e.msg.replace(/#|退群/g, "").trim()

    if (!quits) return e.reply("❎ 群号不能为空");

    if (!/^\d+$/.test(quits)) return e.reply("❎ 群号不合法");

    if (!Bot.gl.get(Number(quits))) return e.reply("❎ 群聊列表查无此群")

    await Bot.pickGroup(quits).quit()
      .then(e.reply(`✅ 已退出群聊`))
      .catch((err) => {
        e.reply("❎ 退出失败");
        console.log(err)
      })
  }

  /**删好友 */
  async Deletes(e) {
    if (!e.isMaster) return e.reply("❎ 该命令仅限管理员可用", true)

    let quits = e.msg.replace(/#|删好友/g, "").trim()

    if (e.message[1]) {
      quits = e.message[1].qq
    } else {
      quits = quits.match(/[1-9]\d*/g)
    }
    if (!quits) return e.reply("❎ 请输入正确的QQ号")

    if (!Bot.fl.get(Number(quits))) return e.reply("❎ 好友列表查无此人");

    await Bot.pickFriend(quits).delete()
      .then(e.reply(`✅ 已删除好友`))
      .catch((err) => {
        e.reply("❎ 删除失败");
        console.log(err);
      })
  }

  /**改性别 */
  async Sex(e) {
    if (!e.isMaster) return e.reply("❎ 该命令仅限管理员可用", true);

    let sex = e.msg.replace(/#|改性别/g, "").trim();

    if (!sex) return e.reply("❎ 性别不能为空 可选值：男，女，无\n（改为无，为无性别）");

    let res = {
      "无": 0,
      "男": 1,
      "女": 2,
    }
    if (!(sex in res)) return e.reply("❎ 可选值：男，女，无(改为无，为无性别)");

    await Bot.setGender(res[sex])
      .then(e.reply(`✅ 已修改性别`))
      .catch((err) => {
        e.reply("❎ 修改失败");
        console.log(err);
      })
  }

  /**取直链 */
  async Picture(e) {
    if (!e.img) {
      this.setContext('imgs')
      await this.reply('✳️ 请发送图片')
      return;
    }
    await e.reply(`✅ 检测到${e.img.length}张图片`)
    for (let i of e.img) {
      await e.reply([segment.image(i), "直链:", i])
    }

  }
  async imgs() {
    let img = this.e.img
    if (this.e.msg === "取消") {
      this.finish('imgs')
      await this.reply('✅ 已取消')
      return;
    }
    if (!img) {
      this.setContext('imgs')
      await this.reply('❎ 请发送图片或取消')
      return;
    }
    await this.e.reply(img[0])
    this.finish('imgs')
  }

  /** 取Face表情 */
  async Face(e) {
    let face = [];
    for (let m of e.message) {
      if (m.type === "face") {
        let s = false;
        for (let i of face) { if (i.id === m.id) s = true }
        if (!s) face.push(m)
      }
    }
    if (face.length === 0) return e.reply("❎ 表情参数不可为空", true);

    let res = face.map(function (item) {
      return [
        `表情：`,
        item,
        `\nid：${item.id}`,
        `\n描述：${item.text}`
      ]
    })

    for (let i of res) {
      await e.reply(i)
    }

  }


  /**QQ空间 说说列表*/
  async Qzonelist(e) {
    if (!e.isMaster) return e.reply("❎ 该命令仅限管理员可用", true);

    let res = e.message[0].text.replace(/#|取说说列表/g, "").trim()
    if (!res) res = 1
    if (!parseInt(res)) return e.reply(`❎ 请检查页数是否正确`)

    let list = await getlist()
    list = list.msglist
    if (!list) return e.reply(`❎ 说说列表为空`)
    let msg = [
      "✅ 获取成功，说说列表如下:\n"
    ]
    let page = 5 * (res - 1)
    for (let i = 0 + page; i < 5 + page; i++) {
      if (!list[i]) break
      let arr = `${i + 1}.${jq(list[i].content)}\n- [${list[i].secret ? "私密" : "公开"}] | ${times(list[i].created_time)} | ${list[i].commentlist ? list[i].commentlist.length : 0}条评论\n`
      msg.push(arr)
    }
    if (res > Math.ceil(list.length / 5)) return e.reply(`❎ 页数超过最大值`)
    msg.push(`页数：[${res}/${Math.ceil(list.length / 5)}]`)
    e.reply(msg)
  }

  /** 删除说说 */
  async Qzonedel(e) {
    if (!e.isMaster) return e.reply("❎ 该命令仅限管理员可用", true);

    let res = e.message[0].text.replace(/#|删说说/g, "").trim()
    if (!res) return e.reply(`❎ 序号不可为空`)
    res = res.match(/\d/)
    if (!res) return e.reply(`❎ 请检查序号是否正确`)

    let list = await getlist()

    if (!list.msglist) return e.reply(`❎ 说说列表为空`)
    let ck = getck()
    if ((res - 1) >= list.msglist.length) return e.reply(`❎ 序号超过最大值`)
    let something = list.msglist[res - 1]

    let url = `https://xiaobai.klizi.cn/API/qqgn/ss_delete.php?data=&uin=${cfg.qq}&skey=${ck.skey}&pskey=${ck.p_skey}&tid=${something.tid}`
    let result = await fetch(url).then(res => res.text()).catch(err => console.log(err))
    if (!result) return e.reply(`❎ 接口请求失败`)

    if (/删除说说成功/.test(result)) {
      e.reply(`✅ 删除说说成功：\n ${res}.${jq(something.content)} \n - [${something.secret ? "私密" : "公开"}] | ${times(something.created_time)} | ${something.commentlist ? something.commentlist.length : 0} 条评论`)
    } else if (/删除失败/.test(result)) {
      e.reply(`❎ 删除失败`)
    }
  }

  /** 发说说 */
  async Qzonesay(e) {
    if (!e.isMaster) return e.reply("❎ 该命令仅限管理员可用", true);

    let res = e.message[0].text.replace(/#|发说说/g, "").trim()
    let ck = getck()
    let url;
    if (e.img) {
      url = `https://xiaobai.klizi.cn/API/qqgn/ss_sendimg.php?uin=${cfg.qq}&skey=${ck.skey}&pskey=${ck.p_skey}&url=${e.img[0]}&msg=${res}`
    } else {
      url = `http://xiaobai.klizi.cn/API/qqgn/ss_send.php?data=json&uin=${cfg.qq}&skey=${ck.skey}&pskey=${ck.p_skey}&msg=${res}`
    }
    let result = await fetch(url).then(res => res.json()).catch(err => console.log(err))
    let msg = [`✅ 说说发表成功，内容：\n`, jq(result.content)]
    if (result.code != 0) return e.reply(`❎ 说说发表失败\n错误信息:${result.message}`)
    if (result.pic) {
      msg.push(segment.image(result.pic[0].url1))
    }
    msg.push(`\n- [${result.secret ? "私密" : "公开"}] | ${times(result.t1_ntime)}`)
    e.reply(msg)
  }

  /** 其他合集*/
  async Other(e) {
    if (!e.isMaster) return e.reply("❎ 该命令仅限管理员可用", true);

    if (/清空说说/.test(e.msg)) {
      this.setContext('QzonedelAll')
      e.reply("✳️ 即将删除全部说说请发送：\n" + "------确认清空或取消------");
      Qzonedetermine = true;
      return true;
    } else if (/清空留言/.test(e.msg)) {
      this.setContext('QzonedelAll')
      e.reply("✳️ 即将删除全部留言请发送：\n" + "------确认清空或取消------");
      Qzonedetermine = false
      return true;
    }
  }

  /**清空说说和留言 */
  async QzonedelAll() {
    let msg = this.e.msg
    if (msg == "确认清空") {
      this.finish('QzonedelAll')
      let ck = getck()

      let url
      if (Qzonedetermine) {
        url = `https://xiaobai.klizi.cn/API/qqgn/ss_empty.php?data=&uin=${cfg.qq}&skey=${ck.skey}&pskey=${ck.p_skey}`
      } else {
        url = `https://xiaobai.klizi.cn/API/qqgn/qzone_emptymsgb.php?data=&uin=${cfg.qq}&skey=${ck.skey}&pskey=${ck.p_skey}`
      }

      let result = await fetch(url).then(res => res.text()).catch(err => console.log(err))
      this.e.reply(`✅ ${result}`)
      return true;

    } else if (msg == "取消") {
      this.finish('QzonedelAll')
      this.e.reply("✅ 已取消")
      return false;
    } else {
      this.setContext('QzonedelAll')
      this.e.reply("❎ 请输入:确认清空或取消")
      return false;
    }
  }

}







/**字数限制 */
function jq(str) {
  if (str.length > 10) {
    let s = str.slice(0, 10)
    return s + "..."
  } else {
    return str
  }
}

/**时间转换 */
function times(time) {
  var now = new Date(parseFloat(time) * 1000);
  var month = now.getMonth() + 1;
  var date = now.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (date >= 0 && date <= 9) {
    date = "0" + date;
  }
  var hour = now.getHours();
  var minute = now.getMinutes();
  if (hour >= 1 && hour <= 9) {
    hour = "0" + hour;
  }
  if (minute >= 0 && minute <= 9) {
    minute = "0" + minute;
  }
  return month + "/" + date + " " + hour + ":" + minute
}

/**取说说列表*/
async function getlist() {
  let ck = getck()
  let url = `https://xiaobai.klizi.cn/API/qqgn/ss_list.php?data=json&uin=${cfg.qq}&skey=${ck.skey}&pskey=${ck.p_skey}&qq=${cfg.qq}`
  let list = await fetch(url).then(res => res.json()).catch(err => console.log(err))

  if (!list) {
    return e.reply("❎ 取说说列表失败")
  } else {
    return list
  }

}
/**取cookies */
function getck() {
  let cookie = Bot.cookies['qzone.qq.com']
  let ck = cookie.replace(/=/g, `":"`).replace(/;/g, `","`).replace(/ /g, "").trim()
  ck = ck.substring(0, ck.length - 2)
  ck = `{"`.concat(ck).concat("}")
  return JSON.parse(ck)
}