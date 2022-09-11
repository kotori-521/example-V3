import { segment } from "oicq";
import plugin from "../../lib/plugins/plugin.js";
import fetch from "node-fetch";

export class example extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: '查委托',
      /** 功能描述 */
      dsc: '查看每日委托是否有隐藏成就',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 500,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^#*查委托(.*)',
          /** 执行方法 */
          fnc: 'task123321'
        }
      ]
    })
  }


  async task123321 (e) {
      
    if ( !e.msg.replace(/#|＃|查委托| /g, ""))  //添加直接发送#查委托指令时机器人的回复
    {
    e.reply("查看原神每日委托是否有隐藏成就，请输入要查询的每日委托名称，如#查委托愿风带走思念")
    return
    }

  let url = "http://114.132.218.87:12583/api/genshin/task/" + e.msg.replace(/#|＃|查委托| /g, ""); //一言接口地址
  let response = await fetch(url);//调用接口获取数据
  let data = await response.json();//结果json字符串转对象
  let msg, name, code = response.status;
  if (code != 200 && code != 201) return;//请求不成功
  function requestOK() {
    if (data.hidden == true) {//判断是不是隐藏
      name = "隐藏成就" + ('《' + data.name + '》\n')
    } else {
      name = "成就" + ('《' + data.name + '》\n')
    }
    msg = data.desc + "\n"
    for (var key of data.involve) {
      if (key.type == '世界任务') break;
      msg += '每日委托' + ('《' + key.task + '》\n')
    }
    msg += "————\n" + data.msg + "\n————\n※ 文案: B站 oz水银"//大佬写的文案，建议保留，不然人家哪天就不更新了
    //console.log(`\u001b[32m[Get]\u001b[0m 已发送到\u001b[35m${e.user_id}\u001b[0m`)
  //最后回复消息
  //发送消息
    e.reply(name + msg);
  };
  if (code == 201) return e.reply(data.msg);
  if (code == 200) return requestOK();
  return true; //返回true 阻挡消息不再往下
}
}