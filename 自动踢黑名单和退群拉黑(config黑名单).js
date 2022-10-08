import path from "path";
import fs from "fs";
import {segment} from "oicq";
const __dirname = path.resolve();

/**
 * 1.退群自动拉黑到机器人config黑名单
 * 2.当有人入群，如果是config黑名单自动踹出去
 * 3.需要机器人是管理员
 * 4.拉黑和踢人两个开关在下面配置，默认开启。
 * */
Bot.on("notice.group", (e) => {
    PullBlack(e);
});
//开关---
let pull=true;  //退群是否自动拉黑到config黑名单，true为开启，false为关闭
let check=true; //检测入群时是否自动踢出config黑名单的人，true为开启，false为关闭

//定义规则
export const rule = {
    PullBlack: {
        reg: "noCheck",
        priority: 3141, //优先级尽可能小(数值越大优先级越小)
        describe: '检测退群、入群，踢config黑名单，退群拉黑到config'
    }
};

export async function PullBlack(e) {
//若不是群消息则停止
    if (!e.isGroup) return true;
//申明变量
    let gainType = e.sub_type;
    if (gainType === "increase") {
        if (overBlack && BotConfig.balckQQ.includes(e.user_id) && check===true) {
            //检测到config黑名单的自动踢出去

            //机器人自捡是否为管理员，不是管理员不做反应，是管理员就执行，还没写
            // if(){
            //
            // }
            let msg = [
                segment.at(e.user_id), `出去了又进来干嘛？我送你张飞机票吧`
            ];
            await e.reply(msg);
            await e.group.kickMember(e.user_id, 0)
        }
    }
    if (gainType === "decrease" && pull===true) {
        let str = fs.readFileSync(__dirname + "/config/config.js", "utf8");
        const qq = e.user_id;
        let reg = /balckQQ:(\s*)\[/;
        let msg = `balckQQ:[${qq},`;
        str = str.replace(reg, msg);
        fs.writeFile(__dirname + '/config/config.js', str, 'utf8', (err) => {
            if (err) throw err;
            // console.log('config.js修改成功');
            e.reply(`${qq}已拉黑~`)
        });
        return true;
    }
    return true;
}
