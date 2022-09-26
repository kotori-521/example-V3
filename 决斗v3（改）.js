import plugin from '../../lib/plugins/plugin.js'
import { segment } from "oicq";
import fs from "fs";
import fetch from "node-fetch";
import schedule from "node-schedule";
import moment from "moment";
import { promisify } from "util";
import { pipeline } from "stream";
//项目路径
let duelCD = {};
let exerciseCD = {};
//如果报错请删除Yunzai/data/目录中lin文件夹
const dirpath = "data/lin/";//文件夹路径
var filename = `battle`;//文件名
if (filename.indexOf(".json") == -1) {//如果文件名不包含.json
	filename = filename + ".json";//添加.json
}
let Template = {//创建该用户
	"energy": 0,
	"level": 0,
	"levels": '无境界',
	"Privilege": 0,
};
//配置一些有意思的参数
let Magnification = 1 //战斗力依赖系数，这个越大，战斗力意义越大
let Cooling_time = 300 //命令间隔时间，单位秒，这是决斗的冷却时间#初始为300秒
let Cooling_time2 = 300 //命令间隔时间，单位分钟，这是锻炼的冷却时间#初始为300分钟

export class seelevel extends plugin {
	constructor() {
		super({
			/** 功能名称 */
			name: '我的境界',
			/** 功能描述 */
			dsc: '',
			/** https://oicqjs.github.io/oicq/#events */
			event: 'message',
			/** 优先级，数字越小等级越高 */
			priority: 1000,
			rule: [
				{
					/** 命令正则匹配 */
					reg: "^#我的(境界|战斗力)$", //匹配消息正则，命令正则
					/** 执行方法 */
					fnc: 'seelevel'
				}, {
					/** 命令正则匹配 */
					reg: "^#决斗(规则|帮助)$", //匹配消息正则，命令正则
					/** 执行方法 */
					fnc: 'rules'
				}
			]
		})
	}
	/**
	 * 
	 * @param e oicq传递的事件参数e
	 */
	async seelevel(e) {
		if (!fs.existsSync(dirpath)) {//如果文件夹不存在
			fs.mkdirSync(dirpath);//创建文件夹
		}
		if (!fs.existsSync(dirpath + "/" + filename)) {//如果文件不存在
			fs.writeFileSync(dirpath + "/" + filename, JSON.stringify({//创建文件
			}));
		}
		var json = JSON.parse(fs.readFileSync(dirpath + "/" + filename, "utf8"));//读取文件
		if (json[e.user_id].energy < 1) {
			json[e.user_id].energy = 0
		}//当战斗力小于1时，自动归零
		if (json[e.user_id].energy < 15) {
			json[e.user_id].level = 0
			json[e.user_id].levels = '无境界'
		}
		else if (json[e.user_id].energy < 30) {
			json[e.user_id].level = 1
			json[e.user_id].levels = '小乘境初期'
		}
		else if (json[e.user_id].energy < 45) {
			json[e.user_id].level = 2
			json[e.user_id].levels = '小乘境中期'
		}
		else if (json[e.user_id].energy < 55) {
			json[e.user_id].level = 3
			json[e.user_id].levels = '小乘境后期'
		}
		else if (json[e.user_id].energy < 60) {
			json[e.user_id].level = 3
			json[e.user_id].levels = '小乘境巅峰'
		}
		else if (json[e.user_id].energy < 80) {
			json[e.user_id].level = 4
			json[e.user_id].levels = '大乘境初期'
		}
		else if (json[e.user_id].energy < 100) {
			json[e.user_id].level = 5
			json[e.user_id].levels = '大乘境中期'
		}
		else if (json[e.user_id].energy < 110) {
			json[e.user_id].level = 6
			json[e.user_id].levels = '大乘境后期'
		}
		else if (json[e.user_id].energy < 120) {
			json[e.user_id].level = 6
			json[e.user_id].levels = '大乘境巅峰'
		}
		else if (json[e.user_id].energy < 145) {
			json[e.user_id].level = 7
			json[e.user_id].levels = '宗师境初期'
		}
		else if (json[e.user_id].energy < 170) {
			json[e.user_id].level = 8
			json[e.user_id].levels = '宗师境中期'
		}
		else if (json[e.user_id].energy < 190) {
			json[e.user_id].level = 9
			json[e.user_id].levels = '宗师境后期'
		}
		else if (json[e.user_id].energy < 200) {
			json[e.user_id].level = 9
			json[e.user_id].levels = '宗师境巅峰'
		}
		else if (json[e.user_id].energy < 240) {
			json[e.user_id].level = 10
			json[e.user_id].levels = '至臻境初期'
		}
		else if (json[e.user_id].energy < 280) {
			json[e.user_id].level = 11
			json[e.user_id].levels = '至臻境中期'
		}
		else if (json[e.user_id].energy < 300) {
			json[e.user_id].level = 12
			json[e.user_id].levels = '至臻境后期'
		}
		else if (json[e.user_id].energy < 320) {
			json[e.user_id].level = 12
			json[e.user_id].levels = '至臻境巅峰'
		}
		else {
			json[e.user_id].level = 13
			json[e.user_id].levels = '返璞归真'
		}
		e.reply(`你的境界是${json[e.user_id].levels},你的战斗力是${json[e.user_id].energy}`)
		fs.writeFileSync(dirpath + "/" + filename, JSON.stringify(json, null, "\t"));//写入文件
		return
	}
	async rules(e) {
		e.reply(`指令：#御前决斗 #锻炼|早睡 #我的境界\n#设置半步管理员 #移除半步管理员\n挑战成功：自己战斗力-3，对方战斗力不变\n挑战失败：自己战斗力-1，对方战斗力-2\n战斗力每日自动-1`)
		return
	}
}
export class master extends plugin {//设置半步管理员
	constructor() {
		super({
			/** 功能名称 */
			name: '我的境界',
			/** 功能描述 */
			dsc: '',
			/** https://oicqjs.github.io/oicq/#events */
			event: 'message',
			/** 优先级，数字越小等级越高 */
			priority: 1000,
			rule: [
				{
					/** 命令正则匹配 */
					reg: "^#(设置|移除)半步管理员(.*)$", //匹配消息正则，命令正则
					/** 执行方法 */
					fnc: 'master'
				}
			]
		})
	}
	/**
	 * 
	 * @param e oicq传递的事件参数e
	 */
	//e.msg 用户的命令消息
	async master(e) {
		console.log("用户命令：", e.msg);
		if (!e.group.is_admin) { //检查是否为管理员
			e.reply('我不是管理员，不能设置半步管理员啦~');
			return true;
		}
		if (!e.at) {
			e.reply('不知道你要设置谁为半步管理员哦~');
			return true;
		}
		if (!e.isMaster) {
			e.group.muteMember(e.user_id, 1);
			e.reply([segment.at(e.user_id), `\n凡人，休得僭越！`]);
			return true
		}
		let user_id2 = e.at; //获取当前at的那个人
		let user_id2_nickname = null
		for (let msg of e.message) { //赋值给user_id2_nickname
			if (msg.type === 'at') {
				user_id2_nickname = msg.text//获取at的那个人的昵称
				break;
			}
		}
		if (!fs.existsSync(dirpath)) {//如果文件夹不存在
			fs.mkdirSync(dirpath);//创建文件夹
		}
		if (!fs.existsSync(dirpath + "/" + filename)) {//如果文件不存在
			fs.writeFileSync(dirpath + "/" + filename, JSON.stringify({//创建文件
			}));
		}
		var json = JSON.parse(fs.readFileSync(dirpath + "/" + filename, "utf8"));//读取文件
		if (!json.hasOwnProperty(user_id2)) {//如果json中不存在该用户
			json[user_id2] = Template
		}
		if (e.msg.includes("设置")) {
			json[user_id2].Privilege = 1
			fs.writeFileSync(dirpath + "/" + filename, JSON.stringify(json, null, "\t"));//写入文件
			console.log(`${user_id2}成为半步管理员`); //输出日志
			e.reply([segment.at(e.user_id),
			`设置半步管理员成功\n🎉恭喜${user_id2_nickname}成为半步管理员`]);//发送消息
			return true; //返回true 阻挡消息不再往下}
		} else {
			json[user_id2].Privilege = 0
			fs.writeFileSync(dirpath + "/" + filename, JSON.stringify(json, null, "\t"));//写入文件
			console.log(`${user_id2}成为半步管理员`); //输出日志
			e.reply([segment.at(e.user_id),
			`移除半步管理员成功\n🎉恭喜${user_id2_nickname}成为半步管理员`]);//发送消息
			return true; //返回true 阻挡消息不再往下
		}
	}
}
export class duel extends plugin {//决斗
	constructor() {
		super({
			/** 功能名称 */
			name: '我的境界',
			/** 功能描述 */
			dsc: '',
			/** https://oicqjs.github.io/oicq/#events */
			event: 'message',
			/** 优先级，数字越小等级越高 */
			priority: 1000,
			rule: [
				{
					/** 命令正则匹配 */
					reg: "^#*(发起|开始|和我|与我|御前)决斗(.*)$", //匹配消息正则，命令正则
					/** 执行方法 */
					fnc: 'duel'
				}
			]
		})
	}
	/**
	 * 
	 * @param e oicq传递的事件参数e
	 */
	//e.msg 用户的命令消息
	async duel(e) {
		console.log("用户命令：", e.msg);
		//检查是否有必要权限
		if (!e.group.is_admin) { //检查是否为管理员
			e.reply('我不是管理员，不能主持御前决斗啦~');
			return true;
		}
		if (!e.at) {
			e.reply('不知道你要与谁决斗哦，请@你想决斗的人~');
			return true;
		}
		if (e.at == BotConfig.account.qq) {
			e.group.muteMember(e.user_id, 1);
			e.reply([segment.at(e.user_id), `\n你什么意思？举办了`]);
			return true
		}
		//判定双方存在管理员或群主则结束
		if (e.sender.role == "owner" || e.sender.role == "admin" || e.group.pickMember(e.at).is_owner || e.group.pickMember(e.at).is_admin) {//判定双方是否存在管理员或群主
			e.reply("你们之中有人是管理员，游戏不公平，御前决斗无法进行哦")
			return true
		}
		let user_id = e.user_id;
		let user_id2 = e.at; //获取当前at的那个人
		if (user_id == user_id2) { //判定是否为自己
			e.group.muteMember(e.user_id, 1);
			e.reply([segment.at(e.user_id), `\n...好吧，成全你`]);
			return true;
		}
		if (duelCD[e.user_id]) { //判定是否在冷却中
			e.reply(`你刚刚发起了一场决斗，请耐心一点，等待${Cooling_time}秒后再次决斗吧！`);
			return true;
		}
		let user_id2_nickname = null
		for (let msg of e.message) { //赋值给user_id2_nickname
			if (msg.type === 'at') {
				user_id2_nickname = msg.text//获取at的那个人的昵称
				break;
			}
		}
		duelCD[e.user_id] = true;
		duelCD[e.user_id] = setTimeout(() => {//冷却时间
			if (duelCD[e.user_id]) {
				delete duelCD[e.user_id];
			}
		}, Cooling_time * 1000);
		if (!fs.existsSync(dirpath)) {//如果文件夹不存在
			fs.mkdirSync(dirpath);//创建文件夹
		}
		if (!fs.existsSync(dirpath + "/" + filename)) {//如果文件不存在
			fs.writeFileSync(dirpath + "/" + filename, JSON.stringify({//创建文件
			}));
		}
		var json = JSON.parse(fs.readFileSync(dirpath + "/" + filename, "utf8"));//读取文件
		if (!json.hasOwnProperty(user_id)) {//如果json中不存在该用户
			json[e.user_id] = Template
		}
		if (!json.hasOwnProperty(user_id2)) {//如果json中不存在该用户
			json[user_id2] = Template
		}

		let level = json[user_id].level
		let energy = json[user_id].energy
		let level2 = json[user_id2].level
		let energy2 = json[user_id2].energy
		//计算实时战斗力的影响,等级在1-13级之间
		//  随机加成部分    +      境界加成部分 * 战斗力 * 随机发挥效果 //最大战斗力差为18*1.5*energy
		let i = Math.random() * 100 + (level + 5) * energy * (0.5 + Math.random()) * 0.1 * Magnification
		let j = Math.random() * 100 + (level2 + 5) * energy2 * (0.5 + Math.random()) * 0.1 * Magnification
		e.reply([segment.at(e.user_id),
		`\n你的境界为${json[user_id].levels}\n${user_id2_nickname}的境界是${json[user_id2].levels}\n决斗开始！`]);//发送消息
		if ((i > j && !json[user_id2].Privilege == 1) || json[user_id].Privilege == 1) {//判断是否成功
			json[user_id].energy -= 3
			setTimeout(() => {
				let k = Math.round((i - j) / 60)
				if (k < 0) {
					k = 1
				}
				i = Math.round(i)
				j = Math.round(j)
				e.group.muteMember(user_id2, (k + 1) * 60); //禁言
				e.reply([segment.at(e.user_id),
				`你实际发挥战斗力${i},${user_id2_nickname}实际发挥战斗力${j}\n🎉恭喜你与${user_id2_nickname}决斗成功。\n🎁${user_id2_nickname}已被禁言${k}分钟！`]);//发送消息
			}, 5000);//设置延时
		}
		else {
			json[user_id].energy--
			json[user_id2].energy -= 2
			setTimeout(() => {
				let k = Math.round((j - i) / 60)
				i = Math.round(i)
				j = Math.round(j)
				e.group.muteMember(user_id, (k + 1) * 60); //禁言
				e.reply([segment.at(e.user_id), `你实际发挥战斗力${i},${user_id2_nickname}实际发挥战斗力${j}\n你与${user_id2_nickname}决斗失败。\n您已被禁言${k}分钟！`]);//发送消息
			}, 5000);//设置延时
		}//战斗力小于0时候重置战斗力
		if (json[user_id].energy < 0) { json[user_id].energy = 0 }
		if (json[user_id2].energy < 0) { json[user_id2].energy = 0 }
		console.log(`发起者：${user_id}被动者： ${user_id2}随机时间：${i}秒钟`); //输出日志
		fs.writeFileSync(dirpath + "/" + filename, JSON.stringify(json, null, "\t"));//写入文件
		return true; //返回true 阻挡消息不再往下}

	}
}
export class exercise extends plugin {//锻炼
	constructor() {
		super({
			/** 功能名称 */
			name: '我的境界',
			/** 功能描述 */
			dsc: '',
			/** https://oicqjs.github.io/oicq/#events */
			event: 'message',
			/** 优先级，数字越小等级越高 */
			priority: 1000,
			rule: [
				{
					/** 命令正则匹配 */
					reg: "^#(发起|开始)?(锻炼|早睡)(.*)$", //匹配消息正则，命令正则
					/** 执行方法 */
					fnc: 'exercise'
				}
			]
		})
	}
	/**
	 * 
	 * @param e oicq传递的事件参数e
	 */
	async exercise(e) {
		console.log("用户命令：", e.msg);
		let user_id = e.user_id;
		if (exerciseCD[e.user_id]) { //判定是否在冷却中
			e.reply(`你刚刚进行了一次锻炼，请耐心一点，等待${Cooling_time2}分钟后再次锻炼吧！`);
			return;
		}
		if (filename.indexOf(".json") === -1) {//如果文件名不包含.json
			filename = filename + ".json";//添加.json
		}
		if (!fs.existsSync(dirpath)) {//如果文件夹不存在
			fs.mkdirSync(dirpath);//创建文件夹
		}
		if (!fs.existsSync(dirpath + "/" + filename)) {//如果文件不存在
			fs.writeFileSync(dirpath + "/" + filename, JSON.stringify({//创建文件
			}));
		}
		const json = JSON.parse(fs.readFileSync(dirpath + "/" + filename));//读取文件
		if (!json.hasOwnProperty(e.user_id)) {//如果json中不存在该用户
			json[e.user_id] = Template
		}
		exerciseCD[e.user_id] = true;
		exerciseCD[e.user_id] = setTimeout(() => {//冷却时间
			if (exerciseCD[e.user_id]) {
				delete exerciseCD[e.user_id];
			}
		}, Cooling_time2 * 1000 * 60);
		const date = new Date();
		let energy_ = 0
		let hours = date.getHours()
		if (hours >= 6 && hours <= 8) {
			energy_ = Math.round(3 + 2 * Math.random())
			e.reply([segment.at(e.user_id),
			`\n🎉恭喜你获得了${energy_}点战斗力,一日之计在于晨，清晨锻炼效果更好哦！\n你的战斗力为:${json[user_id].energy}\n你的境界为${json[user_id].levels}`]);//发送消息
		} else if (hours >= 8 && hours <= 20) {
			energy_ = Math.round(1 + 2 * Math.random())
			e.reply([segment.at(e.user_id),
			`\n🎉恭喜你获得了${energy_}点战斗力！\n你的战斗力为:${json[user_id].energy}\n你的境界为${json[user_id].levels}`]);//发送消息
		} else if (hours >= 20 && hours <= 22 && e.msg.includes('早睡')) {
			e.group.muteMember(user_id, 60 * 60 * 8); //禁言
			energy_ = Math.round(3 + 3 * Math.random())
			e.reply([segment.at(e.user_id),
			`\n🎉早睡早起好习惯，恭喜你获得了${energy_}点战斗力！\n你的战斗力为:${json[user_id].energy}\n你的境界为${json[user_id].levels}`]);//发送消息
		} else {
			energy_ = 1
			e.reply([segment.at(e.user_id),
			`\n由于睡太晚，你只获得了${energy_}点战斗力！\n你的战斗力为:${json[user_id].energy}\n你的境界为${json[user_id].levels}`]);//发送消息
		}
		json[user_id].energy += energy_
		fs.writeFileSync(dirpath + "/" + filename, JSON.stringify(json, null, "\t"));//写入文件
		return true;
	}
}
schedule.scheduleJob('0 0 4 * * *', function () {//每日战斗力-1
	if (!fs.existsSync(dirpath)) {//如果文件夹不存在
		fs.mkdirSync(dirpath);//创建文件夹
	}
	if (!fs.existsSync(dirpath + "/" + filename)) {//如果文件不存在
		fs.writeFileSync(dirpath + "/" + filename, JSON.stringify({//创建文件
		}));
	}
	var json = JSON.parse(fs.readFileSync(dirpath + "/" + filename));//读取文件
	for (let key in json) {//遍历json
		if (json[key].energy < 1) {
			json[key].energy = 0
		}
		if (json[key].energy >= 1) {
			json[key].energy--
		}
		if (json[key].energy < 15) {
			json[key].level = 0
			json[key].levels = '无境界'
		}
		else if (json[key].energy < 30) {
			json[key].level = 1
			json[key].levels = '小乘境初期'
		}
		else if (json[key].energy < 45) {
			json[key].level = 2
			json[key].levels = '小乘境中期'
		}
		else if (json[key].energy < 55) {
			json[key].level = 3
			json[key].levels = '小乘境后期'
		}
		else if (json[key].energy < 60) {
			json[key].level = 3
			json[key].levels = '小乘境巅峰'
		}
		else if (json[key].energy < 80) {
			json[key].level = 4
			json[key].levels = '大乘境初期'
		}
		else if (json[key].energy < 100) {
			json[key].level = 5
			json[key].levels = '大乘境中期'
		}
		else if (json[key].energy < 110) {
			json[key].level = 6
			json[key].levels = '大乘境后期'
		}
		else if (json[key].energy < 120) {
			json[key].level = 6
			json[key].levels = '大乘境巅峰'
		}
		else if (json[key].energy < 145) {
			json[key].level = 7
			json[key].levels = '宗师境初期'
		}
		else if (json[key].energy < 170) {
			json[key].level = 8
			json[key].levels = '宗师境中期'
		}
		else if (json[key].energy < 190) {
			json[key].level = 9
			json[key].levels = '宗师境后期'
		}
		else if (json[key].energy < 200) {
			json[key].level = 9
			json[key].levels = '宗师境巅峰'
		}
		else if (json[key].energy < 240) {
			json[key].level = 10
			json[key].levels = '至臻境初期'
		}
		else if (json[key].energy < 280) {
			json[key].level = 11
			json[key].levels = '至臻境中期'
		}
		else if (json[key].energy < 300) {
			json[key].level = 12
			json[key].levels = '至臻境后期'
		}
		else if (json[key].energy < 320) {
			json[key].level = 12
			json[key].levels = '至臻境巅峰'
		}
		else {
			json[key].level = 13
			json[key].levels = '返璞归真'
		}
	}
	fs.writeFileSync(dirpath + "/" + filename, JSON.stringify(json, null, "\t"));//写入文件
}
);