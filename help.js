import plugin from '../../lib/plugins/plugin.js'
import { segment } from "oicq";
import lodash from "lodash";

const _path = process.cwd();

export class help extends plugin {
  constructor() {
    super({
      name: '额外帮助',
      dsc: '额外帮助',
      event: 'message',
      priority: 500,
      rule: [
        {
          reg: '^#*(娱乐|第二|第2)(命令|帮助|菜单|help|说明|功能|指令|使用说明)$',
          fnc: 'help2'
        }, {
          reg: '^#*(附加|第三|第3)(命令|帮助|菜单|help|说明|功能|指令|使用说明)$',
          fnc: 'help3'
        }, {
          reg: '^#*(命令|帮助|菜单|help|说明|功能|指令|使用说明)$',
          fnc: 'help1'
        }
      ]
    })
  }

  async help2(e) {
    let useImg = true;

    if (e.at && !e.atBot) {
      return;
    }

    let msg = [];

    if (!e.isMaster && e.isGroup && lodash.random(0, 100) <= 0) {
      msg.push("");
    }
    let img;
    if (useImg) {
      img = `file:///${_path}/resources/help/help2.png`;
    }
    else {
      await getHelp();
      if (helpImg) {
        img = `base64://${helpImg}`;
      } else {
        img = `file:///${_path}/resources/help/help2.png`;
      }
    }

    msg.unshift(segment.image(img));

    e.reply(msg);
    return true;
  }

  async help3(e) {
    let useImg = true;

    if (e.at && !e.atBot) {
      return;
    }

    let msg = [];

    if (!e.isMaster && e.isGroup && lodash.random(0, 100) <= 0) {
      msg.push("");
    }
    let img;
    if (useImg) {
      img = `file:///${_path}/resources/help/help3.png`;
    }
    else {
      await getHelp();
      if (helpImg) {
        img = `base64://${helpImg}`;
      } else {
        img = `file:///${_path}/resources/help/help3.png`;
      }
    }

    msg.unshift(segment.image(img));

    e.reply(msg);
    return true;
  }
  
  async help1(e) {
    let useImg = true;

    if (e.at && !e.atBot) {
      return;
    }

    let msg = [];

    if (!e.isMaster && e.isGroup && lodash.random(0, 100) <= 0) {
      msg.push("");
    }
    let img;
    if (useImg) {
      img = `file:///${_path}/resources/help/help1.png`;
    }
    else {
      await getHelp();
      if (helpImg) {
        img = `base64://${helpImg}`;
      } else {
        img = `file:///${_path}/resources/help/help1.png`;
      }
    }

    msg.unshift(segment.image(img));

    e.reply(msg);
    return true;
  }
}