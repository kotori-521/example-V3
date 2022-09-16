import plugin from "../../lib/plugins/plugin.js";
import fetch from "node-fetch";
import { segment } from 'oicq';


//摸鱼群556773432，有事联系@林木森


export class mryw extends plugin {
  constructor() {
    super({
      name: "每日一文",
      dsc: "简单开发示例",
      event: "message",
      priority: 5000,
      rule: [
        {
          reg: "^#每日一文",
          fnc: "mryw",
        },
        {
          reg: "^#公历",
          fnc: "gl",
        },
        {
          reg: "^#绕口令",
          fnc: "rkl",
        },
      ],
    });
  }

  /**
   * @param e oicq传递的事件参数e
   */
  async mryw(e) {
    logger.info("[用户命令]", e.msg);

    let url = "http://xiaobapi.top/api/xb/api/article_of_the_day.php?type=json";
    let response = await fetch(url);
    let res = await response.json();

    let msg = [
	    segment.text(res.data.title),
      "\n",
      segment.text(res.data.author),
      "\n",
      segment.text(res.data.content),
      "\n",
      segment.text(res.data.time),
    ];

    await this.reply(msg)
  }

  async gl(e) {
    logger.info("[用户命令]", e.msg);

    let url = "http://ovooa.com/API/rl/api.php?type=json";
    let response = await fetch(url);
    let res = await response.json();

    let msg = [
	    segment.text(res.data.AD),
      "\n",
      segment.text(res.data.lunar),
      "\n",
      segment.text(res.data.zodiac),
      "\n",
      segment.text(res.data.knob),
    ];

    await this.reply(msg)
  }

  async rkl(e) {
    logger.info("[用户命令]", e.msg);

    let url = "http://ovooa.com/API/rao/api.php?type=json";
    let response = await fetch(url);
    let res = await response.json();

    let msg = [
	    segment.text(res.data.title),
      "\n",
      segment.text(res.data.Msg)
    ];

    await this.reply(msg)
  }
}
