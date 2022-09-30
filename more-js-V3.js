import { segment } from "oicq";
import fetch from "node-fetch";

//项目路径
const _path = process.cwd();

//简单应用示例

//1.定义命令规则
export class more_js extends plugin {
  constructor () {
    super({
      name: 'more js',
      dsc: '二次元/随机头像/摸鱼日历',
      event: 'message',
      priority: 500,
      rule: [
        {
          reg: "^#?(来个老婆|二次元|随机老婆)$",
          fnc: 'wife'
        },
        {
          reg: "^#?(来个头像|随机头像)$",
          fnc: 'random'
        },
        {
          reg: "^#?(摸鱼日历)$",
          fnc: 'calendar'
        },
	  reg: "^#?(人间)$",
          fnc: 'rj'
        },
  	{
          reg: '^#*(.*)天气$',
          fnc: 'Tianqi'
        },      
      ]
    })

  }

//2.编写功能方法
//方法名字与rule中的examples保持一致
//测试命令 npm test 例子
 async  wife(e) {
  //e.msg 用户的命令消息
  console.log("用户命令：", e.msg);
  //执行的逻辑功能
  let url = `https://api.oick.cn/random/api.php?type=pc`;
  
  let msg = [ 
    segment.at(e.user_id),  
    segment.image(url),
  ];
    
  //发送消息
  e.reply(msg);
  
  return true; //返回true 阻挡消息不再往下
}

 async  random(e) {
  //e.msg 用户的命令消息
  console.log("用户命令：", e.msg);
  //执行的逻辑功能
  let url = `https://api.vvhan.com/api/avatar`;
  
  let msg = [ 
    segment.at(e.user_id),  
    segment.image(url),
  ];
    
  //发送消息
  e.reply(msg);
  
  return true; //返回true 阻挡消息不再往下
}

 async  calendar(e) {
  //e.msg 用户的命令消息
  console.log("用户命令：", e.msg);
  //执行的逻辑功能
  let url = `http://api.gt5.cc/api/myr`;
  
  let msg = [ 
    segment.at(e.user_id),  
    segment.image(url),
  ];
    
  //发送消息
  e.reply(msg);
  
  return true; //返回true 阻挡消息不再往下
}

  async Tianqi (e) {
    if ( !e.msg.replace(/#|＃|天气| /g, ""))  return e.reply("请输入#XX天气",true)
  let res = await fetch("http://api.qingyunke.com/api.php?key=free&appid=0&msg=" + e.msg.replace(/#|＃| /g, "")).catch((err) => logger.error(err))
    if (!res)  return e.reply('天气接口请求失败')
    res = await res.json()//返回json
     e.reply(`${res.content.replace(/{br}/g,'\n')}`,true)//发送引用消息（content节替换所有{br}为换行）
	 return true;
}
 async rj (e) {
        /** e.msg 用户的命令消息 */
        logger.info('[用户命令]', e.msg)
        let url = 'https://api.gt5.cc/api/rj'
        /** 调用接口获取数据 */
        let res = await fetch(url).catch((err) => logger.error(err))
    
        /** 判断接口是否请求成功 */
        if (!res) {
          logger.error('[人间凑数] 接口请求失败')
          return await this.reply('人间凑数接口请求失败')
        }

        res = await res.text()
        /** 输入日志 */
        logger.info(`[接口结果] 人间凑数：${res}`)
    
        /** 最后回复消息 */
        await this.reply(`${res}`)
    }
}
