import plugin from '../../lib/plugins/plugin.js'

/* 
插件制作:花海里的秋刀鱼(717157592)
首发群:258623209
使用方法:私聊机器人,引用回复入群信息 同意 
*/
export class approves extends plugin {
  constructor () {
    super({
      name: 'approves',
      dsc: '同意机器人进群',
      event: 'message.private',
      priority: 32,
      rule: [{
        /** 命令正则匹配 */
        reg: '#*同意$',
        /** 执行方法 */
        fnc: 'approve'
      }]
    })
  }

  async approve (e) {
    if(!e.isMaster) return
    let source = (await e.friend.getChatHistory(e.source.time, 1)).pop()
    let user = source.raw_message.match(/邀请人:[1-9]\d*/g).toString().replace(/邀请人:/g,"")   
    let groupNumber = source.raw_message.match(/群号:[1-9]\d*/g).toString().replace(/群号:/g,"")
    let seq = source.raw_message.match(/邀请码:[1-9]\d*/g).toString().replace(/邀请码:/g,"")

      await Bot.pickUser(user).setGroupInvite(groupNumber,seq,true)

     e.reply(`已成功进群(${groupNumber})`)
   
    return true
  }
}