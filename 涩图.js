import plugin from '../../lib/plugins/plugin.js';
import GachaData from '../genshin/model/gachaData.js'
import { segment } from "oicq";
import fetch from "node-fetch";

export class Setu extends plugin {
  constructor() {
    super({
      name: '色图',
      dsc: '色图',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '色图',
          fnc: 'setu'
        }
      ]
    })
  }

  async setu () {
    let response = await fetch(`https://api.lolicon.app/setu/v2?tag=原神&r18=0`);
    let res = await response.json();
    var obj = res.data[0];
    var title = obj.title;
    var author = obj.author;
    // this.e.reply(["标题： ", segment.text(title), "\n作者： ", segment.text(author), "\n", segment.image(obj.urls.original)]);
    
    this.GachaData = await GachaData.init(this.e);

    /** 撤回消息 */
    let recallMsg = this.GachaData.set.delMsg;

    await this.reply(["标题： ", segment.text(title), "\n作者： ", segment.text(author), "\n", segment.image(obj.urls.original)], false, { recallMsg })
    
    //  this.e.reply('我知道你很急,但你先别急.我还在开发...');
  }

}
