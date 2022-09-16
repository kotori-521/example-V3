import plugin from "../../lib/plugins/plugin.js";
import { segment } from "oicq";

export class yuyin extends plugin {
  constructor() {
    super({
      name: "绿茶语音",
      dsc: "简单开发示例",
      event: "message",
      priority: 5000,
      rule: [
        {
          reg: "^#绿茶语音$",
          fnc: "yuyin",
        },
      ],
    });
  }

 
  async yuyin(e) {
   let url = "http://xiaobapi.top/api/xb/api/lvcha.php";
   e.reply(segment.record(url))
  return true
  }
}
