import { segment } from "oicq";
import fetch from "node-fetch";
let domain = "qun.qq.com"; //支持qun.qq.com等多个domain
const cookie = Bot.cookies[domain];
// const bkn = Bot.bkn;
// 食用方法：在群里发送#谁是龙王，即可查看该群吹逼王
// 有问题请不要找@渔火
//V3由果丁修改，有问题不要找，宣传下自己的小群：625882201（狗头），里面没有插件，为了插件进的就算了把
// Yunzai-Bot插件库：  https://github.com/HiArcadia/Yunzai-Bot-plugins-index   https://gitee.com/Hikari666/Yunzai-Bot-plugins-index

// //项目路径
const _path = process.cwd();

//简单应用示例

export class duel extends plugin {
	constructor() {
		super({
			/** 功能名称 */
			name: '谁是龙王',
			/** 功能描述 */
			dsc: '',
			/** https://oicqjs.github.io/oicq/#events */
			event: 'message',
			/** 优先级，数字越小等级越高 */
			priority: 2000,
			rule: [
				{
					/** 命令正则匹配 */
					reg: "^#*(谁|哪个吊毛|哪个屌毛|哪个叼毛)是龙王$", //匹配消息正则，命令正则
					/** 执行方法 */
					fnc: 'dragonKing'
				}
			]
		})
	}

// 谁是龙王============================================================================================
async dragonKing(e) {
  if (!e.isGroup){
    e.reply(`欸，你是指，在我们两个之间，谁是龙王嘛？\n在${(e.groupConfig.botAlias)}心里你就是龙王呀(^ ^)`)
    return true
  }
  // console.log("【cookie】：", cookie)

  let ck = cookie.replace(/=/g, `":"`).replace(/;/g, `","`).replace(/ /g, "").trim()
  ck = ck.substring(0, ck.length - 2)
  ck = `{"`.concat(ck).concat("}")
  //  console.log("【ck】：", ck)
  ck = JSON.parse(ck)
  // console.log(ck)

  // //查询龙王
  let url = `https://ovooa.com/API/Dragon/api?QQ=${(Bot.uin)}&Skey=${(ck.skey)}&pskey=${(ck.p_skey)}&Group=${(e.group_id)}`;
  // console.log(url);

  let response = await fetch(url); //调用接口获取数据
  let res = await response.json(); //结果json字符串转对象
  console.log(res);
  if (res.code == -7) {
    e.reply("龙王的宝座虚位以待~")
    return true
  }
  if (res.code != 1) {
    e.reply("出错了，请稍后重试")
    return true
  }
  let msg = [
    "本群龙王：",
    segment.text(res.data.Nick),
    segment.image(`https://q1.qlogo.cn/g?b=qq&s=0&nk=${res.data.Uin}`),
    "蝉联天数：",
    segment.text(res.data.Day), "天",
  ];
  e.reply(msg);
  return true; //返回true 阻挡消息不再往下
}
}