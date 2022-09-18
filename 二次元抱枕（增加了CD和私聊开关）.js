import {segment} from "oicq";
import fetch from "node-fetch";

//项目路径
const _path = process.cwd();
let CD = {};
//各CD权限
let timeout = 8000; //0表示不撤回，单位毫秒，默认15s。
let GetCD = true; //是否开启用户指令CD,默认开启
let CDTime = 60000;//用户指令CD时间(毫秒)，即60秒，不建议调太低，防刷屏以及api被拉黑。
let Private = true;//是否禁用私聊
//命令规则
export const rule = {
    Baozhen: {
        //这里设置你要触发的关键词
        reg: "^来个抱枕|老婆抱枕$", //匹配消息正则，命令正则
        priority: 2333, //优先级，越小优先度越高
        describe: "【来个抱枕】二次元抱枕", //【命令】功能说明
    },
};

//消息撤回方法
export function Chehui(msgRes, e) {
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

//实现功能方法
export async function Baozhen(e) {
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
    Chehui(msgRes, e)//调用撤回方法
    return true; //返回true 阻挡消息不再往下
}