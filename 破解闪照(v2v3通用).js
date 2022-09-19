import { segment } from 'oicq'
import fs from 'fs'

//闪照二改，增加适配性(v2v3通用)
//收到闪照发给主人
//感谢原不知名作者

Bot.on("message", (e) => {
  for (let msg of e.message) {
    switch (msg.type) {
      case "flash": {
        let Msg = [`闪照提醒:\n发送者：${e.sender.nickname}（${e.sender.user_id}）\n群聊：${e.group_id}\n`,segment.image(msg.url),]
        let packageStr = fs.readFileSync('package.json', 'utf8');
        let packageJson = JSON.parse(packageStr);
        if (packageJson.version[0] === '3') {
          import('../../lib/config/config.js').then(res => {
            Bot.pickUser(res.default.masterQQ[0])?.sendMsg(Msg);
          });
        }
        else
          Bot.pickUser(global.BotConfig ? global.BotConfig.masterQQ[0] : 0)?.sendMsg(Msg);
        return false;
      }
      default: break;
    }
  }
  return false;
});
