import { segment } from "oicq";
import fetch from "node-fetch";
import { time } from "console";
//改自原打我v2
//项目路径
const _path = process.cwd();

//设置参数
const Delayed = 5000;//延迟时间
const Randomforbiddentime = true;//是否开启随机禁言时间
const Randomforbiddentime_min = 1;//首次随机禁言时间最小值，单位：分钟
const Randomforbiddentime_max = 10;//首次随机禁言时间最大值，单位：分钟
const Randomforbiddentime_intervalmax = 1;//接下来随机累加时间最大值，单位：分钟
const Randomforbiddentime_intervalmin = 10;//接下来随机累加时间最小值，单位：分钟
//关闭随机禁言时间下方配置才生效
const Forbiddentime1 = 5; //固定第一次禁言时间，单位分钟
const Forbiddentime2 = 10; //固定第二次禁言时间，单位分钟
const Forbiddentime3 = 15; //固定第三次禁言时间，单位分钟



export class HitMe extends plugin {
  constructor() {
    super({
      name: 'HitMe',
      dsc: 'HitMe',
      event: 'message',
      priority: 1700,
      rule: [{
        reg: '^#*打我$',
        fnc: 'Hitme'
      }]
    })
  }

  async Hitme(e) {
    //e.msg 用户的命令消息  
    console.log("用户命令：", e.msg);
    //检查是否不是群聊
    if (!e.isGroup) {
      e.reply("请在群内使用该命令！");
      return true;
    }
    //检查自己是否是群主或管理员
    if (e.member.is_admin || e.member.is_owner || e.isMaster) {
      e.reply("不敢打，不敢打！！！");
      return true;
    }
    //检查是否为管理员或群主
    if (!e.group.is_admin && !e.group.is_owner) {
      e.reply("有本事给我管理员啊！");
      return true;
    }
    //检查随机禁言是否开启
    if (Randomforbiddentime) {
      //第一次随机禁言
      var time1 = Math.floor(Math.random() * (Randomforbiddentime_max - Randomforbiddentime_min + 1)) + Randomforbiddentime_min;
      //第二次随机禁言
      var time4 = Math.floor(Math.random() * (Randomforbiddentime_intervalmax - Randomforbiddentime_intervalmin + 1)) + Randomforbiddentime_intervalmin;
      //第三次随机禁言
      var time5 = Math.floor(Math.random() * (Randomforbiddentime_intervalmax - Randomforbiddentime_intervalmin + 1)) + Randomforbiddentime_intervalmin;
      //合并时间
      var time2 = time1 + time4;
      var time3 = time2 + time5;
      //禁言它！
      e.group.muteMember(e.user_id, time1 * 60);
      //发送消息
      e.reply(`一拳`);
      //延迟时间
      setTimeout(function () {
        //禁言它！
        e.group.muteMember(e.user_id, time2 * 60);
        //发送消息
        e.reply(`二拳`);
      }, Delayed);
      //延迟时间
      setTimeout(function () {
        //禁言它！
        e.group.muteMember(e.user_id, time3 * 60);
        //发送消息
        e.reply(`三拳`);
      }, Delayed + Delayed);
    } else {
      //第一次禁言
      e.group.muteMember(e.user_id, Forbiddentime1 * 60);
      //发送消息
      e.reply(`一拳`);
      //设置延时
      setTimeout(() => {
        //第二次禁言
        e.group.muteMember(e.user_id, Forbiddentime2 * 60);
        //发送消息
        e.reply(`二拳`);
      }, Delayed);
      //设置延时
      setTimeout(() => {
        //第三次禁言
        e.group.muteMember(e.user_id, Forbiddentime3 * 60);
        //发送消息
        e.reply(`三拳`);
      }, Delayed + Delayed);
    }
    return true; //返回true 阻挡消息不再往下
  }
}
