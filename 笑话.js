import plugin from "../../lib/plugins/plugin.js";
import { segment } from 'oicq';
import fetch from "node-fetch";

export class xh extends plugin {
  constructor() {
    super({
      name: "笑话",
      dsc: "简单开发示例",
      event: "message",
      priority: 5000,
      rule: [
        {
          reg: "^#讲个笑话$",
          fnc: "xh",
        },
      ],
    });
  }
  
  async xh(e) {
    logger.info('[用户命令]', e.msg)
    
    let url = `http://ovooa.com/API/xiaohua/api.php?`;
    
    let response = await fetch(url);
    
    let res = await response.text();

    let msg = [
	    segment.text(res)
    ];

    await this.reply(msg)
  
  }
}