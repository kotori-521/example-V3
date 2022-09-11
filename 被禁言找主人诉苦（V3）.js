// by 癫癫博士
//上午看群友说需要，一拍脑门就写出来了hhh
//禁止倒卖

import { segment } from "oicq";
import plugin from '../../lib/plugins/plugin.js';
import cfg from '../../lib/config/config.js'


export class ban extends plugin{
    constructor(){
    super({
        name: '禁言诉苦',
        dsc: '被禁言了通知主人',
        event: 'notice.group.ban',
        priority: 5000,
    })
}

    async accept (){
        if (this.e.user_id == Bot.uin){
            logger.info('[被禁言了呜呜呜]')
            let msg = `主人,我在群${this.e.group_id}被禁言了呜呜呜`
            Bot.pickUser(cfg.masterQQ[0]).sendMsg(msg)
        }
    }
    
    
}