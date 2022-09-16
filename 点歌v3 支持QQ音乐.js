import plugin from '../../lib/plugins/plugin.js'
import fetch from 'node-fetch'

export class example extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: '点歌',
      /** 功能描述 */
      dsc: '#点歌 让风告诉你  #网易云 让风告诉你',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 5000,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^#(点歌|网易云)(.*)$',
          /** 执行方法 */
          fnc: 'CeShi'
        }
      ]
    })
  }

  /**
   * #一言
   * @param e oicq传递的事件参数e
   */
  async CeShi (e) {
	if (!e.isGroup) {
		e.reply("只可以在群里点歌哦")
		return true
	}
	let str = e.msg.replace(/\s*/g,"") //删除所有空格
	
	let pingtai = str.substr(1,2)
	let songname = ''
	if (pingtai == '网易'){
		songname = str.substr(4)
	} else {
		songname = str.substr(3)
	}

   if(songname == ""){
	e.reply("请输入歌名")  //判断歌名是否为空
	return true
	}

	if (pingtai == '网易'){
		let url = "https://api.xingzhige.com/API/NetEase_CloudMusic/?name=" + songname + "&mode=QR&type=json&n=1&max=10"; //接口地址
		let response = await fetch(url); //调用接口获取数据
		let res = await response.json(); //结果json字符串转对象
  
		if(res.msg == "成功"){
			str = res.data.songurl
			let n = str.search("id=")
			let songid = str.substring(n+3,str.length)
			e.group.shareMusic("163",Number(songid))
			return true
		} else {
			e.reply("没有找到该歌曲哦") 
		}
	} else { 
		let url = "https://xiaobai.klizi.cn/API/music/vipqqyy.php?data=&msg=" + songname + "&n=1&uin=&skey="; //接口地址
		let response = await fetch(url); //调用接口获取数据
		let res = await response.json(); //结果json字符串转对象	
		if(res.data.songid == null){
			e.reply("没有找到该歌曲哦")
			return true
		} else {
			url = "https://y.qq.com/n/ryqq/songDetail/" + res.data.songid; //接口地址
			response = await fetch(url); //调用接口获取数据
			res = await response.text(); //结果json字符串转对象
			//console.log(res)       
			let n1 = res.indexOf('","id":') + 7
			let n2 = res.indexOf(',',n1)
			e.group.shareMusic("qq",Number(res.slice(n1,n2)))
		}
	}

  return true; //返回true 阻挡消息不再往下

  }
}
