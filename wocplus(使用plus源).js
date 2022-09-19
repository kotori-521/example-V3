import plugin from '../../lib/plugins/plugin.js'
import YAML from "yaml";
import cfg from '../../lib/config/config.js';
import fs from 'fs';
import moment from "moment";
import fetch from 'node-fetch'
import path_, { parse } from "path"
const __dirname = path_.resolve();
let path = path_.join(__dirname, "/resources/yuhuo/wocplus_video");
let videolist_ = [];
let sourceChanger = {};
let wocRefreshTimer = 1
let usedvideo_ = []

// 命令列表：卧槽plus、wocplus；plus换源

let wocpluscd_ = 20     //触发cd 单位是秒
let cdtimes_ = 15     //每个视频被发送后，在多少次内不会被再次被发送


export class wocplus_ extends plugin {
  constructor() {
    super({
      name: "wocplus_",
      dsc: "神秘指令",
      event: "message",
      priority: 4999,
      rule: [
        {
          reg: "^(卧槽plus|wocplus)$",
          fnc: "wocplus_",
        },
        {
          reg: "^plus换源$",
          fnc: "changeSource",
        },
        {
          reg: "^换源https://gitee.com/(.*)/raw/master/wocplus.json$",
          fnc: "addSource",
        },
        {
          reg: "^[0-9]{1,2}$",
          fnc: "selectSource",
        },
        {
          reg: "^删除$",
          fnc: "delSource",
        }
      ],
    });
  }

  // 删除源==========================
  async delSource(e) {
    if (!e.isMaster) return false
    if (!e.source) return false
    let reply;
    if (e.isGroup) {
      reply = await e.group.getChatHistory(e.source.seq, 1);
    } else {
      reply = await e.friend.getChatHistory(e.source.time, 1);
    }
    reply = reply[0]
    // console.log(reply)
    if (reply.sender.user_id != cfg.qq)
      return false
    if (!reply.raw_message.includes("访问失败，请检查该plus源可用性"))
      return false

    let url = reply.raw_message.replace("访问失败，请检查该plus源可用性：\n", "").trim()
    // console.log("url:",url)
    await this.initfile()
    let res = YAML.parse(fs.readFileSync(`${path}/source.yaml`, "utf8"))
    for (let i = 0; i < res.source.length; i++) {
      if (res.source[i] == url) {
        if (res.using > i)
          res.using--
        else if (res.using == i)
          res.using = 0

        res.source.splice(i, 1)
        let yaml = YAML.stringify(res);
        fs.writeFileSync(`${path}/source.yaml`, yaml, "utf8");
        e.reply(["已删除该源", `${res.using == i ? `，plus源已切换为：${res.source[0]}` : ""}`])
        return true
      }
    }
    e.reply("未收录该源")
    return true
  }

  // 用编号选择源===========================
  async selectSource(e) {
    if (!sourceChanger[e.user_id]) return false;
    if (!e.isMaster) return false
    let num = e.msg * 1
    // console.log(num)
    await this.initfile()
    let res = YAML.parse(
      fs.readFileSync(`${path}/source.yaml`, "utf8")
    )

    if (num < 1 || num > res.source.length) {
      e.reply(`序号${num}不存在`)
      return true
    }
    res.using = num - 1

    // 获取该源收录的视频列表
    try {
      let raw = await fetch(res.source[res.using])
      videolist_ = await raw.json()
    } catch (error) {
      console.log(error)
      e.reply(["访问失败，请检查该plus源可用性：\n", res.source[res.using]])
      return true
    }

    e.reply(`plus源已切换至[${res.source[res.using].replace("https://gitee.com/", "").replace("/raw/master/wocplus.json", "")}]，该plus源当前收录视频${videolist_.length}条`)
    let yaml = YAML.stringify(res);
    fs.writeFileSync(`${path}/source.yaml`, yaml, "utf8");

    if (sourceChanger[e.user_id]) {
      clearTimeout(sourceChanger[e.user_id]);
      delete sourceChanger[e.user_id];
    }
    return true
  }

  // 新增源=========================
  async addSource(e) {
    if (!e.isMaster) return false
    await this.initfile()
    let res = YAML.parse(
      fs.readFileSync(`${path}/source.yaml`, "utf8")
    )
    let newSource = e.msg.replace("换源", "").trim()
    if (res.source.includes(newSource)) {
      e.reply("该源已存在")
      return true
    }
    res.source.push(newSource)
    res.using = res.source.length - 1
    // console.log(res)

    // 获取该源收录的视频列表
    try {
      let raw = await fetch(res.source[res.using])
      videolist_ = await raw.json()
    } catch (error) {
      e.reply(["访问失败，请检查该plus源可用性：\n", res.source[res.using]])
      return true
    }

    e.reply("添加成功，已启用该plus源。当前该源收录视频", videolist_.length, "条")
    let yaml = YAML.stringify(res);
    fs.writeFileSync(`${path}/source.yaml`, yaml, "utf8");
    return true
  }

  async changeSource(e) {
    if (!e.isMaster) return false
    await this.initfile()
    let res = YAML.parse(
      fs.readFileSync(`${path}/source.yaml`, "utf8")
    )
    // console.log(res)

    let sourcelist = "当前有如下plus源:\n\n"
    for (let i = 0; i < res.source.length; i++) {
      sourcelist = sourcelist.concat(`${i + 1}. ${res.source[i].replace("https://gitee.com/", "").replace("/raw/master/wocplus.json", "")} ${i == res.using * 1 ? "[当前]" : ""}\n`)
    }
    sourcelist = sourcelist.concat("\n请发送数字来选中要使用的源。\n或者发送新源以收录,指令格式：换源https://gitee.com/用户名/仓库名/raw/master/wocplus.json")
    e.reply(sourcelist)

    // 开始等待用户后续指令
    if (sourceChanger[e.user_id]) {
      clearTimeout(sourceChanger[e.user_id]);
    }
    sourceChanger[e.user_id] = setTimeout(() => {
      if (sourceChanger[e.user_id]) {
        delete sourceChanger[e.user_id];
      }
    }, 60000);

    return true
  }

  // main======================
  async wocplus_(e) {
    // cd
    let currentTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    let lastTime = await redis.get(`Yz:wcplus_:${this.e.group_id}`);
    if (lastTime) {
      let seconds = moment(currentTime).diff(moment(lastTime), 'seconds')
      this.e.reply(`cd中，请等待${wocpluscd_ - seconds}秒后再使用`)
      return true
    }
    await redis.set(`Yz:wcplus_:${this.e.group_id}`, currentTime, {
      EX: wocpluscd_
    })

    if (!videolist_ || videolist_.length == 0 || wocRefreshTimer) {
      await this.initfile()
      let res = YAML.parse(fs.readFileSync(`${path}/source.yaml`, "utf8"))
      console.log("初始化videolist,使用plus源：", res.source[res.using].replace("https://gitee.com/", "").replace("/raw/master/wocplus.json", ""))
      if (res.using * 1 >= res.source.length) {
        res.using = 0
        let yaml = YAML.stringify(res);
        fs.writeFileSync(`${path}/source.yaml`, yaml, "utf8");
      }
      try {
        let raw = await fetch(res.source[res.using])
        videolist_ = await raw.json()
      } catch (error) {
        e.reply(["访问失败，请检查当前plus源可用性：\n", res.source[res.using]])
        return true
      }
      wocRefreshTimer = 0
      setTimeout(() => {
        wocRefreshTimer = 1
      }, 15 * 60 * 1000);  //计时15分钟，定时从仓库获取视频列表
    }

    // 生成随机数，发送视频
    let num = Number
    do {
      num = Math.round(Math.random() * (videolist_.length - 1))
    } while (usedvideo_.includes(num))
    usedvideo_.push(num)

    console.log("本次随机到第", num + 1, "/", videolist_.length, "个视频")
    if (usedvideo_.length > cdtimes_ || usedvideo_.length >= videolist_.length)
      usedvideo_ = usedvideo_.slice(1)
    console.log("近期使用过的视频，下次不会再随机到:", usedvideo_)
    e.reply(videolist_[num])
    return true
  }


  // 初始化文件============-======
  async initfile() {
    await this.checkpath(path);
    if (!fs.existsSync(`${path}/source.yaml`)) {
      let data = { source: ["https://gitee.com/yhArcadia/woc/raw/master/wocplus.json"], using: 0 };
      let yaml = YAML.stringify(data);
      fs.writeFileSync(`${path}/source.yaml`, yaml, "utf8");
    }
  }

  // 递归检查并创建路径（如果路径不存在） =======================
  async checkpath(checkPath) {
    // 取上一级路径
    let tpath = checkPath.split("/")
    tpath.splice(-1)
    tpath = tpath.join("/")
    // console.log(tpath)
    // 如果不存在上一级路径
    if (!fs.existsSync(tpath)) {
      // 则递归处理
      await this.checkpath(tpath)
    }
    // 存在上一级路径时则创建本级路径
    // console.log("创建路径：", checkPath)
    if (!fs.existsSync(checkPath)) {
      fs.mkdirSync(checkPath);
    }
  }
}