
//此版本增加了一些分类命令
//新增加了群聊和私聊的R18开关命令，主人有权限开启或关闭R18，例如：群聊里发送“开启R18”是开启群聊的R18，私聊里发送“关闭R18”是关闭私聊的R18
//新增设定撤回时间的指令
//应群友要求，新增了涩图连发功能，可设置连发数量和连发间隔，可开启无限连发，具体看下方说明，注意连发功能无法中途关闭，若为无限连发，建议重启！！！
//新增群黑名单
//优化了连发功能，除无限连发以外，其他人也可连发，无限连发只有主人可用
//若有命令出现问题，完全无法发送图片，可联系我QQ:1025452683 Q群：715691258

import { segment } from "oicq";
import fetch from "node-fetch";

const _path = process.cwd();
let timeout = 5000; //这里是撤回时间，单位毫秒，1000=1秒,0则为不撤回
let CD = {};// 命令CD
let isR18 = false;//群聊R18默认值
let isR18s = true;//私聊R18默认值
let interval = 10000;//连发模式的间隔时间，默认为10秒，由于图片质量不同导致发送时间不同，实际间隔可能有误差
let num = 3; //默认连发数量为3

//这是群黑名单，在这输入想禁用涩图的群号，逗号隔开，唯有搜索和涩图功能会被禁用
const blacklist = [
  //例如123456,456789
];
export class sese extends plugin {
  constructor() {
    super({
      /** 功能名称 */
      name: 'sese',
      /** 功能描述 */
      dsc: '简单开发示例',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 59,
      rule: [
        {
          /** 命令正则匹配 */
          reg: "^#*(acg|二次元|动漫图片|动漫壁纸)$", //这样是可以不用带#，把*删掉就变成必须带#才能触发.
          /** 执行方法 */
          fnc: 'acg'
        },
        {
          /** 命令正则匹配 */
          reg: "^#*搜索(.*)$", //这样是可以不用带#，把*删掉就变成必须带#才能触发.
          /** 执行方法 */
          fnc: 'acgs'
        },
        {
          /** 命令正则匹配 */
          reg: "^#*(涩图|涩涩|色图|acg18|r18|R18)$",
          /** 执行方法 */
          fnc: 'acg18'
        },
        {
          /** 命令正则匹配 */
          reg: "^(风景|风景壁纸|壁纸)$",
          /** 执行方法 */
          fnc: 'wallpaper'
        },
        {
          /** 命令正则匹配 */
          reg: "^(萝莉|少女)$",
          /** 执行方法 */
          fnc: 'lolita'
        },
        {
          /** 命令正则匹配 */
          reg: "^银发$",
          /** 执行方法 */
          fnc: 'sliverhair'
        },
        {
          /** 命令正则匹配 */
          reg: "^兽耳$",
          /** 执行方法 */
          fnc: 'kemomimi'
        },
        {
          /** 命令正则匹配 */
          reg: "^星空$",
          /** 执行方法 */
          fnc: 'xingkong'
        },
        {
          /** 命令正则匹配 */
          reg: "^横屏壁纸$",
          /** 执行方法 */
          fnc: 'wallpaperLandscape'
        },
        {
          /** 命令正则匹配 */
          reg: "^竖屏壁纸$",
          /** 执行方法 */
          fnc: 'wallpaperVerticalScreen'
        },
        {
          /** 命令正则匹配 */
          reg: "^(cos|来份cos)$",
          /** 执行方法 */
          fnc: 'coss'
        },
        {
          /** 命令正则匹配 */
          reg: "^(开启|关闭)+(R18|r18)$",
          /** 执行方法 */
          fnc: 'R18Switch'
        },
        {
          /** 命令正则匹配 */
          reg: "^(设定|设置)+撤回(.*)$",
          /** 执行方法 */
          fnc: 'chehui'
        },
        {
          /** 命令正则匹配 */
          reg: "^(设定|设置)+连发间隔(.*)$",
          /** 执行方法 */
          fnc: 'setInterval'
        },
        {
          /** 命令正则匹配 */
          reg: "^(设定|设置)+连发数量(.*)$",
          /** 执行方法 */
          fnc: 'setNum'
        },
        {
          /** 命令正则匹配 */
          reg: "^(开启|关闭)+连发(.*)$",
          /** 执行方法 */
          fnc: 'intervalAcg'
        },
      ]
    })
    this._path = process.cwd()
  }

  async acg(e) {
    //执行的逻辑功能
    //let url = `http://api.wpbom.com/api/secon.php`;
    //let url = `https://iw233.cn/api.php?sort=iw233`;
    let url = `https://dev.iw233.cn/api.php?sort=iw233`;
    let msg = [
      segment.image(url),
    ];
    //发送消息
    e.reply(msg);

    return true; //返回true 阻挡消息不再往下
  }

  async acgs(e) {
    if (e.isGroup) { //群聊
      for (let i = 0; i < blacklist.length; i++) {
        if (e.group.group_id == blacklist[i]) {
          e.reply("本群不可以色色！");
          return true;
        }
      }
      if (CD[e.user_id] && !e.isMaster) {
        e.reply("每10秒只能冲一次哦！");//更改完冷却时间记得更改这里的时间.
        return true;
      }
      CD[e.user_id] = true;
      CD[e.user_id] = setTimeout(() => {
        if (CD[e.user_id]) {
          delete CD[e.user_id];
        }
      }, 10000);//这里是冷却时间，单位毫秒.
      e.reply(`正在搜图...`);
      let keyword = e.msg.replace("#", "");
      keyword = keyword.replace("搜索", "");
      let url = '';
      if (!isR18) {
        url = `https://api.lolicon.app/setu/v2?tag=${keyword}&proxy=i.pixiv.re&r18=0`;//setu接口地址，把这里的18=0改成18=1可以发送r18图片，18=2则为混合图片.
      } else {
        url = `https://api.lolicon.app/setu/v2?tag=${keyword}&proxy=i.pixiv.re&r18=1`;
      }
      const response = await fetch(url); //调用接口获取数据
      let res = await response.json(); //结果json字符串转对象
      let imgurl = res.data[0].urls.original;
      if (res.data.length == 0) {
        e.reply("暂时没有搜到哦！换个关键词试试吧！");
        return true;
      }
      let TagNumber = res.data[0].tags.length;
      let Atags;
      let Btags;
      let qwq = 0;
      while (TagNumber--) {
        Atags = res.data[0].tags[TagNumber];
        if (qwq == 0) {
          Btags = "";
        }
        Btags = Btags + " " + Atags;
        qwq++;
      }
      let msg;
      let pid = res.data[0].pid;
      //最后回复消息
      msg = [
        "标题：",
        res.data[0].title,
        "\n作者：",
        res.data[0].author,
        "\n关键词：",
        Btags,
        segment.image(res.data[0].urls.original),
      ];
      //发送消息
      let msgRes = await e.reply(msg);
      if (timeout != 0 && msgRes && msgRes.message_id) {
        let target = e.group;
        setTimeout(() => {
          target.recallMsg(msgRes.message_id);
        }, timeout);
      }
      return true; //返回true 阻挡消息不再往下
    } else {  //私聊
      if (CD[e.user_id] && !e.isMaster) {
        e.reply("每1分钟只能冲一次哦！");//更改完冷却时间记得更改这里的时间.
        return true;
      }
      CD[e.user_id] = true;
      CD[e.user_id] = setTimeout(() => {
        if (CD[e.user_id]) {
          delete CD[e.user_id];
        }
      }, 60000);//这里是冷却时间，单位毫秒.
      e.reply(`正在搜图...`);
      let keyword = e.msg.replace("#", "");
      keyword = keyword.replace("搜索", "");
      let url = '';
      if (!isR18s) {
        url = `https://api.lolicon.app/setu/v2?tag=${keyword}&proxy=i.pixiv.re&r18=0`;//setu接口地址，把这里的18=0改成18=1可以发送r18图片，18=2则为混合图片.
      } else {
        url = `https://api.lolicon.app/setu/v2?tag=${keyword}&proxy=i.pixiv.re&r18=1`;
      }
      const response = await fetch(url); //调用接口获取数据
      let res = await response.json(); //结果json字符串转对象
      let imgurl = res.data[0].urls.original;
      if (res.data.length == 0) {
        e.reply("暂时没有搜到哦！换个关键词试试吧！");
        return true;
      }
      let TagNumber = res.data[0].tags.length;
      let Atags;
      let Btags;
      let qwq = 0;
      while (TagNumber--) {
        Atags = res.data[0].tags[TagNumber];
        if (qwq == 0) {
          Btags = "";
        }
        Btags = Btags + " " + Atags;
        qwq++;
      }
      let msg;
      let pid = res.data[0].pid;
      //最后回复消息
      msg = [
        "标题：",
        res.data[0].title,
        "\n作者：",
        res.data[0].author,
        "\n关键词：",
        Btags,
        segment.image(res.data[0].urls.original),
      ];
      //发送消息
      e.reply(msg);
      return true; //返回true 阻挡消息不再往下
    }
  }

  async acg18(e) {
    if (e.isGroup) { //群聊
      for (let i = 0; i < blacklist.length; i++) {
        if (e.group.group_id == blacklist[i]) {
          e.reply("本群不可以色色！");
          return true;
        }
      }
      if (CD[e.user_id] && !e.isMaster) {
        e.reply("每10秒只能冲一次哦！");//更改完冷却时间记得更改这里的时间.
        return true;
      }
      CD[e.user_id] = true;
      CD[e.user_id] = setTimeout(() => {
        if (CD[e.user_id]) {
          delete CD[e.user_id];
        }
      }, 10000);//这里是冷却时间，单位毫秒.
      //执行的逻辑功能
      let url;
      let msg;
      if (!isR18) {
        //url = `http://iw233.fgimax2.fgnwctvip.com/API/Ghs.php`;
        //msg = [
        //segment.image(url),
        //];

        url = `https://api.lolicon.app/setu/v2?proxy=i.pixiv.re&r18=0`;
        const response = await fetch(url); //调用接口获取数据
        let res = await response.json(); //结果json字符串转对象
        msg = [
          segment.image(res.data[0].urls.original),
        ];
      } else {
        e.reply(`正在搜图...`);
        url = `https://api.lolicon.app/setu/v2?proxy=i.pixiv.re&r18=1`;
        const response = await fetch(url); //调用接口获取数据
        let res = await response.json(); //结果json字符串转对象
        msg = [
          segment.image(res.data[0].urls.original),
        ];
      }
      //发送消息
      let msgRes = await e.reply(msg);
      if (timeout != 0 && msgRes && msgRes.message_id) {
        let target = e.group;
        setTimeout(() => {
          target.recallMsg(msgRes.message_id);
        }, timeout);
      }
      return true; //返回true 阻挡消息不再往下
    } else {  //私聊
      if (CD[e.user_id] && !e.isMaster) {
        e.reply("每1分钟只能冲一次哦！");//更改完冷却时间记得更改这里的时间.
        return true;
      }
      CD[e.user_id] = true;
      CD[e.user_id] = setTimeout(() => {
        if (CD[e.user_id]) {
          delete CD[e.user_id];
        }
      }, 60000);//这里是冷却时间，单位毫秒.
      e.reply(`正在搜图...`);
      let url = '';
      if (!isR18s) {
        url = `https://api.lolicon.app/setu/v2?proxy=i.pixiv.re&r18=0`;//setu接口地址，把这里的18=0改成18=1可以发送r18图片，18=2则为混合图片.
      } else {
        url = `https://api.lolicon.app/setu/v2?proxy=i.pixiv.re&r18=1`;
      }
      const response = await fetch(url); //调用接口获取数据
      let res = await response.json(); //结果json字符串转对象
      let TagNumber = res.data[0].tags.length;
      let Atags;
      let Btags;
      let qwq = 0;
      while (TagNumber--) {
        Atags = res.data[0].tags[TagNumber];
        if (qwq == 0) {
          Btags = "";
        }
        Btags = Btags + " " + Atags;
        qwq++;
      }
      let msg;
      let pid = res.data[0].pid;
      //最后回复消息
      msg = [
        "标题：",
        res.data[0].title,
        "\n作者：",
        res.data[0].author,
        "\n关键词：",
        Btags,
        segment.image(res.data[0].urls.original),
      ];
      //发送消息
      e.reply(msg)
      return true; //返回true 阻挡消息不再往下
    }
  }

  async lolita(e) {
    //执行的逻辑功能
    //let url = `https://api.vvhan.com/api/acgimg`;
    //let url = `https://iw233.cn/api.php?sort=top`;
    let url = `https://dev.iw233.cn/api.php?sort=top`;
    let msg = [
      segment.image(url),
    ];
    //发送消息
    e.reply(msg);

    return true; //返回true 阻挡消息不再往下
  }

  async sliverhair(e) {
    //执行的逻辑功能
    //let url = `https://iw233.cn/api.php?sort=yin`;
    let url = `https://dev.iw233.cn/api.php?sort=yin`;
    let msg = [
      segment.image(url),
    ];
    //发送消息
    e.reply(msg);

    return true; //返回true 阻挡消息不再往下
  }

  async kemomimi(e) {
    //执行的逻辑功能
    //let url = `https://iw233.cn/api.php?sort=cat`;
    let url = `https://dev.iw233.cn/api.php?sort=cat`;
    let msg = [
      segment.image(url),
    ];
    //发送消息
    e.reply(msg);

    return true; //返回true 阻挡消息不再往下
  }

  async xingkong(e) {
    //执行的逻辑功能
    //let url = `https://iw233.cn/api.php?sort=xing`;
    let url = `https://dev.iw233.cn/api.php?sort=xing`;
    let msg = [
      segment.image(url),
    ];
    //发送消息
    e.reply(msg);

    return true; //返回true 阻挡消息不再往下
  }

  async wallpaper(e) {
    //执行的逻辑功能
    let url = `https://api.vvhan.com/api/view`;
    let msg = [
      segment.image(url),
    ];
    //发送消息
    e.reply(msg);

    return true; //返回true 阻挡消息不再往下
  }

  async wallpaperLandscape(e) {
    //执行的逻辑功能
    //let url = `https://iw233.cn/api.php?sort=pc`;
    let url = `https://dev.iw233.cn/api.php?sort=pc`;
    let msg = [
      segment.image(url),
    ];
    //发送消息
    e.reply(msg);

    return true; //返回true 阻挡消息不再往下
  }

  async wallpaperVerticalScreen(e) {
    //执行的逻辑功能
    //let url = `https://iw233.cn/api.php?sort=mp`;
    let url = `https://dev.iw233.cn/api.php?sort=mp`;
    let msg = [
      segment.image(url),
    ];
    //发送消息
    e.reply(msg);

    return true; //返回true 阻挡消息不再往下
  }


  async coss(e) {
    //执行的逻辑功能
    //let url = `https://api.iyk0.com/cos`; //该接口已经停止维护
    let url = `https://api.vvhan.com/api/mobil.girl`;
    let msg = [
      segment.image(url),
    ];
    //发送消息
    e.reply(msg);

    return true; //返回true 阻挡消息不再往下
  }

  async R18Switch(e) {
    let onoff;
    if (e.msg.indexOf("R18") > -1) {
      onoff = e.msg.replace("R18", "");
    }
    else if (e.msg.indexOf("r18") > -1) {
      onoff = e.msg.replace("r18", "");
    }
    if (e.isGroup) {
      if (onoff == '开启' && e.isMaster) {
        e.reply(`群聊R18已开启`);
        isR18 = true
      } else if (onoff == '关闭' && e.isMaster) {
        e.reply(`群聊R18已关闭`);
        isR18 = false
      } else if (!e.isMaster) {
        e.reply(`只有主人可以命令本机器人哦~`);
      }
    } else {
      if (onoff == '开启' && e.isMaster) {
        e.reply(`私聊R18已开启`);
        isR18s = true
      } else if (onoff == '关闭' && e.isMaster) {
        e.reply(`私聊R18已关闭`);
        isR18s = false
      } else if (!e.isMaster) {
        e.reply(`只有主人可以命令本机器人哦~`);
      }
    }
  }

  async chehui(e) {
    let onoff;
    if (e.msg.indexOf("设定") > -1) {
      onoff = e.msg.replace("设定撤回", "");
    }
    else if (e.msg.indexOf("设置") > -1) {
      onoff = e.msg.replace("设置撤回", "");
    }
    if (e.msg.indexOf("时间") > -1) {
      onoff = e.msg.replace("时间", "");
    }
    if (onoff == '关闭' && e.isMaster) {
      e.reply(`自动撤回已关闭`);
      timeout = 0;
    } else if (e.isMaster) {
      onoff = parseInt(Math.abs(onoff))
      onoff = Math.trunc(onoff)
      if (typeof onoff === 'number') {
        timeout = onoff * 1000;
        e.reply(`自动撤回已设定为` + onoff + `秒`);
      } else {
        e.reply(`输入的指令有误`);
      }
    } else if (!e.isMaster) {
      e.reply(`只有主人可以命令本机器人哦~`);
    }
  }

  async setInterval(e) {
    let onoff;
    if (e.msg.indexOf("设定") > -1) {
      onoff = e.msg.replace("设定连发间隔", "");
    }
    else if (e.msg.indexOf("设置") > -1) {
      onoff = e.msg.replace("设置连发间隔", "");
    }
    if (onoff == '关闭' && e.isMaster) {
      e.reply(`连发间隔已归零`);
      interval = 0;
    } else if (e.isMaster) {
      onoff = parseInt(Math.abs(onoff))
      onoff = Math.trunc(onoff)
      if (typeof onoff === 'number') {
        interval = onoff * 1000;
        e.reply(`连发间隔已设定为` + onoff + `秒`);
      } else {
        e.reply(`输入的指令有误`);
      }
    } else if (!e.isMaster) {
      e.reply(`只有主人可以命令本机器人哦~`);
    }
  }

  async setNum(e) {
    let onoff;
    if (e.msg.indexOf("设定") > -1) {
      onoff = e.msg.replace("设定连发数量", "");
    }
    else if (e.msg.indexOf("设置") > -1) {
      onoff = e.msg.replace("设置连发数量", "");
    }
    if (onoff == '无限' && e.isMaster) {
      e.reply(`连发数量已设定为无限`);
      num = Infinity;
    } else if (e.isMaster) {
      onoff = parseInt(Math.abs(onoff))
      onoff = Math.trunc(onoff)
      if (typeof onoff === 'number') {
        if (onoff <= 10) {
          num = onoff;
          e.reply(`连发数量已设定为` + onoff);
        } else {
          num = 10;
          e.reply(`连发数量最大为10，已设定为10`);
        }
      } else {
        e.reply(`输入的指令有误`);
      }
    } else if (!e.isMaster) {
      e.reply(`只有主人可以命令本机器人哦~`);
    }
  }

  async intervalAcg(e) {
    let onoff;
    let url;
    let msg;
    function timer(n) {
      let i = 0;
      time();
      function time() {
        if (i < n) {
          e.reply(msg);
          i++;
          setTimeout(time, interval);
        } else {
          return true;
        }
      }
    }
    onoff = e.msg.replace("连发", "");
    if (e.isGroup) {
      if ((onoff == '开启' && e.isMaster && num == Infinity) || (onoff == '开启' && num !== Infinity)) {
        if (!isR18) {
          url = `http://iw233.fgimax2.fgnwctvip.com/API/Ghs.php`;
          msg = [
            segment.image(url),
          ];
        } else {
          url = `https://api.lolicon.app/setu/v2?proxy=i.pixiv.re&r18=1`;
          const response = await fetch(url); //调用接口获取数据
          let res = await response.json(); //结果json字符串转对象
          //最后回复消息
          msg = [
            segment.image(res.data[0].urls.original),
          ];
        }
        if (num == 0) {
          e.reply(`请先设置连发数量`);
          return true;
        } else if (num == Infinity) {
          e.reply(`连发模式已开启，请注意开启无限连发时，连发模式无法关闭，想要关闭建议重启！`);
        } else {
          e.reply(`连发模式已开启，本次共发送` + num + `张图片`);
        }
        timer(num);
        return true;
      } else if (onoff == '关闭' && e.isMaster) {
        e.reply(`连发模式无法关闭，若为无限连发，建议重启`);
      } else {
        e.reply(`只有主人可以命令本机器人哦~`);
      }
    } else {
      e.reply(`此功能只有群聊可以使用哦！`);
    }
  }
}