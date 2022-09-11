//by 癫癫博士
//集成了小爱，青云客，思知，夸克四大机器人的插件
//目前支持触发方式 1.群聊提到机器人名字 2.@机器人 3.私聊
//由于个人不喜欢群聊全局随机回复所以并没有此功能，可控的随机才是最好的！
//发送【ai帮助】查看细节

//个人对这几家机器人的评价
//小爱：暖心机器人
//青云客：时而暖心时而嘴臭
//夸克：一问三不知
//思知：发挥不稳定机器人

import plugin from '../../lib/plugins/plugin.js'
import fetch from "node-fetch";

let botname = "荧" //定义你的机器人名字
let ai_choose = "all"

export class morebotmorehappy extends plugin {
	constructor() {
		super({
			/** 功能名称 */
			name: 'ai对比',
			/** 功能描述 */
			dsc: '更多机器人，更多快乐！',
			/** https://oicqjs.github.io/oicq/#events */
			event: 'message',
			/** 优先级，数字越小等级越高 */
			priority: 8000,
			rule: [
				{
					/** 命令正则匹配 */
					reg: '',
					/** 执行方法 */
					fnc: 'morebotmorehappy'
				}
			]
		})
	}

	async morebotmorehappy(e) {
		if (!e.msg || e.msg.charAt(0) == '#') {
		    return
		    }
		    
		    
		    
		//e.msg 用户的命令消息
		console.log("[用户命令]:", e.msg)
		
		if (e.msg.includes('ai帮助')){
		    e.reply("输入【ai选择青云客/思知/小爱/夸克】来选择ai\n或者输入【开启ai对比】来开启全部ai")
		    return true
		}
		if (e.msg.includes('开启ai对比')){
		    ai_choose = "all"
		    e.reply("已开启ai对比，选择你喜欢的ai吧！")
		    return true
		}
		
		if (e.msg.includes('ai选择青云客')){
		    ai_choose = "qyk"
		    e.reply("已将ai切换至青云客")
		    return true
		}

		if (e.msg.includes('ai选择思知')){
		    ai_choose = "sz"
		    e.reply("已将ai切换至思知")
		    return true
		}
		
		if (e.msg.includes('ai选择小爱')){
		    ai_choose = "xa"
		    e.reply("已将ai切换至小爱")
		    return true
		}
		
		if (e.msg.includes('ai选择夸克')){
		    ai_choose = "kk"
		    e.reply("已将ai切换至夸克")
		    return true
		}
		
		if (e.msg.includes(botname) || e.atBot && e.msg || e.isPrivate) {
            if(ai_choose == "all" || ai_choose == "xa"){
                let xa = e.msg.replace(botname, "小爱")
    			let url_xa = `https://xiaobai.klizi.cn/API/other/xiaoai.php?data=&msg=${xa}`
    			let res_xa = await fetch(url_xa)
    			res_xa = await res_xa.json()
    			if (res_xa) {
    			    if (ai_choose == "all"){
    			        e.reply(`小爱回复: ${res_xa.text.replace(/小爱/g, botname)}`)
    			        }
    			    else{
    			        e.reply(`${res_xa.text.replace(/小爱/g, botname)}`)
    			    }
    				}
            }
            

            if(ai_choose == "all" || ai_choose == "qyk"){
    			let qyk = e.msg.replace(botname, "菲菲")
    			let url_qyk = `http://api.qingyunke.com/api.php?key=free&appid=0&msg=${qyk}`
    			let res_qyk = await fetch(url_qyk)
    			res_qyk = await res_qyk.json()
    			if (res_qyk) {
    			    if (ai_choose == "all"){
    			        e.reply(`青云客回复: ${res_qyk.content.replace(/菲菲/g, botname)}`)
    			        }
    			    else{
    			        e.reply(`${res_qyk.content.replace(/菲菲/g, botname)}`)
    			    }
    			}
            }    
			
			if(ai_choose == "all" || ai_choose == "kk"){
    			let kk = e.msg.replace(botname, "夸克宝宝")
    			let url_kk = `https://ovooa.com/API/kuake/api.php?msg=${kk}`
    			let res_kk = await fetch(url_kk)
    			res_kk = await res_kk.json()
    			if (res_kk) {
    			    if (ai_choose == "all"){
    			        e.reply(`夸克回复: ${res_kk.data.desc.replace(/夸克宝宝/g, botname)}`)
    			        }
    			    else{
    			        e.reply(`${res_kk.data.desc.replace(/夸克宝宝/g, botname)}`)
    			    }
    			}
			}
			
			if(ai_choose == "all" || ai_choose == "sz"){
    			let sz = e.msg.replace(botname, "小思")
    			let url_sz = `https://api.ownthink.com/bot?appid=xiaosi&userid=user&spoken=${sz}`
    			let res_sz = await fetch(url_sz)
    			res_sz = await res_sz.json()
    			if (res_sz) {
    			    if (ai_choose == "all"){
    			        e.reply(`思知回复: ${res_sz.data.info.text.replace(/小思/g, botname)}`)
    			        }
    			    else{
    			        e.reply(`${res_sz.data.info.text.replace(/小思/g, botname)}`)
    			    }
    			}
			}
			

			
			
			
			
			
			return true;
		}
		
		else 
		return
	}
}

