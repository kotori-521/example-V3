//by 癫癫博士
//收集了一些文案类api,没什么技术含量,就图个齐全,不定期更新
//希望大家喜欢^^
//本人没有测试群，不过其他大佬有（比如渔火佬仓库里的其他作者），可以去看看，我也在里面快乐水群^^
//有idea/有提议/发现bug/发现好玩的api的话可以通过gitee评论或者私聊联系我~
//因为都是考api完成的，api寄了就不能用了，需要大家告诉我，我及时去换api源
//项目gitee地址：https://gitee.com/huangshx2001/yunzai-js-plug-in


import plugin from '../../lib/plugins/plugin.js'
import fetch from 'node-fetch'


export class wenan extends plugin {
    constructor () {
        super({
            /** 功能名称 */
            name: '文案收集',
            /** 功能描述 */
            dsc: '简单开发示例',
            /** https://oicqjs.github.io/oicq/#events */
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 5000,
            rule: [
                {
                    reg: '#文案帮助',
                    fnc: 'help'
                    },
                {
                    reg: '#一言',
                    fnc: 'hitokoto'
                    },
                {
                    reg: '#土味情话',
                    fnc: 'twqh'
                    },
                {
                    reg: '#彩虹屁',
                    fnc: 'chp'
                    },
                {
                    reg: '#毒鸡汤',
                    fnc: 'djt'
                    },
                {
                    reg: '#舔狗日记',
                    fnc: 'tgrj'
                    },
                {
                    reg: '#励志语录',
                    fnc: 'lzyl'
                    },
                {
                    reg: '#情话',
                    fnc: 'qh'
                    },
                {
                    reg: '#诗词',
                    fnc: 'sc'
                    },
                {
                    reg: '#笑话',
                    fnc: 'xh'
                    },
                {
                    reg: '#历史上的今天',
                    fnc: 'lssdjt'
                    },
                {
                    reg: '#网易云热评',
                    fnc: 'wyyrp'
                    },
               {
                    reg: '#口吐芬芳',
                    fnc: 'ktff'
                    },
               {
                    reg: '#安慰语录',
                    fnc: 'awyl'
                    },
               {
                    reg: '#伤感语录',
                    fnc: 'sgyl'
                    },
               {
                    reg: '#爱情公寓语录',
                    fnc: 'aqgyyl'
                    },
               {
                    reg: '#动漫一言',
                    fnc: 'dmyy'
                    },
               {
                    reg: '#绕口令',
                    fnc: 'rkl'
                    },
               {
                    reg: '#温柔语录',
                    fnc: 'wryl'
                    },
               {
                    reg: '#心灵鸡汤',
                    fnc: 'xljt'
                    },
               {
                    reg: '#新年祝福',
                    fnc: 'xnzf'
                    },
               {
                    reg: '#人间语录',
                    fnc: 'rjyl'
                    },
               {
                    reg: '#骚话',
                    fnc: 'sh'
                    },
               {
                    reg: '#霸道总裁语录',
                    fnc: 'bdzcyl'
                    },
               {
                    reg: '#社会语录',
                    fnc: 'shyl'
                    },
                ]
            }
        )
    }

    async help (e) {
        await this.reply(`已收录以下随机文案：\n【#一言】【#动漫一言】\n【#情话】【#土味情话】\n【#笑话】【#心灵鸡汤】\n【#骚话】【#新年祝福】\n【#诗词】【#舔狗日记】\n【#毒鸡汤】【#彩虹屁】\n【#绕口令】【#历史上的今天】\n【#口吐芬芳】【#网易云热评】\n【#励志/安慰/伤感/爱情公寓/人间/霸道总裁/社会语录】\n\n值得一提的是，【#口吐芬芳】有时候会骂的很恶毒，请不要对机器人生气哦，娱乐功能，请勿较真^^`)
    }
    
    async hitokoto (e) {
        /** e.msg 用户的命令消息 */
        logger.info('[用户命令]', e.msg)

        /** 一言接口地址 */
        let url = 'https://v1.hitokoto.cn/'
        /** 调用接口获取数据 */
        let res = await fetch(url).catch((err) => logger.error(err))
    
        /** 判断接口是否请求成功 */
        if (!res) {
          logger.error('[一言] 接口请求失败')
          return await this.reply('一言接口请求失败')
        }
    
        /** 接口结果，json字符串转对象 */
        res = await res.json()
        /** 输入日志 */
        logger.info(`[接口结果] 一言：${res.hitokoto}`)
    
        /** 最后回复消息 */
        await this.reply(`${res.hitokoto}`)
    }
    
    async twqh (e) {
        /** e.msg 用户的命令消息 */
        logger.info('[用户命令]', e.msg)
        let url = 'https://api.sdgou.cc/api/twqh/'
        /** 调用接口获取数据 */
        let res = await fetch(url).catch((err) => logger.error(err))
    
        /** 判断接口是否请求成功 */
        if (!res) {
          logger.error('[土味情话] 接口请求失败')
          return await this.reply('土味情话接口请求失败')
        }
        
        res = await res.text()
        /** 输入日志 */
        logger.info(`[接口结果] 土味情话：${res}`)
    
        /** 最后回复消息 */
        await this.reply(`${res}`)
    }
    
    async chp (e) {
        /** e.msg 用户的命令消息 */
        logger.info('[用户命令]', e.msg)
        let url = 'https://api.sdgou.cc/api/chp/'
        /** 调用接口获取数据 */
        let res = await fetch(url).catch((err) => logger.error(err))
    
        /** 判断接口是否请求成功 */
        if (!res) {
          logger.error('[彩虹屁] 接口请求失败')
          return await this.reply('彩虹屁接口请求失败')
        }

        res = await res.text()
        /** 输入日志 */
        logger.info(`[接口结果] 彩虹屁：${res}`)
    
        /** 最后回复消息 */
        await this.reply(`${res}`)
    }

    async djt (e) {
        /** e.msg 用户的命令消息 */
        logger.info('[用户命令]', e.msg)
        let url
        let random = Math.ceil(Math.random()*4)
        if(random == 1){
            url = 'https://api.sdgou.cc/api/djt/'
        }
        else if(random == 2){
            url = 'https://xiaobai.klizi.cn/API/other/djt.php'
        }
        else if(random == 3){
            url = 'https://ovooa.com/API/du/api.php'
        }
        else if(random == 4){
            url = 'http://www.xiaoqiandtianyi.tk/api/dujitang.php'
        }
        
        /** 调用接口获取数据 */
        let res = await fetch(url).catch((err) => logger.error(err))
    
        /** 判断接口是否请求成功 */
        if (!res) {
          logger.error('[毒鸡汤] 接口请求失败')
          return await this.reply('毒鸡汤接口请求失败')
        }
        
        res = await res.text()
        /** 输入日志 */
        logger.info(`[接口结果] 毒鸡汤：${res}`)
    
        /** 最后回复消息 */
        await this.reply(`${res}`)
    }
    
    async tgrj (e) {
        /** e.msg 用户的命令消息 */
        logger.info('[用户命令]', e.msg)
        let url
        let random = Math.ceil(Math.random()*2)
        if(random == 1){
            url = 'http://www.xiaoqiandtianyi.tk/api/tiangou.php'
        }
        else if(random == 2){
            url = 'https://api.sdgou.cc/api/tgrj/'
        }
        /** 调用接口获取数据 */
        let res = await fetch(url).catch((err) => logger.error(err))
    
        /** 判断接口是否请求成功 */
        if (!res) {
          logger.error('[舔狗日记] 接口请求失败')
          return await this.reply('舔狗日记接口请求失败')
        }
        
        res = await res.text()
        res = await res.replace("舔狗日记","").trim()
        /** 输入日志 */
        logger.info(`[接口结果] 舔狗日记：${res}`)
    
        /** 最后回复消息 */
        await this.reply(`${res}`)
    }
    
    async lzyl (e) {
        /** e.msg 用户的命令消息 */
        logger.info('[用户命令]', e.msg)
        let url = 'https://xiaobai.klizi.cn/API/other/lzyl.php'
        /** 调用接口获取数据 */
        let res = await fetch(url).catch((err) => logger.error(err))
    
        /** 判断接口是否请求成功 */
        if (!res) {
          logger.error('[励志语录] 接口请求失败')
          return await this.reply('励志语录接口请求失败')
        }
        
        res = await res.json()
        /** 输入日志 */
        logger.info(`[接口结果] 励志语录：${res.data}`)
    
        /** 最后回复消息 */
        await this.reply(`${res.data}`)
    }
    
    async qh (e) {
        /** e.msg 用户的命令消息 */
        logger.info('[用户命令]', e.msg)
        let url
        let random = Math.ceil(Math.random()*3)
        if(random == 1){
            url = 'https://ovooa.com/API/qing/api.php'
        }
        else if(random == 2){
            url = 'https://xiaobai.klizi.cn/API/other/wtqh.php'
        }
        else if(random == 3){
            url = 'http://www.xiaoqiandtianyi.tk/api/qinghua.php'
        }
        /** 调用接口获取数据 */
        let res = await fetch(url).catch((err) => logger.error(err))
    
        /** 判断接口是否请求成功 */
        if (!res) {
          logger.error('[情话] 接口请求失败')
          return await this.reply('情话接口请求失败')
        }
        
        res = await res.text()
        /** 输入日志 */
        logger.info(`[接口结果] 情话：${res}`)
    
        /** 最后回复消息 */
        await this.reply(`${res}`)
    }
    
    async sc (e) {
        /** e.msg 用户的命令消息 */
        logger.info('[用户命令]', e.msg)
        let url = 'https://xiaobai.klizi.cn/API/other/sjsc.php'
        /** 调用接口获取数据 */
        let res = await fetch(url).catch((err) => logger.error(err))
    
        /** 判断接口是否请求成功 */
        if (!res) {
          logger.error('[诗词] 接口请求失败')
          return await this.reply('诗词接口请求失败')
        }
        
        res = await res.text()
        /** 输入日志 */
        logger.info(`[接口结果] 诗词：${res}`)
    
        /** 最后回复消息 */
        await this.reply(`${res}`)
    }
    
    async xh (e) {
        /** e.msg 用户的命令消息 */
        logger.info('[用户命令]', e.msg)
        let url = 'https://xiaobai.klizi.cn/API/other/xh.php'
        /** 调用接口获取数据 */
        let res = await fetch(url).catch((err) => logger.error(err))
    
        /** 判断接口是否请求成功 */
        if (!res) {
          logger.error('[笑话] 接口请求失败')
          return await this.reply('笑话接口请求失败')
        }
        
        res = await res.text()
        /** 输入日志 */
        logger.info(`[接口结果] 笑话：${res}`)
    
        /** 最后回复消息 */
        await this.reply(`${res}`)
    }
    
    async lssdjt (e) {
        /** e.msg 用户的命令消息 */
        logger.info('[用户命令]', e.msg)
        let url = 'https://xiaobai.klizi.cn/API/other/ls.php?data=&id='
        /** 调用接口获取数据 */
        let res = await fetch(url).catch((err) => logger.error(err))
    
        /** 判断接口是否请求成功 */
        if (!res) {
          logger.error('[历史上的今天] 接口请求失败')
          return await this.reply('历史上的今天接口请求失败')
        }
        
        res = await res.text()
        /** 输入日志 */
        logger.info(`[接口结果] 历史上的今天：${res}`)
    
        /** 最后回复消息 */
        await this.reply(`${res}`)
    }
    
    async wyyrp (e) {
        /** e.msg 用户的命令消息 */
        logger.info('[用户命令]', e.msg)
        let url = 'https://api.xingzhige.com/API/NetEase_CloudMusic_hotReview/'
        /** 调用接口获取数据 */
        let res = await fetch(url).catch((err) => logger.error(err))
    
        /** 判断接口是否请求成功 */
        if (!res) {
          logger.error('[网易云热评] 接口请求失败')
          return await this.reply('网易云热评接口请求失败')
        }
        
        res = await res.json()
    
        /** 最后回复消息 */
        await this.reply(`歌曲名称：${res.data.name}\n\n作者：${res.data.artist}\n\n评论者：${res.data.artistsname}\n\n评论：${res.data.content}\n\n点赞数：${res.data.likedCount}\n\n链接：${res.data.url}`)
    }
    
    async ktff (e) {
        /** e.msg 用户的命令消息 */
        logger.info('[用户命令]', e.msg)
        let url
        let random = Math.ceil(Math.random()*6)
        if(random <= 5){
            url = `http://www.xiaoqiandtianyi.tk/api/Ridicule.php?msg=${random}`
        }
        else if(random == 6){
            url = `http://ovoa.cc/api/ktff.php?`
        }
        /** 调用接口获取数据 */
        let res = await fetch(url).catch((err) => logger.error(err))
    
        /** 判断接口是否请求成功 */
        if (!res) {
          logger.error('[口吐芬芳] 接口请求失败')
          return await this.reply('口吐芬芳接口请求失败')
        }
        
        res = await res.text()
        /** 输入日志 */
        logger.info(`[接口结果] 口吐芬芳：${res}`)
    
        /** 最后回复消息 */
        await this.reply(`${res}`)
    }
    
    async awyl (e) {
        /** e.msg 用户的命令消息 */
        logger.info('[用户命令]', e.msg)
        let url
        let random = Math.ceil(Math.random()*3)
        if(random == 1){
            url = 'http://www.xiaoqiandtianyi.tk/api/Comforting.php'
        }
        else if(random == 2){
            url = 'http://ruohuan.xiaoapi.cn/api/Comforting.php'
        }
        /** 调用接口获取数据 */
        let res = await fetch(url).catch((err) => logger.error(err))
    
        /** 判断接口是否请求成功 */
        if (!res) {
          logger.error('[安慰语录] 接口请求失败')
          return await this.reply('安慰语录接口请求失败')
        }
        
        res = await res.text()
        /** 输入日志 */
        logger.info(`[接口结果] 安慰语录：${res}`)
    
        /** 最后回复消息 */
        await this.reply(`${res}`)
    }
    
    async sgyl (e) {
        /** e.msg 用户的命令消息 */
        logger.info('[用户命令]', e.msg)
        let url = 'http://ruohuan.xiaoapi.cn/api/sgyl.php'
        /** 调用接口获取数据 */
        let res = await fetch(url).catch((err) => logger.error(err))
    
        /** 判断接口是否请求成功 */
        if (!res) {
          logger.error('[伤感语录] 接口请求失败')
          return await this.reply('伤感语录接口请求失败')
        }
        
        res = await res.text()
        /** 输入日志 */
        logger.info(`[接口结果] 伤感语录：${res}`)
    
        /** 最后回复消息 */
        await this.reply(`${res}`)
    }
    
    async aqgyyl (e) {
        /** e.msg 用户的命令消息 */
        logger.info('[用户命令]', e.msg)
        let url = 'https://ovooa.com/API/aiqing/api.php'
        /** 调用接口获取数据 */
        let res = await fetch(url).catch((err) => logger.error(err))
    
        /** 判断接口是否请求成功 */
        if (!res) {
          logger.error('[爱情公寓语录] 接口请求失败')
          return await this.reply('爱情公寓语录接口请求失败')
        }
        
        res = await res.text()
        /** 输入日志 */
        logger.info(`[接口结果] 爱情公寓语录：${res}`)
    
        /** 最后回复消息 */
        await this.reply(`${res}`)
    }
    
    async dmyy (e) {
        /** e.msg 用户的命令消息 */
        logger.info('[用户命令]', e.msg)
        let url = 'https://ovooa.com/API/dmyiyan/api.php'
        /** 调用接口获取数据 */
        let res = await fetch(url).catch((err) => logger.error(err))
    
        /** 判断接口是否请求成功 */
        if (!res) {
          logger.error('[动漫一言] 接口请求失败')
          return await this.reply('动漫一言接口请求失败')
        }
        
        res = await res.text()
        /** 输入日志 */
        logger.info(`[接口结果] 动漫一言：${res}`)
    
        /** 最后回复消息 */
        await this.reply(`${res}`)
    }
    
    async rkl (e) {
        /** e.msg 用户的命令消息 */
        logger.info('[用户命令]', e.msg)
        let url = 'https://ovooa.com/API/rao/api.php'
        /** 调用接口获取数据 */
        let res = await fetch(url).catch((err) => logger.error(err))
    
        /** 判断接口是否请求成功 */
        if (!res) {
          logger.error('[绕口令] 接口请求失败')
          return await this.reply('绕口令请求失败')
        }
        res = await res.json()
        /** 最后回复消息 */
        await this.reply(`${res.data.title.replace("(绕口令)","").trim()}\n\n${res.data.Msg}`)
    }
    
    async wryl (e) {
        /** e.msg 用户的命令消息 */
        logger.info('[用户命令]', e.msg)
        let url
        let random = Math.ceil(Math.random()*2)
        if(random == 1){
            url = 'http://www.xiaoqiandtianyi.tk/api/wenrou.php'
        }
        else if(random == 2){
            url = 'https://ovooa.com/API/wryl/api.php'
        }
        /** 调用接口获取数据 */
        let res = await fetch(url).catch((err) => logger.error(err))
    
        /** 判断接口是否请求成功 */
        if (!res) {
          logger.error('[温柔语录] 接口请求失败')
          return await this.reply('温柔语录接口请求失败')
        }
        
        res = await res.text()
        /** 输入日志 */
        logger.info(`[接口结果] 温柔语录：${res}`)
    
        /** 最后回复消息 */
        await this.reply(`${res}`)
    }
    
    async xljt (e) {
        /** e.msg 用户的命令消息 */
        logger.info('[用户命令]', e.msg)
        let url = 'https://xiaobapi.top/api/xb/api/xljt.php'
        /** 调用接口获取数据 */
        let res = await fetch(url).catch((err) => logger.error(err))
    
        /** 判断接口是否请求成功 */
        if (!res) {
          logger.error('[心灵鸡汤] 接口请求失败')
          return await this.reply('心灵鸡汤接口请求失败')
        }
        
        res = await res.text()
        /** 输入日志 */
        logger.info(`[接口结果] 心灵鸡汤：${res}`)
    
        /** 最后回复消息 */
        await this.reply(`${res}`)
    }
    
    async xnzf (e) {
        /** e.msg 用户的命令消息 */
        logger.info('[用户命令]', e.msg)
        let url = 'https://xiaobapi.top/api/xb/api/zfy.php'
        /** 调用接口获取数据 */
        let res = await fetch(url).catch((err) => logger.error(err))
    
        /** 判断接口是否请求成功 */
        if (!res) {
          logger.error('[新年祝福] 接口请求失败')
          return await this.reply('新年祝福接口请求失败')
        }
        
        res = await res.text()
        /** 输入日志 */
        logger.info(`[接口结果] 新年祝福：${res}`)
    
        /** 最后回复消息 */
        await this.reply(`${res}`)
    }
    
    async rjyl (e) {
        /** e.msg 用户的命令消息 */
        logger.info('[用户命令]', e.msg)
        let url = 'https://xiaobapi.top/api/xb/api/renjian.php'
        /** 调用接口获取数据 */
        let res = await fetch(url).catch((err) => logger.error(err))
    
        /** 判断接口是否请求成功 */
        if (!res) {
          logger.error('[人间语录] 接口请求失败')
          return await this.reply('人间语录接口请求失败')
        }
        
        res = await res.text()
        /** 输入日志 */
        logger.info(`[接口结果] 人间语录：${res}`)
    
        /** 最后回复消息 */
        await this.reply(`${res}`)
    }
    
    async sh (e) {
        /** e.msg 用户的命令消息 */
        logger.info('[用户命令]', e.msg)
        let url
        let random = Math.ceil(Math.random()*2)
        if(random == 1){
            url = 'http://www.xiaoqiandtianyi.tk/api/saohua.php'
        }
        else if(random == 2){
            url = 'http://www.xiaoqiandtianyi.tk/api/text_wu.php'
        }
        /** 调用接口获取数据 */
        let res = await fetch(url).catch((err) => logger.error(err))
    
        /** 判断接口是否请求成功 */
        if (!res) {
          logger.error('[骚话] 接口请求失败')
          return await this.reply('骚话接口请求失败')
        }
        
        res = await res.text()
        /** 输入日志 */
        logger.info(`[接口结果] 骚话：${res}`)
    
        /** 最后回复消息 */
        await this.reply(`${res}`)
    }
    
    async bdzcyl (e) {
        /** e.msg 用户的命令消息 */
        logger.info('[用户命令]', e.msg)
        let url = 'http://bg.suol.cc/API/bdzcyl/'
        /** 调用接口获取数据 */
        let res = await fetch(url).catch((err) => logger.error(err))
    
        /** 判断接口是否请求成功 */
        if (!res) {
          logger.error('[霸道总裁语录] 接口请求失败')
          return await this.reply('霸道总裁语录接口请求失败')
        }
        
        res = await res.text()
        /** 输入日志 */
        logger.info(`[接口结果] 霸道总裁语录：${res}`)
    
        /** 最后回复消息 */
        await this.reply(`${res}`)
    }
    
    async shyl (e) {
        /** e.msg 用户的命令消息 */
        logger.info('[用户命令]', e.msg)
        let url = 'http://bg.suol.cc/API/bdzcyl/'
        /** 调用接口获取数据 */
        let res = await fetch(url).catch((err) => logger.error(err))
    
        /** 判断接口是否请求成功 */
        if (!res) {
          logger.error('[社会语录] 接口请求失败')
          return await this.reply('社会语录接口请求失败')
        }
        
        res = await res.text()
        /** 输入日志 */
        logger.info(`[接口结果] 社会语录：${res}`)
    
        /** 最后回复消息 */
        await this.reply(`${res}`)
    }
    
    
    
    
    
    
    
    
    
    
    
}
