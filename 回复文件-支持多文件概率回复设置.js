import { segment } from "oicq";
import fs from "fs";
import lodash from "lodash";
import plugin from "../../lib/plugins/plugin.js";
import common from "../../lib/common/common.js";
import sizeOf from "image-size";

//项目路径
const _path = process.cwd();

const resourcesPath = `${_path}/data/replyfile`;

const config = {
  replyMode: "sample", // sample: 为随机抽取一张图片 multiple: 回复所有符合条件的图片
  maxReplyNum: 3, // 最多回复消息的数量
  reply: 100, // 触发关键词回复概率，默认100%回复可以设置 0 - 100
  imgPath: `${resourcesPath}/img/`,
  voicePath: `${resourcesPath}/voice/`,
  videoPath: `${resourcesPath}/video/`,
};

/**
 * 图片文件放在/Yunzai-Bot/data/replyfile/img/
 * 声音文件放在/Yunzai-Bot/data/replyfile/voice/
 * 视频文件放在/Yunzai-Bot/data/replyfile/video/
 * 【文件名】就是触发指令，多个命令可以用-隔开
 * 图片支持格式（jpg,png,gif,bmp）
 * 语音支持格式（amr,silk）
 */

if (!fs.existsSync(resourcesPath)) {
  fs.mkdirSync(resourcesPath);
}

if (!fs.existsSync(config.imgPath)) {
  fs.mkdirSync(config.imgPath);
}

if (!fs.existsSync(config.voicePath)) {
  fs.mkdirSync(config.voicePath);
}

if (!fs.existsSync(config.videoPath)) {
  fs.mkdirSync(config.videoPath);
}

let fileArr = new Map();

export class replyfile extends plugin {
  constructor() {
    super({
      name: "文件回复",
      dsc: "文件回复",
      event: "message",
      priority: 1800,
    });
  }

  async init() {
    this.readdirectory(config.imgPath, "img");
    this.watchFile(config.imgPath, "img");
    this.readdirectory(config.voicePath, "record");
    this.watchFile(config.voicePath, "record");
    this.readdirectory(config.videoPath, "video");
    this.watchFile(config.videoPath, "video");
  }

  async accept() {
    if (!this.e.msg || !this.e.message || this.e.hasReply) {
      return false;
    }

    let msg = this.e.msg.replace(/#|＃|\./g, "");

    let tmp = fileArr.get(msg);
    if (!tmp) return;

    let filePaths = [];

    if (config.replyMode == "sample") {
      filePaths.push(lodash.sample(tmp));
    } else {
      filePaths = tmp || [];

      if (filePaths.length > config.maxReplyNum) {
        filePaths.length = config.maxReplyNum;
      }
    }

    if (!filePaths.length || !filePaths.find((item) => item.includes(msg)))
      return;

    if (Number(Math.random().toFixed(2)) * 100 > config.reply) return;

    Bot.logger.mark(`[${this.e.group_name}] 全局表情：${msg}`);

    let replied = false;

    filePaths.map(async (filePath) => {
      if (/.(jpg|jpeg|png|gif|bmp)$/.test(filePath)) {
        let dimensions = sizeOf(filePath);
        let tmp = dimensions.width / dimensions.height;
        if (
          dimensions.height > 150 &&
          ((tmp > 0.6 && tmp < 1.4) || tmp > 2.5)
        ) {
          msg = segment.image(filePath);
          msg.asface = true;
          replied = true;
          this.e.reply(msg);
        } else {
          replied = true;
          this.e.reply(segment.image(filePath));
        }
        await common.sleep(500);
      }
      return filePath;
    });

    if (replied) {
      return "return";
    }

    const filePath = filePaths[0];

    if (/.(amr|silk|slk|mp3)$/.test(filePath)) {
      this.e.reply(segment.record(filePath));
      return "return";
    }
    if (/.(mp4|avi)$/.test(filePath)) {
      this.e.reply(segment.video(filePath));
      return "return";
    }

    return "return";
  }

  readdirectory(dir, type) {
    let files = fs.readdirSync(dir, { withFileTypes: true });
    for (let val of files) {
      let filepath = dir + `/` + val.name;
      if (!val.isFile()) {
        this.readdirectory(filepath, type);
        continue;
      }
      let re;

      if (type == "img") {
        re = new RegExp(`.(jpg|jpeg|png|gif|bmp)$`, "i");
      }
      if (type == "record") {
        re = new RegExp(`.(amr|silk|mp3)$`, "i");
      }
      if (type == "video") {
        re = new RegExp(`.(mp4|avi)$`, "i");
      }
      if (!re.test(val.name)) {
        continue;
      }
      let name = val.name.replace(re, "");
      name = name.split("-");
      for (let v of name) {
        v = v.trim();
        let tmp = fileArr.get(v);
        if (tmp) {
          tmp.push(filepath);
        } else {
          fileArr.set(v, [filepath]);
        }
      }
    }
  }

  watchFile(dir, type) {
    let fsTimeout = {};
    let recursive = false;
    fs.watch(dir, { recursive: recursive }, async (eventType, filename) => {
      if (fsTimeout[type]) return;

      let re;
      if (type == "img") {
        Bot.logger.mark("更新全局图片");
        re = new RegExp(`.(jpg|jpeg|png|gif|bmp)$`, "i");
        fileArr.img = {};
      }

      if (type == "record") {
        Bot.logger.mark("更新全局语音");
        re = new RegExp(`.(amr|silk|mp3)$`, "i");
        fileArr.record = {};
      }
      if (type == "video") {
        Bot.logger.mark("更新全局视频");
        re = new RegExp(`.(mp4|avi)$`, "i");
        fileArr.video = {};
      }

      if (!re.test(filename)) return;

      fsTimeout[type] = true;

      setTimeout(async () => {
        this.readdirectory(dir, type);
        fsTimeout[type] = null;
      }, 5000);
    });
  }
}
