import plugin from '../../lib/plugins/plugin.js'
import { segment } from 'oicq'
import cfg from '../../lib/config/config.js'
import common from '../../lib/common/common.js'

/**
 * ...更改设置之后记得重启一下
 * 作者:超市椰羊(746659424) 首发群(258623209)
 * > 增加是否给全部管理发送通知
 * > 增加同意好友申请和同意群邀请 需设置 other.yaml 中两个为 0 否则将会被自动处理
 */


const config = {
    /**通知开关设置，以下的所有配置项中，true 为开启 false 为关闭，按需要修改*/

    // 消息通知
    privateMessage: false, //好友消息
    groupMessage: false, //群|讨论组消息(不建议开启)
    // 申请通知
    friendRequest: true, //好友申请
    groupInviteRequest: true, //群邀请
    // 信息变动
    groupAdminChange: true, //群管理变动
    // 列表变动
    friendNumberChange: true,//好友列表变动
    groupNumberChange: true, //群聊列表变动
    groupMemberNumberChange: false,//群成员变动
    // 其他通知
    flashPhoto: true, //闪照
    botBeenBanned: true, //机器人被禁言
    //是否给全部管理发送通知(默认只通知第一个管理)
    notificationsAll: false,
};
const ROLE_MAP = {
    admin: `群管理`,
    owner: `群主`,
    member: `群员`
};

/**
 * 好友通知
 */
export class Friends extends plugin {
    constructor() {
        super({
            name: '好友通知',
            dsc: '好友通知',
            /** https://oicqjs.github.io/oicq/#events */
            event: 'notice.friend',
            priority: 5000
        })
    }

    /** 接受到消息都会执行一次 */
    async accept(e) {
        let msg;
        switch (e.sub_type) {
            case `increase`: {
                if (!config.friendNumberChange)
                    return;
                msg = [segment.image(`https://q1.qlogo.cn/g?b=qq&s=0&nk=${e.user_id}`),
                    `[通知 - 新增好友]\n`,
                `好友QQ：${e.user_id}\n`,
                `好友昵称：${e.nickname}`]
                break;
            }
            case `decrease`: {
                if (!config.friendNumberChange)
                    return;
                msg = [segment.image(`https://q1.qlogo.cn/g?b=qq&s=0&nk=${e.user_id}`),
                    `[通知 - 好友减少]\n`,
                `好友QQ：${e.user_id}\n`,
                `好友昵称：${e.nickname}`]
                break;
            }
            case `recall`: {
                if (!config.privateMessage)
                    return;
                msg = [segment.image(`https://q1.qlogo.cn/g?b=qq&s=0&nk=${e.user_id}`),
                    `[消息 - 好友撤回消息]\n`,
                `好友QQ：${e.user_id}`]
                break;
            }
            case `poke`: {
                if (!config.privateMessage)
                    return;
                msg = [segment.image(`https://q1.qlogo.cn/g?b=qq&s=0&nk=${e.user_id}`),
                    `[消息 - 戳一戳]\n`,
                `来源QQ：${e.user_id}`]
                break;
            }
            default:
                return;
        }
        await commons(msg)
    }
}



/**
 * 群通知
 */
export class newgroups extends plugin {
    constructor() {
        super({
            name: '群通知',
            dsc: '群通知',
            event: 'notice.group',
        })
    }
    async accept(e) {
        let msg;
        switch (e.sub_type) {
            case `increase`: {
                if (e.user_id === cfg.qq) {
                    if (!config.groupNumberChange)
                        return;
                    msg = [segment.image(e.group.getAvatarUrl()),
                        `[通知 - 新增群聊]\n`,
                    `新增群号：${e.group_id}`]
                }
                else {
                    if (!config.groupMemberNumberChange)
                        return;
                    msg = [segment.image(e.group.getAvatarUrl()),
                        `[通知 - 新增群员]\n`,
                    `群号：${e.group_id}\n`,
                    `新成员QQ：${e.user_id}\n`,
                    `新成员昵称：${e.nickname}`]
                }
                break;
            }
            case `decrease`: {
                if (e.dismiss) {
                    if (!config.groupNumberChange)
                        return;
                    msg = [segment.image(e.group.getAvatarUrl()),
                        `[通知 - 群聊被解散]\n`,
                    `操作人QQ：${e.operator_id}\n`,
                    `解散群号：${e.group_id}`]
                }
                else if (e.user_id === cfg.qq && e.operator_id !== cfg.qq) {
                    if (!config.groupNumberChange)
                        return;
                    msg = [segment.image(e.group.getAvatarUrl()),
                        `[通知 - 机器人被踢]\n`,
                    `操作人QQ：${e.operator_id}\n`,
                    `被踢群号：${e.group_id}`]
                }
                else if (e.user_id === cfg.qq && e.operator_id === cfg.qq) {
                    if (!config.groupNumberChange)
                        return;
                    msg = [segment.image(e.group.getAvatarUrl()),
                        `[通知 - 机器人退群]\n`,
                    `退出群号：${e.group_id}`]
                }
                else if (e.operator_id === e.user_id) {
                    if (!config.groupMemberNumberChange)
                        return;
                    msg = [segment.image(e.group.getAvatarUrl()),
                        `[通知 - 群员退群]\n`,
                    `退群人QQ：${e.user_id}\n`,
                    `退群人昵称：${e.member === null || e.member === void 0 ? void 0 : e.member.nickname}\n`,
                    `退群人群名片：${e.member === null || e.member === void 0 ? void 0 : e.member.card}\n`,
                    `退出群号：${e.group_id}`]
                }
                else if (e.operator_id !== e.user_id) {
                    if (!config.groupMemberNumberChange)
                        return;
                    msg = [segment.image(e.group.getAvatarUrl()),
                        `[通知 - 群员被踢]\n`,
                    `操作人QQ：${e.operator_id}\n`,
                    `被踢人QQ：${e.user_id}\n`,
                    `被踢人昵称：${e.member === null || e.member === void 0 ? void 0 : e.member.nickname}\n`,
                    `被踢人群名片：${e.member === null || e.member === void 0 ? void 0 : e.member.card}\n`,
                    `被踢群号：${e.group_id}`]
                }
                break;
            }
            // 群管理变动
            case `admin`: {
                if (!config.groupAdminChange)
                    return;
                if (e.user_id === cfg.qq) {
                    msg = [segment.image(e.group.getAvatarUrl()),
                    e.set ? `[通知 - 机器人被设置管理]:\n` : `[通知 - 机器人被取消管理]:\n`,
                    `被操作群号：${e.group_id}`]
                } else {
                    msg = [segment.image(e.group.getAvatarUrl()),
                    e.set ? `[通知 - 新增群管理员]:\n` : `[通知 - 取消群管理员]:\n`,
                    `被操作QQ：${e.user_id}\n`,
                    `被操作群号：${e.group_id}`]
                }
                break;
            }
            // 禁言 (这里仅处理机器人被禁言)
            case `ban`: {
                let Forbiddentime;
                if (e.duration < 3600) {
                    Forbiddentime = e.duration / 60 + '分'
                } else if (e.duration < 86400) {
                    Forbiddentime = e.duration / 3600 + '时'
                } else {
                    let d = parseInt(e.duration / 60 / 60 / 24);
                    let h = parseInt(e.duration / 60 / 60 % 24);
                    let m = parseInt(e.duration / 60 % 60);
                    if (h == 0 && m == 0) {
                        Forbiddentime = `${d}天`
                    } else if (m == 0) {
                        Forbiddentime = `${d}天${h}时`
                    } else {
                        Forbiddentime = `${d}天${h}时${m}分`
                    }
                }
                if (!config.botBeenBanned)
                    return;
                if (e.user_id != cfg.qq)
                    return;
                if (e.duration == 0) {
                    msg = [segment.image(e.group.getAvatarUrl()),
                        `[通知 - 机器人被解除禁言]\n`,
                    `处理人QQ：${e.operator_id}\n`,
                    `处理群号：${e.group_id}`]
                } else if (e.user_id === cfg.qq) {
                    msg = [segment.image(e.group.getAvatarUrl()),
                        `[通知 - 机器人被禁言]\n`,
                    `禁言人QQ：${e.operator_id}\n`,
                    `禁言群号：${e.group_id}\n`,
                    `禁言时长：${(Forbiddentime)}`]
                }
                break;
            }
            // 群转让
            case `transfer`: {
                if (!config.groupNumberChange)
                    return;
                msg = [segment.image(e.group.getAvatarUrl()),
                    `[通知 - 群聊转让]\n`,
                `转让群号：${e.group_id}\n`,
                `旧群主：${e.operator_id}\n`,
                `新群主：${e.user_id}`]
                break;
            }
            // 群戳一戳
            case `poke`: {
                // ...
                break;
            }
            default:
                return;
        }
        await commons(msg)
    }
}

/**
 * 好友
 */
export class application extends plugin {
    constructor() {
        super({
            name: '好友申请',
            dsc: '好友申请',
            /** https://oicqjs.github.io/oicq/#events */
            event: 'request.friend',
        })


    }
    async accept(e) {
        if (!config.friendRequest)
            return;
        let msg = [segment.image(`https://q1.qlogo.cn/g?b=qq&s=0&nk=${e.user_id}`),
            `[通知 - 添加好友申请]\n`,
        `申请人QQ：${e.user_id}\n`,
        `申请人昵称：${e.nickname}\n`,
        `申请来源：${e.source || `未知`}\n`,
        `附加信息：${e.comment || `无附加信息`}\n`]
        if (cfg.other.autoFriend == 1) {
            msg.push(`已自动同意该好友申请`)
        } else {
            msg.push(`-------------\n可回复：同意申请${e.user_id} \n或引用该消息回复"同意"`)
        }
        await commons(msg)
    }
}
//群邀请
export class invitation extends plugin {
    constructor() {
        super({
            name: '群邀请',
            dsc: '群邀请',
            /** https://oicqjs.github.io/oicq/#events */
            event: 'request.group.invite',
        })
    }
    async accept(e) {
        console.log(e);
        let msg = ``;
        if (!config.groupInviteRequest)
            return;
        for (let qq of cfg.masterQQ) {
            if (e.user_id == qq) return
        }
        msg = [segment.image(`https://p.qlogo.cn/gh/${e.group_id}/${e.group_id}/0`),
            `[通知 - 邀请机器人进群]\n`,
        `目标群号：${e.group_id}\n`,
        `目标群名：${e.group_name}\n`,
        `邀请人QQ：${e.user_id}\n`,
        `邀请人昵称：${e.nickname}\n`,
        `邀请人群身份：${ROLE_MAP[e.role]}\n`,
        `邀请码：${e.seq}\n`,
        ]
        if (cfg.other.autoQuit <= 0) {
            msg.push(`----------------\n可引用该消息回复"同意"`)
        } else {
            msg.push(`已自动处理该邀请`)
        }
        await commons(msg)
    }
}
//好友消息
export class anotice extends plugin {
    constructor() {
        super({
            name: '消息',
            dsc: '闪照等消息',
            /** https://oicqjs.github.io/oicq/#events */
            event: 'message',
            rule: [
                {
                    /** 命令正则匹配 */
                    reg: '^#?同意申请.*$',
                    /** 执行方法 */
                    fnc: 'agree'
                },
                {
                    /** 命令正则匹配 */
                    reg: '^同意$',
                    /** 执行方法 */
                    fnc: 'agrees'
                }
            ]
        })

    }
    async accept(e) {

        let msg = "";
        if (e.message[0].type == 'flash' && e.message_type === "group" && config.flashPhoto) {
            msg = [segment.image(e.group.getAvatarUrl()),
                `[消息 - 闪照消息]\n`,
            `发送人QQ：${e.user_id}\n`,
            `发送人昵称：${e.sender.nickname}\n`,
            `来源群号：${e.group_id}\n`,
            `来源群名：${e.group_name}\n`,
            `闪照链接:${e.message[0].url}`]
        }
        else if (e.message[0].type == 'flash' && e.message_type === "discuss" && config.flashPhoto) {
            msg = [segment.image(`https://q1.qlogo.cn/g?b=qq&s=0&nk=${e.user_id}`),
                `[消息 - 闪照消息]\n`,
            `发送人QQ：${e.user_id}\n`,
            `发送人昵称：${e.sender.nickname}\n`,
            `讨论组号：${e.discuss_id}\n`,
            `讨论组名：${e.discuss_name}\n`,
            `闪照链接:${e.message[0].url}`]
        }
        else if (e.message[0].type == 'flash' && e.message_type === "private" && config.flashPhoto) {
            msg = [segment.image(`https://q1.qlogo.cn/g?b=qq&s=0&nk=${e.user_id}`),
                `[消息 - 闪照消息]\n`,
            `发送人QQ：${e.user_id}\n`,
            `发送人昵称：${e.sender.nickname}\n`,
            `闪照链接:${e.message[0].url}`]
        } else if (e.message_type === "private") {
            if (!config.privateMessage)
                return;
            if (cfg.masterQQ.indexOf(e.user_id) != -1) return;
            msg = [segment.image(`https://q1.qlogo.cn/g?b=qq&s=0&nk=${e.user_id}`),
                `[消息 - 好友消息]\n`,
            `好友QQ：${e.user_id}\n`,
            `好友昵称：${e.sender.nickname}\n`,
            `消息内容：${e.raw_message}`]
        }
        else if (e.message_type === "group") {
            if (!config.groupMessage)
                return;
            if (cfg.masterQQ.indexOf(e.user_id) != -1) return;
            msg = [segment.image(e.group.getAvatarUrl()),
                `[消息 - 群聊消息]\n`,
            `来源群号：${e.group_id}\n`,
            `来源群名：${e.group_name}\n`,
            `发送人QQ：${e.user_id}\n`,
            `发送人昵称：${e.sender.nickname}\n`,
            `消息内容：${e.raw_message}`]
        }
        else if (e.message_type === "discuss") {
            if (!config.groupMessage)
                return;
            if (cfg.masterQQ.indexOf(e.user_id) != -1) return;
            msg = [segment.image(`https://q1.qlogo.cn/g?b=qq&s=0&nk=${e.user_id}`),
                `[消息 - 群聊消息]\n`,
            `来源讨论组号：${e.discuss_id}\n`,
            `来源讨论组名：${e.discuss_name}\n`,
            `发送人QQ：${e.user_id}\n`,
            `发送人昵称：${e.sender.nickname}\n`,
            `消息内容：${e.raw_message}`]
        }

        await commons(msg)

    }
    /** 同意好友申请*/
    async agree(e) {
        if (!e.isMaster) return;

        let qq = e.message[0].text.replace(/#|同意申请/g, "").trim()
        if (e.message[1]) {
            qq = e.message[1].qq
        } else {
            qq = qq.match(/[1-9]\d*/g)
        }

        if (!qq) {
            e.reply("❎ 请输入正确的QQ号")
            return false
        }
        await Bot.pickFriend(qq).setFriendReq()
            .then(() => e.reply(`✅ 已同意${qq}的好友申请`))
            .catch(err => console.log(err))

    }
    /**引用同意好友申请和群邀请 */
    async agrees(e) {
        if (!e.isMaster) return;
        if (!e.source) return;
        let source;
        if (e.isGroup) {
            source = (await e.group.getChatHistory(e.source.seq, 1)).pop();
        } else {
            source = (await e.friend.getChatHistory(e.source.time, 1)).pop();
        }
        let res = source.raw_message.split("\n")
        try {
            if (/申请人QQ/.test(res[1])) {
                let qq = res[1].match(/[1-9]\d*/g)[0]
                Bot.pickFriend(qq).setFriendReq()
                    .then(() => e.reply(`✅ 已同意${qq}的好友申请`))
                    .catch(() => e.reply(`❎ 请检查是否已同意该申请`))
            } else if (/目标群号/.test(res[1]) && /邀请人QQ/.test(res[3]) && /邀请码/.test(res[6])) {
                //这里借鉴了一下p佬的进群同意，p佬我的超人！！！
                let groupid = res[1].match(/[1-9]\d*/g)[0]
                let qq = res[3].match(/[1-9]\d*/g)[0]
                let seq = res[6].match(/[1-9]\d*/g)[0]
                Bot.pickUser(qq).setGroupInvite(groupid, seq, true)
                    .then(() => e.reply(`✅ 已同意${qq}的群邀请`))
                    .catch(() => e.reply(`❎ 请检查是否已同意该邀请`))
            } else {
                e.reply("❎ 请检查是否引用正确")
            }
        } catch {
            e.reply("❎ 消息可能已过期")
        }


    }
}
async function commons(msg) {
    if (config.notificationsAll) {
        for (let index of cfg.masterQQ) {
            await common.relpyPrivate(index, msg)
        }
    } else {
        common.relpyPrivate(cfg.masterQQ[0], msg)
    }
}