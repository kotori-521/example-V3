//by 癫癫博士
//仓库地址：https://gitee.com/huangshx2001/yunzai-js-plug-in
//欢迎访问仓库评论和留个star！
//遇到了问题和bug也可以来仓库反馈


//重启机器人会导致cd清空，暂未解决
import plugin from '../../lib/plugins/plugin.js'
import fetch from 'node-fetch'
import{segment}from'oicq'
import schedule from 'node-schedule'


let CD = {};
export class example extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: '原神黄历',
      /** 功能描述 */
      dsc: '简单开发示例',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 5000,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^#原神黄历',
          /** 执行方法 */
          fnc: 'yshl'
        }
      ]
    })
  }

  async yshl (e) {
    /** e.msg 用户的命令消息 */
    logger.info('[用户命令]', e.msg)
    
    if (CD[e.user_id]) {
        e.reply('每个人一天只能查一次哦!')
        return false
    }
    
    let url = 'https://api.xingzhige.com/API/yshl/'
    CD[e.user_id] = true;
    let res = await fetch(url).catch((err) => logger.error(err))
    /** 最后回复消息 */
    await this.reply([
      segment.at(this.e.user_id),
      // segment.image(),
      segment.image(url)
    ])
  }
}

let rule =`50 49 0 * * ?`
let job = schedule.scheduleJob(rule, () => {
    console.log('原神黄历cd清空');
    CD = {};
    }
)
