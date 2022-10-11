/* eslint-disable */
import {segment} from "oicq";

//项目路径
const _path = process.cwd();
let CD = {};
//各CD权限
let timeout = 7000; //0表示不撤回，单位毫秒，默认15s。
let GetCD = true; //是否开启用户指令CD,默认开启
let CDTime = 60000;//用户指令CD时间(毫秒)，即60秒，不建议调太低，防刷屏以及api被拉黑。
let Private = true;//是否禁用私聊
let Groupon = true;
export class Baozhen extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: '抱枕',
            /** 功能描述 */
            dsc: 'ACG二次元抱枕',
            /** https://oicqjs.github.io/oicq/#events */
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 1000,
            rule: [
                {
                    /** 命令正则匹配 */
                    reg: '^来个抱枕|老婆抱枕$',
                    /** 执行方法 */
                    fnc: 'baozhen'
                }
            ]
        })
    }

    async baozhen(e) {
        if (e.isGroup && Groupon === false && !e.isMaster) {
            e.reply("抱枕功能暂时走丢了...>m<");
            return true;
        }
        if (CD[e.user_id] && GetCD === true && !e.isMaster) {
            e.reply("每60s一次抱枕喵，私聊也算入噢！");
            return true;
        }
        CD[e.user_id] = true;
        CD[e.user_id] = setTimeout(() => {
            if (CD[e.user_id]) {
                delete CD[e.user_id];
            }
        }, CDTime);
        //私聊开关模块
        if (e.isPrivate && !e.isMaster && Private === true) {
            e.reply("不 要 私 聊 瑟 瑟 ！");
            return;
        }
        console.log("用户命令：", e.msg);
        //执行的逻辑功能
        let msg = [segment.at(e.user_id),
            segment.image(`https://api.isoyu.com/bao_images.php`)
        ]
        let msgRes = await e.reply(msg);
        await this.Chehui(msgRes, e)//调用撤回方法
        return true; //返回true 阻挡消息不再往下
    }
    async Chehui(msgRes, e) {
        if (timeout !== 0 && msgRes && msgRes.message_id) {
            let target = null;
            if (e.isGroup) {
                target = e.group;
            } else {
                target = e.friend;
            }
            if (target != null) {
                setTimeout(() => {
                    target.recallMsg(msgRes.message_id);
                }, timeout);
            }
        }
    }
}