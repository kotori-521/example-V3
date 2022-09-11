import plugin from '../../lib/plugins/plugin.js'
import fetch from 'node-fetch'
//by 癫癫博士
//通过api接口实现的漂流瓶功能。
//信息来源于网络，使用的时候请认真辨别真伪


export class example extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: '漂流瓶',
      /** 功能描述 */
      dsc: '丢漂流瓶和捡漂流瓶',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 5000,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^#漂流瓶帮助$',
          /** 执行方法 */
          fnc: 'help'
        },
        {
          /** 命令正则匹配 */
          reg: '^#*丢漂流瓶 (.*)$',
          /** 执行方法 */
          fnc: 'throw_'
        },
        {
          /** 命令正则匹配 */
          reg: '^#捡漂流瓶$',
          /** 执行方法 */
          fnc: 'pick'
        }
      ]
    })
  }

  /**
   * #一言
   * @param e oicq传递的事件参数e
   */
  async help(e) {
    /** e.msg 用户的命令消息 */
    logger.info('[用户命令]', e.msg)
    let msg = `【漂流瓶帮助】\n发送 "#丢漂流瓶 标题 内容" 来丢出漂流瓶\n发送 "#捡漂流瓶" 来捡起一个漂流瓶\n注意：漂流瓶内容来自网络，请认真辨别真假`
    /** 最后回复消息 */
    await this.reply(`${msg}`)
    return true
  }
  async throw_ (e) {
    /** e.msg 用户的命令消息 */
    logger.info('[用户命令]', e.msg)
    let string = e.msg
    var stringlist = string.split(" ")
    let title = stringlist[1]
    let message = stringlist[2]
    let url = `https://ovooa.com/API/Piao/api.php?Select=1&title=${title}&msg=${message}&QQ=${e.user_id}`
    /** 调用接口获取数据 */
    let res = await fetch(url).catch((err) => logger.error(err))

    /** 接口结果，json字符串转对象 */
    res = await res.json()

    /** 最后回复消息 */
    await this.reply(`${res.text}`)
    return true
  }
  
  async pick (e) {
    /** e.msg 用户的命令消息 */
    logger.info('[用户命令]', e.msg)
    let url = `https://ovooa.com/API/Piao/api.php?Select=0`
    /** 调用接口获取数据 */
    let res = await fetch(url).catch((err) => logger.error(err))

    /** 接口结果，json字符串转对象 */
    res = await res.json()
    let msg = `编号:${res.data[0].id}\n标题:${res.data[0].title}\n内容:${res.data[0].text}\n时间:${res.data[0].time}`
    /** 最后回复消息 */
    await this.reply(`${msg}`)
    return true
  }
}
