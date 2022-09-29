//by 癫癫博士
//使用前请确认已安装node-schedule，如未安装，可使用命令npm install node-schedule安装
//定时的摸鱼日历，也可以主动触发，想好今天怎么摸鱼了吗~
//希望大家喜欢^^
//本人没有测试群，不过其他大佬有（比如渔火佬仓库里的其他作者），可以去看看，我也在里面快乐水群^^
//有idea/有提议/发现bug/发现好玩的api的话可以通过gitee评论或者私聊联系我~
//因为功能是靠api完成的，api寄了就不能用了，需要大家及时告诉我，我去换api源
//项目gitee地址：https://gitee.com/huangshx2001/yunzai-js-plug-in

//如出现重复推送的情况，重启yunzai即可解决
import plugin from '../../lib/plugins/plugin.js'
import fetch from 'node-fetch'
import schedule from 'node-schedule'
import {segment} from'oicq'
import common from'../../lib/common/common.js'

//,'754205675'
let groupnumber_list = ['1019878664','750081708','182935418','895582390']//开启定时推送的群号

//let rule =`秒 分 时 * * ?` 改完记得重启一下
//默认早上八点整
let rule =`0 0 8 * * ?`


let url = 'http://api.gt5.cc/api/myr'
let job = schedule.scheduleJob(rule, () => {
    console.log('摸鱼人日历送达');
    for(var i=0;i<groupnumber_list.length;i++){
        let group = Bot.pickGroup(groupnumber_list[i]);
        group.sendMsg(segment.image(url));
        common.sleep(3000)
        group.sendMsg('今日摸鱼人日历已送达');
        }
    }
);

export class moyu extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: '摸鱼日历',
      /** 功能描述 */
      dsc: '主动获得摸鱼日历',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 5000,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '#摸鱼日历',
          /** 执行方法 */
          fnc: 'moyu'
        }
      ]
    })
  }

  async moyu (e) {
    await this.reply(segment.image(url))
  }
}
