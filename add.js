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
          reg: "^更新面板$",
          fnc: 'help'
        },      
      ]
    })

  }

//2.编写功能方法
//方法名字与rule中的examples保持一致
//测试命令 npm test 例子
 async  help(e) {
  //e.msg 用户的命令消息
  console.log("用户命令：", e.msg);
  //执行的逻辑功能
  let url = `https://ts1.cn.mm.bing.net/th/id/R-C.bb6fa5888ddcaac9bdf918051c5fe61b?rik=PhxTwPlBvHU%2fIA&riu=http%3a%2f%2fwww.sktfaker.com%2fwp-content%2fuploads%2f2020%2f10%2f2020102307305779.jpg&ehk=O%2fRPkGv1REw3AKQa21mO7R0AcCH5HIffIOtlkOVDrBY%3d&risl=&pid=ImgRaw&r=0`;
  
  let msg = [ 
    segment.at(e.user_id),
	 "\n请发送#更新面板，小可爱",	
    segment.image(url),
  ];
    
  //发送消息
  e.reply(msg);
  
  return true; //返回true 阻挡消息不再往下
}
}