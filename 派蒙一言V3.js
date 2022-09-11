import plugin from '../../lib/plugins/plugin.js'
import fetch from 'node-fetch'
import { segment } from "oicq";

export class example extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: '派蒙一言 （by癫癫博士）',
      /** 功能描述 */
      dsc: '让指定角色随机发一句语音，使用原神语音合成接口与一言接口',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 5000,
      rule: [
                {
                    reg: `^(派蒙|凯亚|安柏|丽莎|琴|香菱|枫原万叶|迪卢克|温迪|可莉|早柚|托马|芭芭拉|优菈|云堇|钟离|魈|凝光|雷电将军|北斗|甘雨|七七|刻晴|神里绫华|雷泽|神里绫人|罗莎莉亚|阿贝多|八重神子|宵宫|荒泷一斗|九条裟罗|夜兰|珊瑚宫心海|五郎|达达利亚|莫娜|班尼特|申鹤|行秋|烟绯|久岐忍|辛焱|砂糖|胡桃|重云|菲谢尔|诺艾尔|迪奥娜|鹿野院平藏)一言`,
                    fnc: 'pmyy'
                },
                {
                    reg: `^(派蒙|凯亚|安柏|丽莎|琴|香菱|枫原万叶|迪卢克|温迪|可莉|早柚|托马|芭芭拉|优菈|云堇|钟离|魈|凝光|雷电将军|北斗|甘雨|七七|刻晴|神里绫华|雷泽|神里绫人|罗莎莉亚|阿贝多|八重神子|宵宫|荒泷一斗|九条裟罗|夜兰|珊瑚宫心海|五郎|达达利亚|莫娜|班尼特|申鹤|行秋|烟绯|久岐忍|辛焱|砂糖|胡桃|重云|菲谢尔|诺艾尔|迪奥娜|鹿野院平藏)绕口令`,
                    fnc: 'pmrkl'
                },
                {
                    reg: `^(派蒙|凯亚|安柏|丽莎|琴|香菱|枫原万叶|迪卢克|温迪|可莉|早柚|托马|芭芭拉|优菈|云堇|钟离|魈|凝光|雷电将军|北斗|甘雨|七七|刻晴|神里绫华|雷泽|神里绫人|罗莎莉亚|阿贝多|八重神子|宵宫|荒泷一斗|九条裟罗|夜兰|珊瑚宫心海|五郎|达达利亚|莫娜|班尼特|申鹤|行秋|烟绯|久岐忍|辛焱|砂糖|胡桃|重云|菲谢尔|诺艾尔|迪奥娜|鹿野院平藏)毒鸡汤`,
                    fnc: 'pmdjt'
                },
      ]
    })
  }

  /**
   * #一言
   * @param e oicq传递的事件参数e
   */
  async pmyy (e) {
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
    logger.info(`[接口结果] 派蒙一言：${res.hitokoto}`)
    let role = e.msg.replace("一言","");
    let url2 = `http://233366.proxy.nscc-gz.cn:8888/?text=${encodeURI(res.hitokoto)}&speaker=${encodeURI(role)}`;
    console.log(url2);
    await e.reply(segment.record(url2));
    await this.reply(`${res.hitokoto}`)
    return true;
    /** 最后回复消息 */
  }
  
  async pmrkl (e) {
    /** e.msg 用户的命令消息 */
    logger.info('[用户命令]', e.msg)

    /** 一言接口地址 */
    let url = 'https://ovooa.com/API/rao/api.php'
    /** 调用接口获取数据 */
    let res = await fetch(url).catch((err) => logger.error(err))

    /** 判断接口是否请求成功 */
    if (!res) {
      logger.error('[绕口令] 接口请求失败')
      return await this.reply('绕口令接口请求失败')
    }

    /** 接口结果，json字符串转对象 */
    res = await res.json()
    /** 输入日志 */
    logger.info(`[接口结果] 派蒙绕口令：${res.data.Msg}`)
    let role = e.msg.replace("绕口令","");
    let url2 = `http://233366.proxy.nscc-gz.cn:8888/?text=${encodeURI(res.data.Msg)}&speaker=${encodeURI(role)}`;
    console.log(url2);
    await e.reply(segment.record(url2));
    await this.reply(`${res.data.Msg}`)
    return true;
    /** 最后回复消息 */
  }
  
  async pmdjt (e) {
    /** e.msg 用户的命令消息 */
    logger.info('[用户命令]', e.msg)

    /** 一言接口地址 */
    let url = 'https://ovooa.com/API/du/api.php?type=json'
    /** 调用接口获取数据 */
    let res = await fetch(url).catch((err) => logger.error(err))

    /** 判断接口是否请求成功 */
    if (!res) {
      logger.error('[毒鸡汤] 接口请求失败')
      return await this.reply('毒鸡汤接口请求失败')
    }

    /** 接口结果，json字符串转对象 */
    res = await res.json()
    /** 输入日志 */
    logger.info(`[接口结果] 派蒙毒鸡汤：${res.text}`)
    let role = e.msg.replace("毒鸡汤","");
    let url2 = `http://233366.proxy.nscc-gz.cn:8888/?text=${encodeURI(res.text)}&speaker=${encodeURI(role)}`;
    console.log(url2);
    await e.reply(segment.record(url2));
    await this.reply(`${res.text}`)
    return true;
    /** 最后回复消息 */
  }
}
