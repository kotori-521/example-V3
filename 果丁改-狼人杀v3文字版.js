import { segment } from 'oicq'
import fetch from 'node-fetch'

//项目路径
const _path = process.cwd()

/*
====================================================================================================
V3版本由果丁修改qq：985318935   qq群：625882201宣传下小群不过分吧（狗头）
不知道怎么渲染成图片，所以改的是最初的文字版本
====================================================================================================
下面是v2大佬的原话  
版本：v1.2.1
  有一些地方使用了qq:717157592的轮盘转代码，表示感谢（虽然他不认识我）
  qq:1621817592，我找不到能测试的人所以可能有低级/恶性BUG，如果有BUG可以联络我
  简单的狼人鲨小游戏，目前支持的神职为：守卫，预言家，女巫，猎人，奇货商人（可能有bug）
  暂时不支持自定义游戏设置。
====================================================================================================
  已知BUG：
  1.偶尔玩家的名字可能变成undefined，原因不明
====================================================================================================
====================================================================================================
*/
//游戏内使用变量
let wj = []
let group = []
let dplayer = ''
let wj2 = [] //0:no,1:user_id,2:membercard,3:type,4:is_alive,5:vote_person,6:is_guadrian,7:is_vote,8:vote_num
let dead = [-1, -1, -1] //0:poison,1:wolfkill,2:another_poison_or_qh_boom
let phase = ''
let wkill = -1
let sliverp = -1
let goldp = -1
let goldp2 = -1 //奇货商人毒药
let gd = [-1, -1]
let qh = [-1, -1]
let turn = 0 //回合数
let shot = -1 //猎人是否可开枪鲨人

//使用变量初始化
function init(e) {
  qh = [-1, -1]
  wj = []
  gd = [-1, -1]
  dplayer = ''
  wj2 = []
  dead = [-1, -1, -1]
  phase = ''
  wkill = -1
  sliverp = -1
  goldp = -1
  goldp2 = -1
  let guessConfig = getGuessConfig(e)
  guessConfig.gameing = false
  guessConfig.current = false
  group = []
  turn = 0
  shot = -1
}

//游戏设定变量
let witchSPN = 6 //女巫拥有秘药的游戏人数（不含）
let zbshenfen = 1 //0 = 验身份，1 = 验阵营
let tubian = 8 //屠边局启用人数（不含），大于这个人数使用屠边规则
let votemin = 0 //白天投人出去的最少票数（不含）
let saveWitch = 0 //女巫是否可以救自己，0 = 可以，1 = 不行
let time = 40 //默认每阶段时间，狼讨论时间为此时间1倍（1狼），2倍（2/3狼）或4倍（4狼），其他为1倍
let personmin = 4 //开始游戏的最小人数
let shenfen = [
  '狼',
  '猎人',
  '预言家',
  '平民',
  '狼',
  '平民',
  '女巫',
  '狼',
  '平民',
  '守卫',
  '狼',
  '平民',
  '奇货商人'
] //身份序列，几人局就使用几人的身份序列，可以使用【设置身份序列】自定义身份序列，注意这个设置是串群的


export class lrs extends plugin {
  constructor () {
    super({
      name: '狼人鲨',
      dsc: '狼人鲨',
      event: 'message',
      priority: 5000,
      rule: [
        {
          reg: '^#*发起狼人鲨$',
          fnc: 'lrs'
        },
        {
          reg: '^#*加入狼人鲨$',
          fnc: 'joingame'
        },
        {
          reg: '^#*开始狼人鲨$',
          fnc: 'start'
        },
        {
          reg: '^#*结束狼人鲨$',
          fnc: 'EndCheck'
        },  
        {
          reg: '^#*结束讨论$',
          fnc: 'voteStart'
        },   
        {
          reg: '^#*投.*号$',
          fnc: 'vote'
        },  
        {
          reg: '^#*守卫.*号$',
          fnc: 'guadrian'
        },  
        {
          reg: '^#*占卜.*号$',
          fnc: 'divine'
        },  
        {
          reg: '^#*毒.*号$',
          fnc: 'poison'
        }, 
        {
          reg: '^#*鲨掉.*号$',
          fnc: 'wolfkill'
        }, 
        {
          reg: '^#*救他$',
          fnc: 'save'
        },
        {
          reg: '^#*反鲨.*号$',
          fnc: 'sshotkill'
        },  
        {
          reg: '^#*给.*号占卜$',
          fnc: 'givezb'
        },  
        {
          reg: '^#*给.*号毒药$',
          fnc: 'givedy'
        },  
        {
          reg: '^#*讨论.*$',
          fnc: 'discuss'
        },  
        {
          reg: '^#*讨论.*$',
          fnc: 'shotkill'
        },  
        {
          reg: '^#*自爆$',
          fnc: 'boom'
        },   
        {
          reg: '^#*设置身份序列.*$',
          fnc: 'setting'
        } 
      ]
    })
  }


async lrs(e) {
  if (group.length == 1 && group[0] != e.group_id) {
    e.reply(`别群正在玩，无法发起，正在玩的群号是:【${group}】`)
    return true
  }
  group[0] = e.group_id
  let guessConfig = getGuessConfig(e)

  if (guessConfig.gameing) {
    if (guessConfig.current) {
      e.reply(`狼人鲨已开始！`)
      return true
    }
    e.reply('狼人鲨正在发起噢！请玩家们快点加入游戏吧！')
    return true
  }

  e.reply(
    `狼人鲨已发起，请玩家们输入【加入狼人鲨】加入游戏，` +
      personmin +
      `人以上房主才能【开始狼人鲨】，若发起后5分钟未【开始狼人鲨】狼人鲨将结束\n请注意：必须加机器人好友才能玩哦`,
    true
  )
  wj[0] = e.user_id
  let name2 = e.member?.card ? e.member.card : e.member?.nickname
  wj2[0] = [0, e.user_id, name2, '', 0, 0, 0, 0, 0]

  guessConfig.gameing = true
  guessConfig.timer = setTimeout(() => {
    let guessConfig = getGuessConfig(e)
    if (guessConfig.gameing && !guessConfig.current) {
      guessConfig.gameing = false
      guessConfig.current = false
      init(e)
      e.reply(`发起后5分钟未开始游戏，狼人鲨自动结束`)
      return true
    }
  }, 300000) //毫秒数
  return true
}

async joingame(e) {
  if (group.length == 1 && group[0] != e.group_id) {
    e.reply(`别群正在玩，无法加入，正在玩的群号是:【${group}】`)
    return true
  }
  let guessConfig = getGuessConfig(e)
  if (guessConfig.gameing) {
    if (guessConfig.current) {
      e.reply(`狼人鲨已开始！`)
      return true
    }
    if (wj.indexOf(e.user_id) == -1) {
      wj[wj.length] = e.user_id
      let name2 = e.member?.card ? e.member.card : e.member?.nickname

      wj2[wj2.length] = [wj2.length, e.user_id, name2, '', 0, 0, 0, 0, 0]
      e.reply(`已成功加入游戏，目前玩家人数为${wj.length}`, true)
      return true
    } else {
      e.reply(`你已经加入游戏了，请不要重复加入`, true)
      return true
    }
  }
  e.reply(`狼人鲨未发起`)
  return true
}

async start(e) {
  if (group.length == 1 && group[0] != e.group_id) {
    e.reply(`别群正在玩，无法开始，正在玩的群号是:【${group}】`)
    return true
  }
  let guessConfig = getGuessConfig(e)
  if (guessConfig.gameing) {
    if (guessConfig.current) {
      e.reply(`狼人鲨已开始！`)
      return true
    }

    if (wj[0] == e.user_id) {
      if (wj.length < personmin) {
        e.reply(`人数不够，无法开始狼人鲨！`)
        return true
      }
      let rand = ''
      let sfmsg = '本局为' + wj2.length + '人局，使用的身份序列为：'
      for (var i = 0; i < wj2.length; i++) {
        sfmsg = sfmsg + shenfen[i] + '，'
      }
      let wstr = ''
      if (saveWitch == 0) {
        wstr = '可以'
      } else if (saveWitch == 1) {
        wstr = '不可以'
      }
      e.reply(
        `狼人鲨已封闭，无法再加入新玩家，目前玩家人数有${wj2.length}人\n随机玩家顺序，随机身份完成！\n` +
          sfmsg +
          `\n女巫是否可以自救（若女巫可以使用秘药）：` +
          wstr +
          `\n最小出局票数为：` +
          (votemin + 1) +
          `票\n游戏开始！天黑请闭眼...\n游玩时注意：如果玩家私聊/群聊输入的指令BOT没有任何成功或失败的回复，请重新输入一次。`
      )
      showConsole()
      wj2 = shuffle2(wj2)
      for (var i = 0; i < wj2.length; i++) {
        wj2[i][3] = shenfen[i]
        wj2[i][4] = 1
        wj2[i][5] = ''
        wj2[i][6] = 0
        wj2[i][7] = 0
        wj2[i][8] = 0
      }
      wj2 = shuffle2(wj2)
      showConsole()
      guessConfig.current = true

      //guessConfig.timer = setTimeout(() => {
      //  if (guessConfig.gameing && guessConfig.current) {
      //   guessConfig.gameing = false
      //    guessConfig.current = false
      //    init(e)
      //    e.reply(`狼人鲨已结束`)
      //   return true
      //  }
      //}, lag) //毫秒数

      for (var i = 0; i < wj2.length; i++) {
        let winwolf = ''
        let winperson = ''
        if (wj2.length > tubian) {
          winwolf =
            '胜利条件：白天投票阶段/夜晚阶段结束时神牌角色无人存活或民牌角色无人存活\n失败条件：白天投票阶段/夜晚阶段结束时狼牌角色无人存活'
          winperson =
            '胜利条件：白天投票阶段/夜晚阶段结束时狼牌角色无人存活\n失败条件：白天投票阶段/夜晚阶段结束时神牌角色无人存活或民牌角色无人存活'
        } else {
          winwolf =
            '胜利条件：白天投票阶段/夜晚阶段结束时民牌和神牌角色总共存活人数不超过1人\n失败条件：白天投票阶段/夜晚阶段结束时狼牌角色无人存活'
          winperson =
            '胜利条件：白天投票阶段/夜晚阶段结束时狼牌角色无人存活\n失败条件：白天投票阶段/夜晚阶段结束时民牌和神牌角色总共存活人数不超过1人并且有狼存活'
        }
        let replyMsg = '你的身份是：' + wj2[i][3]
        if (wj2[i][3] == '狼') {
          replyMsg = replyMsg + '\n本局的所有狼分别为：\n'
          for (var qq = 0; qq < wj2.length; qq++) {
            if (wj2[qq][3] == '狼') {
              replyMsg = replyMsg + qq + '号(' + wj2[qq][2] + ')\n'
            }
          }
          replyMsg =
            replyMsg +
            '阵营：狼，类型：狼牌\n能力：\n1.每个晚上所有狼阵营的玩家可以决定鲨掉一名角色！\n2.白天开始后到讨论开始前的任意时刻可以输入【自爆】自爆自己身份，直接进入夜晚阶段\n' +
            winwolf
        }
        if (wj2[i][3] == '平民') {
          replyMsg =
            replyMsg +
            '\n阵营：好人，类型：民牌\n能力：无特殊能力\n' +
            winperson
        }
        if (wj2[i][3] == '预言家') {
          replyMsg =
            replyMsg +
            '\n阵营：好人，类型：神牌\n能力：每天晚上狼鲨掉人之前可以占卜得知任意一名玩家的身份（也可以不占卜）\n' +
            winperson
        }
        if (wj2[i][3] == '守卫') {
          replyMsg =
            replyMsg +
            '\n阵营：好人，类型：神牌\n能力：每天晚上狼鲨掉人之前可以守卫一名玩家（也可以不守卫），守卫的玩家将不会被狼鲨掉（但有可能会被女巫毒）\n注意：不可连续守卫同一对象！\n' +
            winperson
        }
        if (wj2[i][3] == '女巫') {
          let wstr = ''
          if (saveWitch == 0) {
            wstr = '可以救自己'
          } else if (saveWitch == 1) {
            wstr = '不可以救自己'
          }
          replyMsg =
            replyMsg +
            '\n阵营：好人，类型：神牌\n能力：拥有一瓶毒药和一瓶秘药，每晚可以选择使用一瓶或者不使用\n毒药：可以在每天晚上狼鲨掉人之前毒任意一名角色（这名角色在今天晚上仍可能被狼选中）\n秘药：每天晚上狼决定鲨掉玩家后可以使用秘药救活他，' +
            wstr +
            '\n注意：\n1.同一天晚上不可以连续使用毒药和秘药！\n2.若总玩家人数为' +
            witchSPN +
            '人以下（含），女巫只有毒药没有秘药\n' +
            winperson
        }
        if (wj2[i][3] == '奇货商人') {
          replyMsg =
            replyMsg +
            '\n阵营：好人，类型：神牌\n能力：每天晚上狼鲨掉人之前可以选择一名玩家，让其获得占卜/毒药能力二选一，选择的人是民牌则从下一晚上开始获得能力，选择的人是神牌则无事发生（但不会消耗能力使用次数），选择的人是狼牌则奇货商人今晚出局。一局游戏只能发动一次此能力。\n毒药：可以在每天晚上狼鲨掉人之前毒任意一名角色（使用后恢复平民角色）\n占卜：每天晚上狼鲨掉人之前可以占卜得知任意一名玩家的身份（也可以不占卜）\n' +
            winperson
        }
        if (wj2[i][3] == '蛊惑师') {
          //未做，可用守卫模板
          replyMsg =
            replyMsg +
            '\n阵营：好人，类型：神牌\n能力：每天晚上狼鲨掉人之前可以指定一名玩家（也可以不指定），如果蛊惑师今晚被鲨（女巫毒药或狼人鲨人），蛊惑师指定的玩家代替蛊惑师出局\n注意：不可连续蛊惑同一对象！\n' +
            winperson
        }
        if (wj2[i][3] == '猎人') {
          replyMsg =
            replyMsg +
            '\n阵营：好人，类型：神牌\n能力：白天猎人被投票投出局或晚上结束时被狼鲨掉，并且未满足游戏结束条件时可以立即反鲨一名其他玩家。\n' +
            winperson
        }
        let userId = wj2[i][1]
        if (replyMsg != '') {
          Bot.pickUser(userId).sendMsg(replyMsg)
        }
      }
      cyc(e)
    } else {
      e.reply(`发起者才能开始狼人鲨噢，快叫他开始吧！`)
      return true
    }
    return true
  }
  e.reply(`狼人鲨未发起`)
  return true //返回true 阻挡消息不再往下
}

async EndCheck(e) {
  let guessConfig = getGuessConfig(e)
  let { gameing, current } = guessConfig
  if (group.length == 1 && group[0] != e.group_id) {
    e.reply(`别群正在玩，无法结束，正在玩的群号是:【${group}】`)
    return true
  }
  if (guessConfig.gameing) {
    //   if(guessConfig.current ==false){
    e.reply(
      `狼人鲨已结束\n注意：使用【结束狼人鲨】强制结束游戏后请至少等待1分钟后再开始下一局游戏，否则可能会出现错误。`
    )
    guessConfig.gameing = false
    guessConfig.current = false
    clearTimeout(guessConfig.timer)
    init(e)
    return true
    // }else{
    //     e.reply(`轮盘赌已经开始了,不能主动结束，五分钟后自动结束，请赌徒们轮流开枪`);
    //     return true;
    // }
  }
  e.reply(`狼人鲨未发起`)
  return true
}

async voteStart(e) {
  if (group.length == 1 && group[0] != e.group_id) {
    e.reply(`别群正在玩，无法结束投票，正在玩的群号是:【${group}】`)
    return true
  }
  let guessConfig = getGuessConfig(e)
  wkill = -1
  dead = [-1, -1, -1]
  gd[1] = gd[1] - 1
  for (var i = 0; i < wj2.length; i++) {
    wj2[i][5] = ''
    wj2[i][6] = 0
    wj2[i][7] = 0
    wj2[i][8] = 0
  }
  //let index = wj.indexOf(e.user_id)
  //let indexs = Math.floor(Math.random() * (wj.length - 1) + 1)
  //let indexs = Math.ceil(Math.random() * wj.length - 1)
  if (guessConfig.gameing) {
    if (guessConfig.current) {
      if (wj[0] == e.user_id) {
        phase = 'day2'
        let lag3 = 0
        let msg =
          '自由讨论阶段结束！\n进入投票时间！各位玩家可以私聊机器人发送【投*号】开始投票！时限一分钟\n玩家列表：\n' +
          show(wj2)
        e.reply(msg)
        setTimeout(() => {
          let guessConfig = getGuessConfig(e)
          if (guessConfig.current == false) {
            return true
          }
          let v = -1
          let vn = -1
          let same = 1
          for (var i = 0; i < wj2.length; i++) {
            if (vn < wj2[i][8]) {
              v = i
              vn = wj2[i][8]
              same = 0
            } else if (vn == wj2[i][8]) {
              same = 1
            }
          }
          let msg = '投票阶段结束！得票如下：\n' + show2(wj2)
          if (same == 0 && wj2[v][8] > votemin) {
            msg = msg + v + '号（' + wj2[v][2] + '）得票最多！他即将出局....'
            wj2[v][4] = 0
            if (isGameEnd() == 1) {
              msg =
                msg +
                '\n游戏结束！狼阵营胜利！！本局的所有玩家身份是：\n' +
                show3(wj2)
              init(e)
              e.reply(msg)
              return true
            } else if (isGameEnd() == 2) {
              msg =
                msg +
                '\n游戏结束！好人阵营胜利！！本局的所有玩家身份是：\n' +
                show3(wj2)
              init(e)
              e.reply(msg)
              return true
            } else {
              if (wj2[v][3] == '猎人') {
                msg =
                  msg +
                  '\n' +
                  v +
                  '号被投票出局了，他是猎人，可以在群聊发送【反鲨*号】鲨掉一名玩家！时限' +
                  time +
                  '秒\n玩家列表：\n' +
                  show(wj2)
                shot = 0
                lag3 = time * 1000
              } else {
                lag3 = 2000
              }
              e.reply(msg)
              setTimeout(() => {
                let guessConfig = getGuessConfig(e)
                if (guessConfig.current == false) {
                  return true
                }
                shot = -2
                let msg = '请出局的人发表遗言，时限' + time + '秒'
                e.reply(msg)
                setTimeout(() => {
                  let guessConfig = getGuessConfig(e)
                  if (guessConfig.current == false) {
                    return true
                  }
                  let msg = '遗言阶段结束！天黑请闭眼...'
                  e.reply(msg)
                  cyc(e)
                }, time * 1000)
              }, lag3)
            }
          } else if (same == 1) {
            msg = msg + '\n投票结果为平票！没有任何人出局....\n即将进入夜晚....'
            e.reply(msg)
            cyc(e)
          } else if (wj2[i][8] <= votemin) {
            msg =
              msg +
              '\n得票最多的人得票数没有超过最小出局票数！没有任何人出局....\n即将进入夜晚....'
            e.reply(msg)
            cyc(e)
          }
        }, 60000)
      } else {
        e.reply(`只有发起者才能结束讨论！`, true)
        return true
      }
    } else {
      e.reply(`房主还未开始狼人鲨！`, true)
      return true
    }
  } else {
    e.reply(`狼人鲨未发起！`)
    return true
  }
}

async vote(e) {
  let guessConfig = getGuessConfig(e)
  if (guessConfig.gameing) {
    if (guessConfig.current && phase == 'day2') {
      let i = search(e.user_id)
      if (i != -1) {
        if (wj2[i][4] == 1) {
          if (wj2[i][7] == 0) {
            let msg = e.msg.replace(/投|号/g, '').trim()
            msg = Number(msg)
            if (typeof msg != 'number' || msg >= wj2.length || e.isGroup) {
              e.reply(
                `输入数据不合法或你是在群聊输入，请私聊输入正确的指令`,
                true
              )
              return true
            }
            if (wj2[msg][4] == 1) {
              wj2[i][7] = 1
              wj2[msg][8] = wj2[msg][8] + 1
              wj2[msg][5] = wj2[msg][5] + i + '号,'
              e.reply(
                `操作成功！你选择的是` +
                  msg +
                  '号，目前他的得票数是：' +
                  wj2[msg][8],
                true
              )
            } else {
              e.reply(`选择的人已经出局了！`, true)
              return true
            }
          } else {
            e.reply(`你已经操作过了！无法操作`, true)
            return true
          }
        } else {
          e.reply(`你已经出局了！无法操作`, true)
          return true
        }
      } else {
        e.reply(`你不是狼人鲨参与者，无法操作`, true)
        return true
      }
    } else {
      e.reply(
        `房主还未开始狼人鲨或你不是加入的玩家或还没到对应阶段，无法操作`,
        true
      )
      return true
    }
  } else {
    e.reply(`狼人鲨未发起`)
    return true
  }
}

async guadrian(e) {
  let guessConfig = getGuessConfig(e)
  if (guessConfig.gameing) {
    if (guessConfig.current && phase == 'night1') {
      let i = search(e.user_id)
      if (i != -1) {
        if (wj2[i][4] == 1 && wj2[i][3] == '守卫') {
          if (wj2[i][7] == 0) {
            let msg = e.msg.replace(/守卫|号/g, '').trim()
            msg = Number(msg)
            if (typeof msg != 'number' || msg >= wj2.length) {
              e.reply(`输入数据不合法！请输入正确的阿拉伯数字编号`, true)
              return true
            }
            if (wj2[msg][4] == 1) {
              if (msg != gd[0] || gd[1] < 0) {
                wj2[i][7] = 1
                wj2[msg][6] = wj2[msg][6] + 1
                gd[0] = msg
                gd[1] = 1
                e.reply(`操作成功！你选择的是` + msg + '号', true)
              } else {
                e.reply(`不能连续守卫同一个人！`, true)
                return true
              }
            } else {
              e.reply(`选择的人已经出局了！`, true)
              return true
            }
          } else {
            e.reply(`你已经操作过了！无法操作`, true)
            return true
          }
        } else {
          e.reply(`你已经出局了或你不是对应身份，无法操作`, true)
          return true
        }
      } else {
        e.reply(`你不是狼人鲨参与者，无法操作`, true)
        return true
      }
    } else {
      e.reply(
        `房主还未开始狼人鲨或你不是加入的玩家或还没到对应阶段，无法操作`,
        true
      )
      return true
    }
  } else {
    e.reply(`狼人鲨未发起`)
    return true
  }
}

async givezb(e) {
  let guessConfig = getGuessConfig(e)
  if (guessConfig.gameing) {
    if (guessConfig.current && phase == 'night1') {
      let i = search(e.user_id)
      if (i != -1) {
        if (wj2[i][4] == 1 && wj2[i][3] == '奇货商人') {
          if (wj2[i][7] == 0 && gd[1] < 0) {
            let msg = e.msg.replace(/给|号占卜/g, '').trim()
            msg = Number(msg)
            if (typeof msg != 'number' || msg >= wj2.length) {
              e.reply(`输入数据不合法！请输入正确的阿拉伯数字编号`, true)
              return true
            }
            if (wj2[msg][4] == 1) {
              if (wj2[msg][3] == '平民') {
                wj2[i][7] = 1
                wj2[msg][3] = '平民（占卜能力）'
                qh[0] = msg
                qh[1] = 1
                e.reply(`操作成功！你选择的是` + msg + '号', true)
                let replyMsg = ''
                replyMsg =
                  '奇货商人给予了你占卜能力，你可以每晚在机器人提示你可以占卜时进行占卜\n占卜：每天晚上狼鲨掉人之前可以占卜得知任意一名玩家的身份（也可以不占卜）'
                let userId = wj2[msg][1]
                if (replyMsg != '') {
                  Bot.pickUser(userId).sendMsg(replyMsg)
                }
              } else if (wj2[msg][3] == '狼') {
                wj2[i][7] = 1
                dead[2] = i
                qh[0] = msg
                qh[1] = 1
                e.reply(`操作成功！你选择的是` + msg + '号', true)
              } else {
                e.reply(`选择的是好人阵营其他职业，无事发生`, true)
                return true
              }
            } else {
              e.reply(`选择的人已经出局了！`, true)
              return true
            }
          } else {
            e.reply(`你已经操作过了！无法操作`, true)
            return true
          }
        } else {
          e.reply(`你已经出局了或你不是对应身份，无法操作`, true)
          return true
        }
      } else {
        e.reply(`你不是狼人鲨参与者，无法操作`, true)
        return true
      }
    } else {
      e.reply(
        `房主还未开始狼人鲨或你不是加入的玩家或还没到对应阶段，无法操作`,
        true
      )
      return true
    }
  } else {
    e.reply(`狼人鲨未发起`)
    return true
  }
}
async givedy(e) {
  let guessConfig = getGuessConfig(e)
  if (guessConfig.gameing) {
    if (guessConfig.current && phase == 'night1') {
      let i = search(e.user_id)
      if (i != -1) {
        if (wj2[i][4] == 1 && wj2[i][3] == '奇货商人') {
          if (wj2[i][7] == 0 && gd[1] < 0) {
            let msg = e.msg.replace(/给|号毒药/g, '').trim()
            msg = Number(msg)
            if (typeof msg != 'number' || msg >= wj2.length) {
              e.reply(`输入数据不合法！请输入正确的阿拉伯数字编号`, true)
              return true
            }
            if (wj2[msg][4] == 1) {
              if (wj2[msg][3] == '平民') {
                wj2[i][7] = 1
                wj2[msg][3] = '平民（毒药能力）'
                qh[0] = msg
                qh[1] = 1
                e.reply(`操作成功！你选择的是` + msg + '号', true)
                let replyMsg = ''
                replyMsg =
                  '奇货商人给予了你毒药能力，你可以每晚在机器人提示你可以使用毒药时使用\n毒药：可以在每天晚上狼鲨掉人之前毒任意一名角色（这名角色在今天晚上仍可能被狼选中），使用后能力消失'
                let userId = wj2[msg][1]
                if (replyMsg != '') {
                  Bot.pickUser(userId).sendMsg(replyMsg)
                }
              } else if (wj2[msg][3] == '狼') {
                wj2[i][7] = 1
                dead[2] = i
                qh[0] = msg
                qh[1] = 1
                e.reply(`操作成功！你选择的是` + msg + '号', true)
              } else {
                e.reply(`选择的是好人阵营其他职业，无事发生`, true)
                return true
              }
            } else {
              e.reply(`选择的人已经出局了！`, true)
              return true
            }
          } else {
            e.reply(`你已经操作过了！无法操作`, true)
            return true
          }
        } else {
          e.reply(`你已经出局了或你不是对应身份，无法操作`, true)
          return true
        }
      } else {
        e.reply(`你不是狼人鲨参与者，无法操作`, true)
        return true
      }
    } else {
      e.reply(
        `房主还未开始狼人鲨或你不是加入的玩家或还没到对应阶段，无法操作`,
        true
      )
      return true
    }
  } else {
    e.reply(`狼人鲨未发起`)
    return true
  }
}
async divine(e) {
  let guessConfig = getGuessConfig(e)
  if (guessConfig.gameing) {
    if (guessConfig.current && phase == 'night1') {
      let i = search(e.user_id)
      if (i != -1) {
        if (
          wj2[i][4] == 1 &&
          (wj2[i][3] == '预言家' || wj2[i][3] == '平民（占卜能力）')
        ) {
          if (wj2[i][7] == 0) {
            let msg = e.msg.replace(/占卜|号/g, '').trim()
            msg = Number(msg)
            if (typeof msg != 'number' || msg >= wj2.length) {
              e.reply(`输入数据不合法！请输入正确的阿拉伯数字编号`, true)
              return true
            }
            if (wj2[msg][4] == 1) {
              if (zbshenfen == 0) {
                wj2[i][7] = 1
                e.reply(
                  `操作成功！你选择的是` +
                    msg +
                    '号，他的身份是：' +
                    wj2[msg][3],
                  true
                )
              } else if (zbshenfen == 1) {
                wj2[i][7] = 1
                if (wj2[msg][3] == '狼') {
                  e.reply(
                    `操作成功！你选择的是` +
                      msg +
                      '号，他的阵营是：' +
                      wj2[msg][3],
                    true
                  )
                } else {
                  e.reply(
                    `操作成功！你选择的是` + msg + '号，他的阵营是：好人',
                    true
                  )
                }
              }
            } else {
              e.reply(`选择的人已经出局了！`, true)
              return true
            }
          } else {
            e.reply(`你已经操作过了！无法操作`, true)
            return true
          }
        } else {
          e.reply(`你已经出局了或你不是对应身份，无法操作`, true)
          return true
        }
      } else {
        e.reply(`你不是狼人鲨参与者，无法操作`, true)
        return true
      }
    } else {
      e.reply(
        `房主还未开始狼人鲨或你不是加入的玩家或还没到对应阶段，无法操作`,
        true
      )
      return true
    }
  } else {
    e.reply(`狼人鲨未发起`)
    return true
  }
}

async poison(e) {
  let guessConfig = getGuessConfig(e)
  if (guessConfig.gameing) {
    if (guessConfig.current && phase == 'night1') {
      let i = search(e.user_id)
      if (i != -1) {
        if (
          wj2[i][4] == 1 &&
          (wj2[i][3] == '女巫' || wj2[i][3] == '平民（毒药能力）')
        ) {
          if (
            wj2[i][7] == 0 ||
            (wj2[i][3] == '女巫' && goldp != -1) ||
            (wj2[i][3] == '平民（毒药能力）' && goldp2 != -1)
          ) {
            let msg = e.msg.replace(/毒|号/g, '').trim()
            msg = Number(msg)
            if (typeof msg != 'number' || msg >= wj2.length) {
              e.reply(`输入数据不合法！请输入正确的阿拉伯数字编号`, true)
              return true
            }
            if (wj2[msg][4] == 1) {
              wj2[i][7] = 1

              if (wj2[i][3] == '平民（毒药能力）') {
                goldp2 = msg
                dead[2] = msg
                wj2[i][3] == '平民'
                e.reply(
                  `操作成功！你选择的是` + msg + '号，同时你失去了毒药',
                  true
                )
              } else if (wj2[i][3] == '女巫') {
                goldp = msg
                dead[0] = msg
                e.reply(
                  `操作成功！你选择的是` + msg + '号，同时你失去了毒药',
                  true
                )
              }
            } else {
              e.reply(`选择的人已经出局了！` + wj[msg][4], true)
              return true
            }
          } else {
            e.reply(`你已经操作过了！无法操作`, true)
            return true
          }
        } else {
          e.reply(`你已经出局了或你不是对应身份，无法操作`, true)
          return true
        }
      } else {
        e.reply(`你不是狼人鲨参与者，无法操作`, true)
        return true
      }
    } else {
      e.reply(
        `房主还未开始狼人鲨或你不是加入的玩家或还没到对应阶段，无法操作`,
        true
      )
      return true
    }
  } else {
    e.reply(`狼人鲨未发起`)
    return true
  }
}

async shotkill(e) {
  let guessConfig = getGuessConfig(e)
  if (guessConfig.gameing) {
    if (guessConfig.current && shot == 0) {
      let i = search(e.user_id)
      if (i != -1) {
        if (wj2[i][3] == '猎人') {
          let msg = e.msg.replace(/反鲨|号/g, '').trim()
          msg = Number(msg)
          if (typeof msg != 'number' || msg >= wj2.length || !e.isGroup) {
            e.reply(
              `输入数据不合法或不是在群聊输入，请在群聊输入正确的指令`,
              true
            )
            return true
          }
          if (wj2[msg][4] == 1) {
            wj2[msg][4] = 0
            shot = -2
            let replymsg = `猎人出局了，他反鲨了` + msg + '号，他也一起出局了。'
            if (isGameEnd() == 1) {
              replymsg =
                replymsg +
                '\n游戏结束！狼阵营胜利！本局的所有玩家身份是：\n' +
                show3(wj2)
              init(e)
              e.reply(replymsg)
              return true
            } else if (isGameEnd() == 2) {
              replymsg =
                replymsg +
                '\n游戏结束！好人阵营胜利！本局的所有玩家身份是：\n' +
                show3(wj2)
              init(e)
              e.reply(replymsg)
              return true
            }
            e.reply(replymsg, true)
          } else {
            e.reply(`选择的人已经出局了！`, true)
            return true
          }
        } else {
          e.reply(`你不是对应身份，无法操作`, true)
          return true
        }
      } else {
        e.reply(`你不是狼人鲨参与者，无法操作`, true)
        return true
      }
    } else {
      e.reply(
        `房主还未开始狼人鲨或你不是加入的玩家或还没到对应阶段，无法操作`,
        true
      )
      return true
    }
  } else {
    e.reply(`狼人鲨未发起`)
    return true
  }
}

async wolfkill(e) {
  let guessConfig = getGuessConfig(e)
  if (guessConfig.gameing) {
    if (guessConfig.current && phase == 'night2') {
      let i = search(e.user_id)
      if (i != -1) {
        if (wj2[i][4] == 1 && wj2[i][3] == '狼') {
          if (wkill == -1) {
            let msg = e.msg.replace(/鲨掉|号/g, '').trim()
            msg = Number(msg)
            if (typeof msg != 'number' || msg >= wj2.length) {
              e.reply(`输入数据不合法！请输入正确的阿拉伯数字编号`, true)
              return true
            }
            if (wj2[msg][4] == 1) {
              wkill = msg
              if (wj2[msg][6] == 0) {
                wj2[msg][4] = 0
                dead[1] = msg
              }
              for (var qq = 0; qq < wj2.length; qq++) {
                if (wj2[qq][3] == '狼' && qq != i) {
                  let replyMsg = i + '号(' + wj2[i][2] + ')说：' + e.msg
                  // 自动向Master转发消息（也可以在这里改成指定QQ）
                  let userId = wj2[qq][1]
                  if (replyMsg != '') {
                    Bot.pickUser(userId).sendMsg(replyMsg)
                  }
                }
              }
              e.reply(`操作成功！你选择的是` + msg + '号', true)
            } else {
              e.reply(`选择的人已经出局了！`, true)
              return true
            }
          } else {
            e.reply(`你或者其他的狼已经操作过了，无法操作`, true)
            return true
          }
        } else {
          e.reply(`你已经出局了或你不是对应身份，无法操作`, true)
          return true
        }
      } else {
        e.reply(`你不是狼人鲨参与者，无法操作`, true)
        return true
      }
    } else {
      e.reply(
        `房主还未开始狼人鲨或你不是加入的玩家或还没到对应阶段，无法操作`,
        true
      )
      return true
    }
  } else {
    e.reply(`狼人鲨未发起`)
    return true
  }
}

async save(e) {
  let guessConfig = getGuessConfig(e)
  if (guessConfig.gameing) {
    if (guessConfig.current && phase == 'night3') {
      let i = search(e.user_id)
      if (i != -1) {
        if (
          (wj2[i][4] == 1 || (i == wkill && saveWitch == 0)) &&
          wj2[i][3] == '女巫'
        ) {
          if (wj2[i][7] == 0 && goldp < 0) {
            if (sliverp == -1 && wj2.length > witchSPN) {
              //wj2[wkill][4] = 1
              sliverp = wkill
              e.reply(`操作成功！你选择的是` + wkill + '号', true)
            } else {
              e.reply(`已经没有秘药了！`, true)
              return true
            }
          } else {
            e.reply(`你已经操作过了！无法操作`, true)
            return true
          }
        } else {
          e.reply(
            `你已经出局了或你不是对应身份或还没到使用时机，无法操作`,
            true
          )
          return true
        }
      } else {
        e.reply(`你不是狼人鲨参与者，无法操作`, true)
        return true
      }
    } else {
      e.reply(
        `房主还未开始狼人鲨或你不是加入的玩家或还没到对应阶段，无法操作`,
        true
      )
      return true
    }
  } else {
    e.reply(`狼人鲨未发起`)
    return true
  }
}

async discuss(e) {
  let guessConfig = getGuessConfig(e)
  if (guessConfig.gameing) {
    if (guessConfig.current && phase == 'night2') {
      let i = search(e.user_id)
      if (i != -1) {
        if (wj2[i][4] == 1 && wj2[i][3] == '狼') {
          for (var qq = 0; qq < wj2.length; qq++) {
            if (wj2[qq][3] == '狼' && qq != i) {
              let replyMsg =
                i +
                '号(' +
                wj2[i][2] +
                ')说：' +
                e.msg.replace(/讨论/, '').trim()
              // 自动向Master转发消息（也可以在这里改成指定QQ）
              let userId = wj2[qq][1]
              if (replyMsg != '') {
                Bot.pickUser(userId).sendMsg(replyMsg)
              }
            }
          }
        } else {
          e.reply(`你已经出局了或你不是对应身份，无法操作`, true)
          return true
        }
      } else {
        e.reply(`你不是狼人鲨参与者，无法操作`, true)
        return true
      }
    } else {
      e.reply(
        `房主还未开始狼人鲨或你不是加入的玩家或还没到对应阶段，无法操作`,
        true
      )
      return true
    }
  } else {
    e.reply(`狼人鲨未发起`)
    return true
  }
}

async boom(e) {
  let guessConfig = getGuessConfig(e)
  if (guessConfig.gameing) {
    if (guessConfig.current && phase == 'day1') {
      let i = search(e.user_id)
      if (i != -1) {
        if (wj2[i][4] == 1) {
          let msg = ''
          wj2[i][4] = 0
          msg = i + '号(' + wj2[i][2] + ')' + `自爆了！自爆的玩家立即出局！`
          if (isGameEnd() == 1) {
            msg =
              msg +
              '\n游戏结束！狼阵营胜利！本局的所有玩家身份是：\n' +
              show3(wj2)
            init(e)
            e.reply(msg)
            return true
          } else if (isGameEnd() == 2) {
            msg =
              msg +
              '\n游戏结束！好人阵营胜利！本局的所有玩家身份是：\n' +
              show3(wj2)
            init(e)
            e.reply(msg)
            return true
          } else {
            msg = msg + '\n请他发表遗言，时限' + time + '秒'
          }
          e.reply(msg, true)
          setTimeout(() => {
            let msg = '遗言阶段结束！天黑请闭眼...'
            e.reply(msg)
            cyc(e)
          }, time * 1000)
        } else {
          e.reply(`你已经出局了或你不是对应身份，无法操作`, true)
          return true
        }
      } else {
        e.reply(`你不是狼人鲨参与者，无法操作`, true)
        return true
      }
    } else {
      e.reply(
        `房主还未开始狼人鲨或你不是加入的玩家或还没到对应阶段，无法操作`,
        true
      )
      return true
    }
  } else {
    e.reply(`狼人鲨未发起`)
    return true
  }
}

async setting(e) {
  let temp = e.msg
    .replace(/设置身份序列/g, '')
    .trim()
    .replace(/，/g, ',')
  shenfen = temp.split(',')
  let str = ''
  shenfen.forEach(function(element) {
    str = str + element + ','
  })
  e.reply(`设置身份序列成功！当前身份序列为：\n` + str, true)
}
}



const guessConfigMap = new Map()

function getGuessConfig(e) {
  let key = group[0]
  let config = guessConfigMap.get(key)
  if (config == null) {
    config = {
      gameing: false,
      current: false,
      timer: null
    }
    guessConfigMap.set(key, config)
  }
  return config
}
function shuffle(arr) {
  var result = [],
    random
  while (arr.length > 0) {
    random = Math.floor(Math.random() * arr.length)
    result.push(arr[random])
    arr.splice(random, 1)
  }
  return result
}

function show(arr) {
  var rslt = ''
  for (var i = 0; i < wj2.length; i++) {
    if (wj2[i][4] == 1) {
      rslt = rslt + i + '：' + wj2[i][2] + '\n'
    }
  }
  return rslt
}

function show3(arr) {
  var rslt = ''
  for (var i = 0; i < wj2.length; i++) {
    rslt = rslt + i + '：' + wj2[i][2] + '，身份是：' + wj2[i][3] + '\n'
  }
  return rslt
}

function showConsole() {
  for (var i = 0; i < wj2.length; i++) {
    console.log(
      wj2[i][0],
      wj2[i][1],
      wj2[i][2],
      wj2[i][3],
      wj2[i][4],
      wj2[i][5],
      wj2[i][6],
      wj2[i][7],
      wj2[i][8],
      dead[0],
      dead[1],
      dead[2]
    )
  }
}

function show2(arr) {
  var rslt = ''
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][4] == 1)
      rslt =
        rslt +
        i +
        '：' +
        arr[i][2] +
        ' 得票数：' +
        arr[i][8] +
        ' 投他的人是：' +
        arr[i][5] +
        '\n'
  }
  console.log(rslt)
  return rslt
}

function search(user) {
  var rslt = -1
  for (var i = 0; i < wj2.length; i++) {
    if (wj2[i][1] == user) {
      rslt = i
    }
  }
  return rslt
}

function shuffle2(arr) {
  var result = [],
    random
  while (arr.length > 0) {
    random = Math.floor(Math.random() * arr.length)
    result.push(arr[random])
    arr.splice(random, 1)
  }
  for (var i = 0; i < result.length; i++) {
    result[i][0] = i
  }
  return result
}

function isGameEnd(arr) {
  let alivew = 0
  let alives = 0
  let alivem = 0
  if (wj2.length > tubian) {
    for (var i = 0; i < wj2.length; i++) {
      if (wj2[i][4] == 1) {
        if (wj2[i][3] == '狼') {
          alivew = alivew + 1
        } else if (wj2[i][3].includes('平民')) {
          alivem = alivem + 1
        } else {
          alives = alives + 1
        }
      }
    }
    if (alivem == 0 || alives == 0) {
      return 1
    } else if (alivew == 0) {
      return 2
    } else {
      return 0
    }
  } else {
    for (var i = 0; i < wj2.length; i++) {
      if (wj2[i][4] == 1) {
        if (wj2[i][3] == '狼') {
          alivew = alivew + 1
        } else {
          alives = alives + 1
        }
      }
    }
    if (alives <= 1 && alivew > 0) {
      return 1
    } else if (alivew == 0) {
      return 2
    } else {
      return 0
    }
  }
}

function deadlist(arr) {
  let rslt = ''
  if (arr[0] != -1) {
    rslt = rslt + arr[0] + '号(' + wj2[arr[0]][2] + ')'
  }
  if (arr[0] != -1 && arr[1] != -1 && arr[0] != arr[1]) {
    rslt = rslt + '；'
  }
  if (arr[1] != -1 && arr[0] != arr[1]) {
    rslt = rslt + arr[1] + '号(' + wj2[arr[1]][2] + ')'
  }
  if (arr[1] != -1 && arr[2] != -1 && arr[2] != arr[1] && arr[2] != arr[0]) {
    rslt = rslt + '；'
  }
  if (arr[2] != -1 && arr[2] != arr[1] && arr[2] != arr[0]) {
    rslt = rslt + arr[1] + '号(' + wj2[arr[1]][2] + ')'
  }
  return rslt
}

function cyc(e) {
  let lag = 0 //狼讨论鲨人时间
  let lag2 = 0 //女巫银水时间
  let lag3 = 0 //猎人响应时间
  if (wj2.length > 11) {
    lag = time * 3000
  } else if (wj2.length > 5) {
    lag = time * 2000
  } else {
    lag = time * 1000
  }
  if (wj2.length > witchSPN) {
    lag2 = time * 1000
  } else {
    lag2 = 2000
  }
  for (var i = 0; i < wj2.length; i++) {
    wj2[i][7] = 0
  }
  phase = 'night1'
  setTimeout(() => {
    let guessConfig = getGuessConfig(e)
    if (guessConfig.current == false) {
      return true
    }
    let msg = '玩家列表：\n' + show(wj2)
    e.reply(msg)
    setTimeout(() => {
      let msg =
        '请收到机器人私聊的玩家依照提示对机器人私聊发送命令，时限' + time + '秒'
      e.reply(msg)
      for (var i = 0; i < wj2.length; i++) {
        let replyMsg = ''
        if (wj2[i][4] == 1) {
          if (wj2[i][3] == '预言家') {
            replyMsg =
              '玩家列表：\n' +
              show(wj2) +
              '你是预言家，请私聊发送【占卜*号】来占卜一名玩家的身份'
          }
          if (wj2[i][3] == '守卫') {
            replyMsg =
              '玩家列表：\n' +
              show(wj2) +
              '你是守卫，请发送【守卫*号】来守卫玩家'
          }
          if (wj2[i][3] == '女巫' && goldp == -1) {
            replyMsg =
              '玩家列表：\n' +
              show(wj2) +
              '你是女巫，请发送【毒*号】来毒玩家，或不发送以选择不使用（已使用过请忽略）'
          }
          if (wj2[i][3] == '平民（毒药能力）') {
            replyMsg =
              '玩家列表：\n' +
              show(wj2) +
              '你被奇货商人赋予了毒药能力，请发送【毒*号】来毒玩家，或不发送以选择不使用'
          }
          if (wj2[i][3] == '平民（占卜能力）') {
            replyMsg =
              '玩家列表：\n' +
              show(wj2) +
              '你被奇货商人赋予了占卜能力，请发送【占卜*号】来毒玩家，或不发送以选择不使用'
          }
          if (wj2[i][3] == '奇货商人' && qh[0] == -1) {
            replyMsg =
              '玩家列表：\n' +
              show(wj2) +
              '你是奇货商人，请发送【给*号毒药】【给*号占卜】给予其他玩家能力，或不发送以选择不使用（已使用过请忽略）'
          }
          let userId = wj2[i][1]
          if (replyMsg != '') {
            Bot.pickUser(userId).sendMsg(replyMsg)
          }
        }
      }
      setTimeout(() => {
        let guessConfig = getGuessConfig(e)
        if (guessConfig.current == false) {
          return true
        }
        phase = 'night2'
        let msg =
          '请收到机器人私聊的玩家依照提示对机器人私聊发送命令，时限' +
          lag / 1000 +
          '秒'
        e.reply(msg)
        for (var i = 0; i < wj2.length; i++) {
          let replyMsg = ''
          if (wj2[i][4] == 1) {
            if (wj2[i][3] == '狼') {
              replyMsg =
                '玩家列表：\n' +
                show(wj2) +
                '请发送【讨论+内容】进行狼之间的讨论，并发送【鲨掉*号】鲨掉一个玩家！'
            }
            if (wj2[i][3] == '预言家') {
              replyMsg = '占卜阶段结束'
            }
            if (wj2[i][3] == '守卫') {
              replyMsg = '守卫阶段结束'
            }
            if (wj2[i][3] == '女巫') {
              replyMsg = '毒药阶段结束'
            }
            if (wj2[i][3] == '平民（毒药能力）') {
              replyMsg = '毒药阶段结束'
            }
            if (wj2[i][3] == '平民（占卜能力）') {
              replyMsg = '占卜阶段结束'
            }
            let userId = wj2[i][1]
            if (replyMsg != '') {
              Bot.pickUser(userId).sendMsg(replyMsg)
            }
          }
        }
        setTimeout(() => {
          let guessConfig = getGuessConfig(e)
          if (guessConfig.current == false) {
            return true
          }
          for (var i = 0; i < wj2.length; i++) {
            let replyMsg = ''
            if (wj2[i][3] == '狼' && wj2[i][4] == 1) {
              replyMsg = replyMsg + '讨论/鲨人阶段结束'
            }
            let userId = wj2[i][1]
            if (replyMsg != '') {
              Bot.pickUser(userId).sendMsg(replyMsg)
            }
          }
          if (wj2.length > witchSPN) {
            phase = 'night3'
            let msg =
              '请收到机器人私聊的玩家依照提示对机器人私聊发送命令，时限' +
              time +
              '秒'
            e.reply(msg)
            var w = -1
            for (var witch = 0; witch < wj2.length; witch++) {
              if (
                wj2[witch][3] == '女巫' &&
                (wj2[witch][4] == 1 || wkill == witch)
              ) {
                w = witch
              }
            }
            if (
              w != -1 &&
              wkill != -1 &&
              sliverp == -1 &&
              goldp < 0 &&
              (saveWitch == 0 || w != wkill)
            ) {
              let userId = wj2[w][1]
              let replyMsg =
                '晚上狼们鲨掉了' +
                wkill +
                '号' +
                '(' +
                wj2[wkill][2] +
                ')' +
                '！发送【救他】可以使用秘药救他！一局游戏只有一次机会哦！'
              if (replyMsg != '') {
                Bot.pickUser(userId).sendMsg(replyMsg)
              }
            }
          }
          setTimeout(() => {
            let guessConfig = getGuessConfig(e)
            if (guessConfig.current == false) {
              return true
            }
            msg = ''
            if (sliverp > -1) {
              //女巫使用秘药
              wj2[wkill][4] = 1
              dead[1] = -1
              sliverp = -2
              //msg = '女巫似乎失去了她的一瓶药水...\n'
            }
            if (goldp > -1) {
              //女巫使用毒药
              wj2[goldp][4] = 0
              goldp = -2
              //msg = '女巫似乎失去了她的一瓶药水...\n'
            }
            if (goldp2 > -1) {
              //平民使用毒药
              wj2[goldp2][4] = 0
              goldp2 = -2
              //msg = '女巫似乎失去了她的一瓶药水...\n'
            }
            for (var die; die < dead.length; die++) {
              if (dead[die] > -1) {
                wj2[dead[die]][4] = 0
              }
            }
            showConsole()
            if (isGameEnd() == 1) {
              let msg = ''
              if (dead.length > 0) {
                msg =
                  msg +
                  '度过了一个漫长的夜晚...\n昨晚 ' +
                  deadlist(dead) +
                  ' 出局了！\n'
              }
              msg =
                msg +
                '游戏结束！狼阵营胜利！本局的所有玩家身份是：\n' +
                show3(wj2)
              init(e)
              e.reply(msg)
              return true
            } else if (isGameEnd() == 2) {
              let msg = ''
              if (dead.length > 0) {
                msg =
                  msg +
                  '度过了一个漫长的夜晚...\n昨晚 ' +
                  deadlist(dead) +
                  ' 出局了！\n'
              }
              msg =
                msg +
                '游戏结束！好人阵营胜利！本局的所有玩家身份是：\n' +
                show3(wj2)
              init(e)
              e.reply(msg)
              return true
            } else if (isGameEnd() == 0) {
              if (deadlist(dead).length > 0) {
                msg =
                  msg +
                  '度过了一个漫长的夜晚...\n昨晚 ' +
                  deadlist(dead) +
                  ' 出局了！'
                if (wj2[dead[1]][3] == '猎人') {
                  msg =
                    msg +
                    '\n' +
                    dead[1] +
                    '号被狼鲨掉了，他是猎人，可以在群聊发送【反鲨*号】鲨掉一名玩家！时限' +
                    time +
                    '秒\n玩家列表：\n' +
                    show(wj2)
                  shot = 0
                  lag3 = time * 1000
                } else {
                  lag3 = 2000
                }
                e.reply(msg)
                setTimeout(() => {
                  let guessConfig = getGuessConfig(e)
                  if (guessConfig.current == false) {
                    return true
                  }
                  shot = -2
                  if (turn == 0) {
                    msg = ''
                    msg =
                      msg +
                      '第一个晚上出局的玩家可以发表遗言，时限' +
                      time +
                      '秒，请发表遗言'
                    e.reply(msg)
                    setTimeout(() => {
                      let guessConfig = getGuessConfig(e)
                      if (guessConfig.current == false) {
                        return true
                      }
                      let msg =
                        '遗言结束！进入白天自由讨论时间！发起者可以输入【结束讨论】开始白天投票！\n当前存活玩家列表：\n' +
                        show(wj2)
                      e.reply(msg)
                      phase = 'day1'
                      turn = turn + 1
                    }, time * 1000)
                  } else {
                    msg =
                      msg +
                      '\n进入白天自由讨论时间！发起者可以输入【结束讨论】开始白天投票！\n当前存活玩家列表：\n' +
                      show(wj2)
                    e.reply(msg)
                    phase = 'day1'
                    turn = turn + 1
                  }
                }, lag3)
              } else {
                msg =
                  '似乎没有人出局...\n进入白天自由讨论时间！发起者可以输入【结束讨论】开始白天投票！\n当前存活玩家列表：\n' +
                  show(wj2)
                e.reply(msg)
                phase = 'day1'
                turn = turn + 1
              }
            }
          }, lag2)
        }, lag)
      }, time * 1000)
    }, 2000)
  }, 2000)
}
