import { segment } from "oicq";
import fetch from "node-fetch";
import schedule from "node-schedule";
import moment from "moment";

//群号:258623209  作者:Pluto
//项目路径
const _path = process.cwd();

let Gruop  = [258623209,]; //要推送的群号放这,逗号隔开,不建议多,容易封号


async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


//定时推送 定时区分 (秒 分 时 日 月 星期)
schedule.scheduleJob('0 0 0,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23 * * *', async()=>{ 
     let time = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
     let hours =(new Date(time).getHours());
     let path = `${_path}/resources/报时/${hours}.mp3`
      let msg ;
    switch(hours){
        case 0:
         msg = [
            `深夜零点。大丘丘病了，二丘丘瞧；三丘丘采药，四丘丘熬；五丘丘死了，六丘丘抬~`,
            ] 
            
            break;
        
        case 5:
         msg = [
            `〇五〇〇。咳咳…太阳出来我晒太阳，月亮出来我晒月亮咯~`,
            ] 
            
           
            
            break;
            
         case 6:
         msg = [
            `〇六〇〇。西风骑士团，「火花骑士」，可莉，前来报到！…呃——后面该说什么词来着？可莉背不下来啦...`,
            ] 
            
           
            break;
            
         case 7:
         msg = [
           `〇七〇〇。早安！带可莉出去玩吧！我们一起来冒险！`,
            
            ] 
        
            break;
         
         case 8:
         msg = [
            `〇八〇〇。嗯，闲着也是闲着，还不如一起找找食材去！`,
            
            ]
         
            break;   
        
        case 9:
         msg = [
            `〇九〇〇。嘿、哈！好！一拳就能把野物打晕必保证食材新鲜！`,
            
            ] 
          
            
            break;   
        
        case 10:
         msg = [
           `一〇〇〇。风史莱姆最喜欢在这种天气活动，快趁机多收集点儿！我给你做史莱姆沙冰！`,
          
            ] 
           
            break;
            
        case 11:
         msg = [
           `一一〇〇。要吃点点心休息一下吗？我准备了一箩！`,
           
            ] 
           
            break;
        
        
        case 12:
         msg = [
            `十二〇〇。午饭时间到了！啊...吃什么呢？我来看看《提瓦特游览指南》...`,
            
            ] 
          
            break;  
        
        case 13:
         msg = [
           `一三〇〇。午饭已经做好了，快过来吃哦！啊鸣…来晚了可就没了。`,
           
            ] 
          
            break;  
            
        case 14:
         msg = [
            `一四〇〇。白天你尽管到处跑，晚上可得小心点。我不在的时候，务必谨慎行动。`,
          
            ] 
           
            break; 
            
         case 15:
         msg = [
            `一五〇〇。哦，困了吗？那你好好休息，我一个人四处转转。`,
          
            ] 
            break;
            
        case 16:
         msg = [
           `一六〇〇。看到七七了吗？快告诉我她在哪，我要把她藏起来，嘿！`,
            
            ] 
            break;   
            
        case 17:
         msg = [
            `一七〇〇。不如去我那儿喝杯茶？嘿~`,
           
            ] 
            break;   
            
        case 18:
         msg = [
            `一八〇〇。嘻嘻，月亮出来喽~咱也出门吧。`,
           
            ] 
            break;   
            
        case 19:
         msg = [
            `一九〇〇。要吃夜宵吗？我这正好做了串炭烤岩斯蜴。哎呀，别盯着了，快尝尝吧！`,
           
            ] 
            break;   
            
        case 20:
         msg = [
            `二〇〇〇。晚上好！拜托你也帮我跟霍夫曼先生说说吧，可莉不是小孩子了，可莉晚上也可以出去玩——带我出去玩——`,
           
            ] 
            break;   
            
        case 21:
         msg = [
           `二一〇〇。不行！才九点，可莉今晚一定要撑到看完马戏团的午夜专场！你是可莉的玩伴吧！那就别想现在就把我送回家，略略略略…`,
           
            ] 
            break;   
            
        case 22:
         msg = [
            `二二〇〇。虽然出来玩的时候说不想回家，但天黑以后的旷野，不认识路…拜、拜托你回去的时候，把我也送回家好不好…`,
           
            ] 
            break;   
            
        case 23:
         msg = [
            `二三〇〇。喂…你不会是想背着我偷偷吃什么好东西吧？哦…只是休息啊…嘿嘿，那晚安呢。`,
           
            ] 
            break;       
    }
  
  
	for (var key of Gruop) {
		Bot.pickGroup(key * 1).sendMsg(msg);
	  	Bot.pickGroup(key * 1).sendMsg(segment.record(`file:///${path}`));
	  	
	  	await sleep(10000) 
	}
});



