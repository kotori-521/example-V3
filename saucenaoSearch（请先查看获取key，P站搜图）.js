import { segment } from "oicq";
import { createRequire } from 'module';
import fetch from "node-fetch";



const require = createRequire(import.meta.url);

//项目路径
const _path = process.cwd();

//1.定义命令规则
export const rule = {
    soutu: {
        reg: "^#搜图(.*)$",  //匹配消息正则，命令正则
        priority: 5011, //优先级，越小优先度越高
        describe: "【搜图】带上图", //【命令】功能说明
    },
};

let minsim = 60; //匹配度，50以下的可能会不太准
let Ngroup = false; //是否禁用群聊

export async function soutu(e) {
    if (e.isGroup && !e.isMaster && Ngroup == true) {
      return false;
    }
    try {
        let api_key = '这里填你的key'
        //自行去https://saucenao.com/user.php注册账号，然后在https://saucenao.com/user.php?page=search-api找到属于你的api key，填到引号里
        let imgURL = e.img[0];
        let url
        if (imgURL.length > 0) {
            url = "https://saucenao.com/search.php";
        }
        const axios = require('axios')
        const response = await axios.get(url, {
            params: {
                url: imgURL,
                db: 999,
                api_key:'5839310555f97ed2cdca6d97dd869d6db57d5225',
                output_type: 2,
                numres: 3
            }
        })
        const res = response.data.results[0]
        console.log(res)
        if (res.header.similarity < minsim) {
            e.reply([segment.at(e.user_id), "相似度低于60，没有找到靠谱的来源~ ~"]);
            //cancel(e);
            return true;
        }
        let msg = res.data.pixiv_id ? [
            segment.at(e.user_id), '\n',
            "相似度：" + res.header.similarity + "%\n",
            "标题：" + res.data.title, '\n',
            "P站ID：" + res.data.pixiv_id, '\n',
            "画师：" + res.data.member_name, '\n',
            "来源：" + res.data.ext_urls[0], '\n',
            "国内访问：https://pixiv.re/" + res.data.pixiv_id + ".jpg", '\n',
            "如果图大加载慢，点击链接后，右上角浏览器打开。",
            segment.image(res.header.thumbnail),
        ] : [
            segment.at(e.user_id), '\n',
            "相似度：" + res.header.similarity + "%\n",
            "画师：" + res.data.creator, '\n',
            "来源：" + res.data.ext_urls[0], '\n',
            "追溯来源：" + res.data.source, '\n',
            segment.image(res.header.thumbnail),
        ]
        //发送消息
        e.reply(msg);
    } catch (err) {
        let msg = [
            //@用户
            segment.at(e.user_id), '\n',
            //文本消息
            "请重试（注意在同一条消息内发送#搜图和要搜的图）",
            err
            //图片
        ];
        //发送消息
        e.reply(msg);
    }
    return true;//返回true 阻挡消息不再往下
}
