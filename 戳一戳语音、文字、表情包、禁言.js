// by 癫癫博士
// 实现戳一戳交互功能，支持返回文字图片语音禁言，其中语音需配置ffmpeg
// 构成部分分为普通事件（文字）与特殊事件（图片以及语音以及禁言事件）
// 每一份文字占一份随机概率，每个事件占一份概率
import plugin from'../../lib/plugins/plugin.js'
import{segment}from'oicq'
import cfg from'../../lib/config/config.js'
import common from'../../lib/common/common.js'
const _path=process.cwd()

//定义图片存放路径
const chuo_path=_path+'/resources/chuochuo/';

//回复文字列表
let word_list=['你戳谁呢！你戳谁呢！！！',
'不要再戳了！我真的要被你气死了！！！',
'怎么会有你这么无聊的人啊！！！',
'是不是要荧酱揍你一顿才开心啊！！！',
'不要再戳了！！！',
'讨厌死了！',
'小朋友别戳了']

//回复语音列表 默认是芭芭拉的语音 可以复制到网址里面去改，然后再复制回来 
//语音合成来源：https://github.com/w4123/vits
//接口格式参考：http://233366.proxy.nscc-gz.cn:8888/?text=你好&speaker=派蒙

//原列表语音：
//你戳谁呢！你戳谁呢！！！
//不要再戳了！我真的要被你气死了！！！
//怎么会有你这么无聊的人啊！！！
//是不是要柚恩揍你一顿才开心啊！！！
//不要再戳了！！！
//讨厌死了！
//小朋友别戳了
let url_list = [`http://233366.proxy.nscc-gz.cn:8888/?text=%E4%BD%A0%E6%88%B3%E8%B0%81%E5%91%A2%EF%BC%81%E4%BD%A0%E6%88%B3%E8%B0%81%E5%91%A2%EF%BC%81%EF%BC%81%EF%BC%81&speaker=%E8%8A%AD%E8%8A%AD%E6%8B%89`,
`http://233366.proxy.nscc-gz.cn:8888/?text=%E4%B8%8D%E8%A6%81%E5%86%8D%E6%88%B3%E4%BA%86%EF%BC%81%E6%88%91%E7%9C%9F%E7%9A%84%E8%A6%81%E8%A2%AB%E4%BD%A0%E6%B0%94%E6%AD%BB%E4%BA%86%EF%BC%81%EF%BC%81%EF%BC%81&speaker=%E8%8A%AD%E8%8A%AD%E6%8B%89`,
`http://233366.proxy.nscc-gz.cn:8888/?text=%E6%80%8E%E4%B9%88%E4%BC%9A%E6%9C%89%E4%BD%A0%E8%BF%99%E4%B9%88%E6%97%A0%E8%81%8A%E7%9A%84%E4%BA%BA%E5%95%8A%EF%BC%81%EF%BC%81%EF%BC%81&speaker=%E8%8A%AD%E8%8A%AD%E6%8B%89`,
`http://233366.proxy.nscc-gz.cn:8888/?text=%E6%98%AF%E4%B8%8D%E6%98%AF%E8%A6%81%E6%9F%9A%E6%81%A9%E6%8F%8D%E4%BD%A0%E4%B8%80%E9%A1%BF%E6%89%8D%E5%BC%80%E5%BF%83%E5%95%8A%EF%BC%81%EF%BC%81%EF%BC%81&speaker=%E8%8A%AD%E8%8A%AD%E6%8B%89&length=1`,
`http://233366.proxy.nscc-gz.cn:8888/?text=%E4%B8%8D%E8%A6%81%E5%86%8D%E6%88%B3%E4%BA%86%EF%BC%81%EF%BC%81%EF%BC%81&speaker=%E8%8A%AD%E8%8A%AD%E6%8B%89`,
`http://233366.proxy.nscc-gz.cn:8888/?text=%E8%AE%A8%E5%8E%8C%E6%AD%BB%E4%BA%86%EF%BC%81&speaker=%E8%8A%AD%E8%8A%AD%E6%8B%89`,
`http://233366.proxy.nscc-gz.cn:8888/?text=%E5%B0%8F%E6%9C%8B%E5%8F%8B%E5%88%AB%E6%88%B3%E4%BA%86&speaker=%E8%8A%AD%E8%8A%AD%E6%8B%89`]

export class chuo extends plugin{
    constructor(){
    super({
        name: '戳一戳',
        dsc: '戳一戳机器人触发效果',
        event: 'notice.group.poke',
        priority: 5000,
        rule: [
            {
                /** 命令正则匹配 */
                reg: '.*',
                fnc: 'chuoyichuo'
                }
            ]
        }
    )
}

async chuoyichuo (e){
    logger.info('[戳一戳生效]')
    if(e.target_id == cfg.qq){
        
        //文字列表长度加上6个特殊事件，如修改elif数量记得修改此数字
        let standard = word_list['length'] + 6
        
        //生成1~standard的随机值
        let random = Math.ceil(Math.random()*standard)
        
        //开始随机事件
        if(random == standard){
            //生成随机图片路径 注意最后的7要改成自己的图片数量
            //注意：你的表情包命名需要按数字增加，如：1.jpg 2.jpg 3.jpg 
            let photo_number = Math.ceil(Math.random() * 7)
            e.reply(segment.image('file:///' + _path + '/resources/chuochuo/'+ photo_number + '.jpg'))
        }
        
        //禁言1分钟，需要给机器人管理员才能生效
        else if (random == standard - 1){
            e.reply('说了不要戳了！')
            await common.sleep(1000)
            await e.group.muteMember(e.operator_id,600);
            await common.sleep(3000)
            e.reply('啧')
        }
        
        //戳回去
        else if(random==standard-2){
            e.reply('反击！')
            await common.sleep(1000)
            await e.group.pokeMember(e.operator_id)
        }
        
        //禁言1分钟，需要给机器人管理员才能生效
        else if(random===standard-3){
            e.reply('不！！')
            await common.sleep(500);
            e.reply('准！！')
            await common.sleep(500);
            e.reply('戳！！')
            await common.sleep(1000);
            await e.group.muteMember(e.operator_id,600)
        }
        
        //生成特定表情包并返回
        else if(random===standard-4){
            e.reply(segment.image(`http://ovooa.com/API/face_pat/?QQ=${e.operator_id}`))
        }
        
        //回复随机语音
        else if(random===standard-5){
            let url_number=Math.ceil(Math.random()*url_list['length']);
            let url = url_list[url_number-1]
            console.log(url)
            await e.reply(segment.record(url))
        }
        
        //回复随机文本
        else{
            e.reply(word_list[random-1])}
        return true
        
    }
    
}
    
}
