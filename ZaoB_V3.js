/* eslint-disable */
import { segment } from "oicq";
import fetch from "node-fetch";
import plugin from "../../lib/plugins/plugin.js";
export class ZaoB_V3 extends plugin{
    constructor () {
        super({
            /** 功能名称 */
            name: '早报',
            /** 功能描述 */
            dsc: '【#例子】开发简单示例演示',
            /** https://oicqjs.github.io/oicq/#events */
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 12999,
            rule: [
                {
                    /** 命令正则匹配 */
                    reg: '^#*早报(.*)$',
                    /** 执行方法 */
                    fnc: 'ZaoBao_V3'
                }
            ]
        })
    }
    async ZaoBao_V3(e){
        let url = `https://v2.alapi.cn/api/zaobao?token=xwQBH90q9MVmSuAK&format=image`;
        //打开此网页注册登陆https://admin.alapi.cn/account/center
        //将123改为自己的token

        let msg = [

            segment.image(url),

        ];
        e.reply(msg);
        return true;
    }
}
