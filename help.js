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
          reg: "^#?(命令|帮助|菜单|help|说明|功能|指令|使用说明)$",
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
  let url = `https://gitee.com/ying_Sailor_uniform/background-template/raw/master/%E8%83%8C%E6%99%AF%E6%A8%A1%E6%9D%BF.png`;
  
  let msg = [ 
    segment.image(`file:///${_path}/resources/help.png`),
  ];
    
  //发送消息
  e.reply(msg);
  
  return true; //返回true 阻挡消息不再往下
}
}