import { segment } from "oicq";
import fetch from "node-fetch";
import fs from "fs";
import plugin from '../../lib/plugins/plugin.js'
/*
* 如需配置【复制】此文件，改名为profile.js
* 暂未做热更新，修改完毕请重启yunzai
* */
let url2 = ""
/*
* Enka面板服务API配置
*
* 【Enka官网】：https://enka.network/
*
* 感谢Enka提供的面板查询服务
* https://github.com/yoimiya-kokomi/miao-plugin/issues/63#issuecomment-1199348789
* 如果可以的话，也可考虑在Patreon上支持Enka，或提供闲置的原神账户，具体可在Discord联系
*
* 如Enka服务访问不稳定，可尝试更换MiniGrayGay大佬提供的中转服务
* 【广州节点】：https://enka.microgg.cn/
* 【上海节点】：https://enka.minigg.cn/
* 推荐使用【广州】或【上海】节点，如访问enka官网相对稳定的话推荐优先使用官方地址
* 感谢@MiniGrayGay 大佬提供的服务(Github: https://github.com/MiniGrayGay)
*
* 使用代理(科学上网)可以配置proxyAgent
* 例如: http://127.0.0.1:1080
* */

export class ghjd extends plugin {
  constructor () {
    super({
      name: '更换节点',
      dsc: '更换节点',
      event: 'message',
      priority: 1,
      rule: [
        
		{
			reg:"^#更换节点1",
			fnc:'genhuan1'
		},
		{
			reg:"^#更换节点2",
			fnc:'genhuan2'
		}

      ]
    })
  }
async genhuan1(e){
	e.reply("正在更换上海节点中")
	
	
	fs.cp('./plugins/example/config/profile2.txt', '././plugins/miao-plugin/config/profile.js', (err) => {
		e.reply("更换成功，重启云崽生效")
  if (err) {
    console.error(err);
  }
});
}

async genhuan2(e){
	e.reply("正在更换广东节点中")
	
	
	fs.cp('./plugins/example/config/profile.txt', '././plugins/miao-plugin/config/profile.js', (err) => {
		e.reply("更换成功，重启云崽生效")
  if (err) {
    console.error(err);
  }
});
}
}