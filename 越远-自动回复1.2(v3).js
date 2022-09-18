import plugin from '../../lib/plugins/plugin.js'
//这个插件你可以加一个后缀，多安装几个，例如自动回复1.1-原神YunzaiBot群，用于不同的群。
//1.1： 2022.7.23越追越远学习派蒙语音3.0，自动点赞，撤回监听改编
//1.2： 修复了bug

let 完全匹配 = false; //是否完全匹配 true:完全 false:只要有这个词
const hmd_userqq = []; //对于某用户黑名单 ,隔开
//！！！！！！！！！！！！！！！！！！！！！！！！
const bmd_GroupQQ = []; //需要使用的群的白名单 ,隔开，没有则全局
//！！！！！！！！！！！！！！！！！！！！！！！！
let alllist = Bot.gl
var bmd = bmd_GroupQQ
bmd = [];
// 匹配列表
// 可以使用|分割关键词
//判断白名单列表为空，已开启全局模式
if (bmd_GroupQQ.length == 0)
  for (var key of alllist) {
    bmd.push(key[0])
  }
// 正则
export class aireply extends plugin {
  constructor() {
    super({
      name: 'reply--',
      dsc: '群里自动回复萌新好工具',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      priority: 10005,
      rule: [{
        /** 命令正则匹配 */
        reg: '(.*)回复(.*)',
        /** 执行方法 */
        fnc: 'reply1'
      },
      { reg: '(.*)插件(.*)', fnc: 'reply2' },
      { reg: '(.*)色色(.*)', fnc: 'reply3' },
      { reg: '(.*)签到(.*)', fnc: 'reply4' },
      ]
    })
  }
  reply1(e) {
    let msg = ["我可以自动回复哦!", "我会自动回复哦！"]
    e.reply(msg[Math.floor(Math.random() * msg.length)]);
    return;
  }
  reply2(e) {
    let msg = ["v2放lib/example  v3放plugins/example"]
    e.reply(msg[Math.floor(Math.random() * msg.length)]);
    return;
  }
  reply3(e) {
    let msg = ["sese会导致封禁各位群友小心"]
    e.reply(msg[Math.floor(Math.random() * msg.length)]);
    return;
  }
  reply4(e) {
    let msg = ["会自动签到吧！"]
    e.reply(msg[Math.floor(Math.random() * msg.length)]);
    return;
  }
}