import lodash from "lodash";
import { segment } from "oicq";
let DuelCD = {};


let cd = 600000;//冷却时间（毫秒）

let white = [114514, 1919810];//保赢QQ号（黑幕） 如果俩保赢QQ决斗就谁发起谁赢

let Min = 60;//随机禁言的底线，至少60s

let Max = 180;//随机禁言的上限

//御前决斗V2 作者 1695037643 看不懂可以问
/*
**********更新内容**********
修复管理参与的决斗模式触发不正常的bug
感谢越远的代码提示
感谢原插件作者的灵感(doge)
*/

export const rule = {
    Duel: {
        reg: "^#*御前决斗$",
        priority: 10000,
        describe: "御前决斗，胜率一半一半，输家被禁言 示例：#御前决斗@飞行矮堇瓜",
    }
};

export async function Duel(e) {
    if (e.isGroup) {
        if (e.at) {
            if (e.source)
                return;
            if (e.group.is_admin || e.group.is_owner) {
                if (e.at != BotConfig.account.qq) {
                    if (e.group.is_owner || (!e.member.is_owner && !e.group.pickMember(e.at).is_owner && !e.member.is_admin && !e.group.pickMember(e.at).is_admin)) {
                        if (DuelCD[e.user_id] != true) {
                            let RandomNum = lodash.random(0, 1);
                            if (white.includes(e.user_id))
                                RandomNum = 1;
                            else if (white.includes(e.at))
                                RandomNum = 0;
                            if (e.at != e.user_id) {
                                e.reply([segment.at(e.user_id), `\n向\n`, segment.at(e.at), `\n发起了御前决斗的挑战！`]);
                                await Sleep(1000);
                                if (RandomNum == 1) {
                                    e.group.muteMember(e.at, lodash.random(Min, Max));
                                    e.reply([segment.at(e.user_id), `\n恭喜你在御前决斗中幸存！`]);
                                }
                                else {
                                    e.group.muteMember(e.user_id, lodash.random(Min, Max));
                                    e.reply([segment.at(e.at), `\n恭喜你在御前决斗中幸存！`]);
                                }
                                SetCD(e);

                            }
                            else if (!white.includes(e.user_id)) {
                                e.group.muteMember(e.user_id, Max);
                                e.reply([segment.at(e.user_id), `\n...好吧，成全你`]);
                            }
                        }
                        else {
                            e.reply([segment.at(e.user_id), `\n别打了，再打就透支了`]);
                        }
                    }
                    else {
                        e.reply("我可没资格处决管理员......");
                    }
                }
                else if (!white.includes(e.user_id)) {
                    e.group.muteMember(e.user_id, Min);
                    e.reply([segment.at(e.user_id), `\n你什么意思？举办了`]);
                }
            }
            else
                e.reply("我不行，我不干，我跑路了");
        }
        else
            e.reply([segment.at(e.user_id), `\n找个人打啊，你要左右互搏？`]);
    }
    return true;
}

function SetCD(e) {
    DuelCD[e.user_id] = true;
    setTimeout(() => {
        delete DuelCD[e.user_id];
    }, cd);
    return;
}
function Sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    })
}