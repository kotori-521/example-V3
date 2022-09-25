import plugin from '../../lib/plugins/plugin.js'
import cfg from '../../lib/config/config.js'
import fetch from "node-fetch"
/**
通过发”ai帮助“会给出提示
 ai帮助：
 1.全局ai:开启全局回复
 2.关闭ai:关闭ai回复
 3.太吵:降低ai回复概率
 4.太安静:提升ai回复概率
 5.重置ai:回到初始概率*/

/** 修改了识别到图片报错问题 */
/** 如果报错，建议卸载这个插件，实在想用ai概率回复用那个“青云客ai（V3,内含多个配置选项）”更稳定 */
/** 测试使用太安静了或者太吵了看是否有反应,有反应就ok */
//感谢前边所有版本的青云客、思知、小爱作者(借鉴挺多ai大佬的代码的)
//使用添加功能用#添加
//虽然但是，ai挺抢指令的，慎用

var BotName = "纳西妲";//你家机器人叫这个，记得改了
var gailv = 1.0;//概率10%，这个是初始概率，重启后就是这个概率，事实上10%就很吵了
var gailv_ = 0.1;//每次条件的概率
const onlyReplyAt = false //群聊是否只关注@信息 建议这个不改了，因为塞了艾特必回复，不想ai概率回直接把概率调0

export class qykai extends plugin {
	constructor() {
		super({
			/** 功能名称 */
			name: 'AIv3',
			/** 功能描述 */
			dsc: 'AIv3',
			/** https://oicqjs.github.io/oicq/#events */
			event: 'message',
			/** 优先级，数字越小等级越高 */
			priority: 60000,
			rule: [
				{
					/** 命令正则匹配 */
					reg: '',
					/** 执行方法 */
					fnc: 'loveai'
				}
			]
		})
	}
	/**
	 *
	 * @param e oicq传递的事件参数e
	 */

	async loveai(e) {
		//艾特回复功能
		if(e.atBot && e.msg){   answer(e)
			return true;
		}
		else{	//控制ai回复概率的模块
			if(!(e.message[0].type == 'text')){console.log("非单一文本信息，不进行处理。");
			return true;
			}
			let j = Math.random();
			if (e.msg.includes('太安静')){
				if (this.checkAuth()) {
					//如果概率等于1
					if (gailv > 0.99) {
						//提示不能修改了
						gailv = 1
						e.reply("很吵了，不能修改了");
						return true;}
					gailv = gailv + gailv_;
					let gailvs = gailv * 100;
					//保留整数
					gailvs = gailvs.toFixed(0);
					let msg=`可以说“ai帮助”调节\n目前AI触发概率：${gailvs}%`;
					this.reply(msg, false, { recallMsg: 5 })
					return true;
				}
			}
			if (e.msg.includes('太吵')) {
				if (this.checkAuth()) {
					//如果概率等于0
					if (gailv < 0.01) {
						//提示不能修改了
						gailv = 0
						let msg='很安静了，不能修改了!';
						this.reply(msg, false, { recallMsg: 5 })
						return true;
					}
					gailv = gailv - gailv_;
					let gailvs = gailv * 100;
					//保留整数
					gailvs = gailvs.toFixed(0);
					let msg= `可以输入“ai帮助”调节\n目前AI触发概率：${gailvs}%`;
					this.reply(msg, false, { recallMsg: 5 })
					return true;
				}
			}
			if (e.msg.includes('关闭ai')){
				if (this.checkAuth()) {
					gailv = 0;
					let msg=`AI已关闭`;
					this.reply(msg, false, { recallMsg: 5 })
					return true;
				}
			}
			if (e.msg.includes('全局ai')){
				if (this.checkAuth()) {
					gailv = 1;
					let msg=`全局AI已打开`;
					this.reply(msg, false, { recallMsg: 5 })
					return true;
				}
			}
			if (e.msg.includes('重置ai')){
				if (this.checkAuth()) {
					gailv = 0.1;
					let msg=`AI回复概率重置回10%`;
					this.reply(msg, false, { recallMsg: 5 })
					return true;
				}
			}
			if (e.msg.includes('ai帮助')){
					let msg='1.全局ai:开启全局回复\n2.关闭ai:关闭ai回复\n3.太吵:降低ai回复概率\n4.太安静:提升ai回复概率\n5.重置ai:回到初始概率';
					e.reply(msg, false, { recallMsg: 15 })
					return true;
			}
			if (j >= gailv||e.msg=="?"||gailv==0)//ai未触发用全局
			{
				console.log("未触发AI回复概率,调整概率可使用ai帮助");
				return true;
			}
			if (e.msg.includes(BotName) || (e.at && e.at == BotConfig.account.qq) || e.isPrivate||!onlyReplyAt)
			{
				console.log("AI消息：", e.msg);
				answer(e);
			return true;
			}
		}
		return true;
	}

	//权限
	/** 获取群号 */
	async getGroupId () {
		if (this.e.isGroup) {
			this.group_id = this.e.group_id
			redis.setEx(this.grpKey, 3600 * 24 * 30, String(this.group_id))
			return this.group_id
		}

		// redis获取
		let groupId = await redis.get(this.grpKey)
		if (groupId) {
			this.group_id = groupId
			return this.group_id
		}

		return false
	}

	checkAuth () {
		if (this.e.isMaster) return true
		let groupCfg = cfg.getGroup(this.group_id)
		if (groupCfg.imgAddLimit == 2) {
			this.e.reply('暂无权限，只有主人才能操作')
			return false
		}
		if (groupCfg.imgAddLimit == 1) {
			if (!Bot.gml.has(this.group_id)) {
				return false
			}
			if (!Bot.gml.get(this.group_id).get(this.e.user_id)) {
				return false
			}
			if (!this.e.member.is_admin) {
				this.e.reply('暂无权限，只有管理员才能操作')
				return false
			}
		}

		if (!this.e.isGroup && groupCfg.addPrivate != 1) {
			this.e.reply('禁止私聊添加')
			return false
		}

		return true
	}

}

//艾特回复
async function answer(e) {
	let xa = e.msg.replace(BotName, "小爱")
	let url_xa = `https://xiaobai.klizi.cn/API/other/xiaoai.php?data=&msg=${xa}`
	let res_xa = await fetch(url_xa)
	res_xa = await res_xa.json()
	if (res_xa) {
		let msg=`${res_xa.text.replace(/小爱/g, BotName)}`;
		msg=msg.replace(/\{.*\}/g, "");
		if(msg.includes('别的')||msg.includes('再说')||msg.includes('怎讲')||msg.includes('话题')){//换思知
			let res = await(await fetch(`https://api.ownthink.com/bot?appid=xiaosi&userid=user&spoken=${e.msg}`)).json()
			if(res)	{
				if(res.data.type == 5000){
					let msg = res.data.info.text.replace(/小思|思知/g,BotName)
					msg=msg.replace(/{(.*)}/g,'')
					if(msg.includes('别的')||msg.includes('再说')||msg.includes('怎讲')||msg.includes('话题')){//换青云客
						let Msg = e.msg.replace(BotName, "菲菲");
						let url = `http://api.qingyunke.com/api.php?key=free&appid=0&msg=${Msg}`;
						let response = await fetch(url);
						let res = await response.json();
						if (res) {
							if (res.result == 0) {
								res.content = res.content.replace(/菲菲/g, BotName);
								res.content = res.content.replace(/{(.*)}/g, '');
								console.log("此为青云客回复");
								e.reply(res.content);
							}
						}
						return true;
					}
					console.log("此为思知回复");
					e.reply(msg)
				}
			}
			return true;}
		console.log("此为小爱回复");

		e.reply(msg);
	}
	return true;
}
