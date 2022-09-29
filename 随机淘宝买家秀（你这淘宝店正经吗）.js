import plugin from '../../lib/plugins/plugin.js'
import fetch from 'node-fetch'
import { segment } from "oicq";


export class tbmjx extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: '随机淘宝买家秀',
      /** 功能描述 */
      dsc: '简单开发示例',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 5000,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^#买家秀$',
          /** 执行方法 */
          fnc: 'mjx'
        }
      ]
    })
  }


  async mjx (e) {
    /** e.msg 用户的命令消息 */
    logger.info('[用户命令]', e.msg)

    let url = 'https://api.sdgou.cc/api/tao/'
    /** 调用接口获取数据 */

    /** 最后回复消息 */
    await e.reply(segment.image(url))
  }
}
