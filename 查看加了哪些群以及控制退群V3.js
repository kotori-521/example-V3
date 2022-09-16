//by 癫癫博士
//控制机器人退群

import plugin from '../../lib/plugins/plugin.js'
import fetch from 'node-fetch'
import { segment } from 'oicq'
const _path=process.cwd()

export class quitgroup extends plugin {
  constructor () {
    super({
      name: '控制机器人退群',

      dsc: '简单开发示例',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',

      priority: 100,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^#(退群)[0-9]*$',
          /** 执行方法 */
          fnc: 'quitgroup'
        },
        {
          /** 命令正则匹配 */
          reg: '^#群列表$',
          /** 执行方法 */
          fnc: 'grouplist'
        },
      ]
    })
  }

  async quitgroup (e) {
  if (!e.isMaster) {
    e.reply("只有主人才能操作！", true)
    return true
  }

  if (e.isGroup) {
    e.group.quit(e.group_id)
    e.reply(`(○｀ 3′○)已退出群${groupid}\n其实人家早就不想干了`)
  } 
  else {
    let groupid = e.msg.replace(/#|＃|退群/g, "").trim()
    if (groupid) {
      Bot.pickGroup(groupid).quit(groupid)
    }
    e.reply(`(○｀ 3′○)已退出群${groupid}\n其实人家早就不想干了`)
  }
  return true
  }
  
  async grouplist (e) {
  if (!e.isMaster) {
    e.reply("只有主人才能查看！", true)
    return true;
  }
  let groupids = "主人，我加入了这些群:"
  Bot.gl.forEach(function (value, key) {
    groupids += `\n${key}:${value.group_name}`
  })
  e.reply(groupids)
  return true
  }
}
