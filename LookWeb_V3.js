/* eslint-disable */
import {segment} from "oicq";

const wd = 1280
const ht = 1600
export class LookWeb_V3 extends plugin{
    constructor() {
        super(
            {
                name:'转发链接图片',
                dsc:'看看xxx链接',
                event: 'message',
                priority:'5000',
                rule:[{
                    reg:'^#*看看(.*)$',
                    fnc:'LookWeb'
                }
                ],
            }
        );
    }
    async LookWeb(e){
        if (e.hasReply) {
            let reply = (await e.group.getChatHistory(e.source.seq, 1)).pop()?.message;
            if (reply) {
                for (let val of reply) {
                    if (val.type === "text") {
                        e.msg = val.text;
                        // console.log(e.msg)
                        break;
                    }
                }
            }
        }
        if (e.msg.match("云崽")) {
            e.reply(segment.image("https://urlscan.io/liveshot/?width=1080&height=350&url=https://github.com/Le-niao/Yunzai-Bot"))
            return true;
        }
        if (e.msg.match("我的世界")) {
            e.reply(segment.image("https://urlscan.io/liveshot/?width=1920&height=1080&url=https://www.minecraft.net/zh-hans/store/minecraft-java-bedrock-edition-pc"))
            return true;
        }
        if (e.msg.match("洛克")) {
            e.reply(segment.image("https://urlscan.io/liveshot/?width=1000&height=2000&url=https://roco.qq.com/webplat/info/news_version3/397/11016/11018/m8584/202206/917855.shtml"))
            return true;
        }
        let msg = e.msg.replace(/#|看看|https:\/\/|http:\/\//g, "")
        if (msg === "" || msg.length < 3) {
            e.reply("你想看神魔噢？")
            return true
        }
        // console.log(msg)
        let url = `https://urlscan.io/liveshot/?width=${wd}&height=${ht}&url=https://${msg}`;
        console.log(url)
        e.reply(segment.image(url))
        return true; //返回true 阻挡消息不再往下
    }
}