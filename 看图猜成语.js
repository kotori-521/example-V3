import { segment } from "oicq";
import plugin from "../../lib/plugins/plugin.js";
import fetch from "node-fetch";

// 问答超时时间，默认120秒
let timeout = 120;

let answerData = {};
let answerCount = {};

export class guessidiom extends plugin {
  constructor() {
    super({
      name: "猜成语",
      dsc: "看图猜成语",
      event: "message",
      priority: 400,
      rule: [
        {
          reg: "^#?猜成语$",
          fnc: "guess",
        },
      ],
    });
  }

  async guess() {
    let response = await fetch("https://xiaobai.klizi.cn/API/other/ccy.php");

    const data = await response.json();

    var user_id = this.e.group_id || this.e.sender.user_id;
    if (!answerData[user_id]) {
      answerData[user_id] = {};
      answerCount[user_id] = 0;
    }

    answerData[user_id] = data;

    this.setContext("guessAnswer", this.e.isGroup, timeout);

    await this.e.reply(segment.image(data.img));
  }

  async guessAnswer() {
    var user_id = this.e.group_id || this.e.sender.user_id;
    if (answerData[user_id].answer == this.e.msg) {
      /** 结束上下文 */
      this.finish("guessAnswer", this.e.isGroup);
      answerCount[user_id] = 0;
      this.e.reply(`答对啦！答案是：${answerData[user_id].answer}`);
      return;
    }

    if (answerCount[user_id] == 4) {
      await this.e.reply(
        `已经错误5次啦！提示信息如下：${answerData[user_id].tips}`
      );
    }

    if (answerCount[user_id] == 9) {
      /** 结束上下文 */
      this.finish("guessAnswer", this.e.isGroup);
      answerCount[user_id] = 0;
      await this.e.reply(
        `答错10次，结束猜词。答案是：${answerData[user_id].answer}`
      );
      return;
    }

    answerCount[user_id] += 1;
  }
}
