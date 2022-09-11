import plugin from '../../lib/plugins/plugin.js'
import fetch from "node-fetch";
import lodash from "lodash";
import { segment } from "oicq";



//作者:癫癫博士  100813450 (官服)

//初心是为了让搞python不方便的朋友门也能使用表情制作，类似于宵鸟的那个，不过不需要依赖python ^^

//当然功能肯定比不上宵鸟了，目前只有@群友生成表情，之后有空再加

//接口地址：https://ovooa.com/

//输入命令 表情帮助 获取表情列表
//附上一个随机壁纸功能 输入 随机壁纸即可获取
const _path = process.cwd();
export class example extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: '表情制作',
      /** 功能描述 */
      dsc: '表情制作，不需要依赖python',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 5000,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '表情帮助',
          /** 执行方法 */
          fnc: 'help'
        },
        {
          /** 命令正则匹配 */
          reg: '随机壁纸',
          /** 执行方法 */
          fnc: 'wallpaper'
        },
        {
          /** 命令正则匹配 */
          reg: '^舔(.*)$',
          /** 执行方法 */
          fnc: 'lick'
        },
        {
          /** 命令正则匹配 */
          reg: '^咬(.*)$',
          /** 执行方法 */
          fnc: 'eat'
        },
        {
          /** 命令正则匹配 */
          reg: '^高质量(.*)$',
          /** 执行方法 */
          fnc: 'high_quality'
        },
        {
          /** 命令正则匹配 */
          reg: '^摸(.*)$',
          /** 执行方法 */
          fnc: 'touch'
        },
        {
          /** 命令正则匹配 */
          reg: '^捣(.*)$',
          /** 执行方法 */
          fnc: 'squeeze'
        },
        {
          /** 命令正则匹配 */
          reg: '^撕了(.*)$',
          /** 执行方法 */
          fnc: 'tear'
        },
        {
          /** 命令正则匹配 */
          reg: '^膜拜(.*)$',
          /** 执行方法 */
          fnc: 'worship'
        },
      ]
    })
  }
  
  async help (e) {
      let msg
      msg = ["使用以下字符加上@群友",
      "\n",
      "例如：咬@癫癫博士", 
      "\n",
      "【咬，摸，捣，舔，撕了，膜拜，高质量】",
      "\n",
      "发送【随机壁纸】获取随机原神壁纸"]
      await e.reply(msg)
      //返回true 阻挡消息不再往下
      return true;
  }
  
  async wallpaper (e) {
      let url = 'https://ovooa.com/API/yuan/api?type=json'
      let res = await fetch(url).catch((err) => logger.error(err))
      res = await res.json()
      await this.reply(segment.image(`${res.text}`))
      //返回true 阻挡消息不再往下
      return true;
  }
  
  async lick (e) {
      if (e.message[1].type == 'at') {
          e.reply(segment.image(`http://ovooa.com/API/tian/?url=https://q1.qlogo.cn/g?b=qq&s=0&nk=${e.at}`))
      }
      //返回true 阻挡消息不再往下
      return true;
  }
  
  async eat (e) {
    /** e.msg 用户的命令消息 */
    if (e.message[1].type == 'at') {
        e.reply(segment.image(`http://ovooa.com/API/face_suck/?QQ=${e.at}`))
    }
      //返回true 阻挡消息不再往下
      return true;
  }
  
  async high_quality (e) {
    /** e.msg 用户的命令消息 */
    if (e.message[1].type == 'at') {
        e.reply(segment.image(`http://ovooa.com/API/face_gao/?QQ=${e.at}`))
    }
      //返回true 阻挡消息不再往下
      return true;
  }
  
  async touch (e) {
    /** e.msg 用户的命令消息 */
    if (e.message[1].type == 'at') {
        e.reply(segment.image(`http://ovooa.com/API/face_petpet/?QQ=${e.at}`))
    }
      //返回true 阻挡消息不再往下
      return true;
  }
  
  async squeeze (e) {
    /** e.msg 用户的命令消息 */
    if (e.message[1].type == 'at') {
        e.reply(segment.image(`http://ovooa.com/API/face_pound/?QQ=${e.at}`))
    }
      //返回true 阻挡消息不再往下
      return true;
  }
 
  async tear (e) {
    /** e.msg 用户的命令消息 */
    if (e.message[1].type == 'at') {
        e.reply(segment.image(`http://ovooa.com/API/si/?QQ=${e.at}`))
    }
      //返回true 阻挡消息不再往下
      return true;
  }
 
  async worship (e) {
    /** e.msg 用户的命令消息 */
    if (e.message[1].type == 'at') {
        e.reply(segment.image(`http://ovooa.com/API/face_worship/?QQ=${e.at}`))
    }
      //返回true 阻挡消息不再往下
      return true;
  }
 
 
 
 
 
 
  
  
}
