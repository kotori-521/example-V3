
import fs from 'node:fs'
import YAML from 'yaml'
import { Restart } from '../other/restart.js'
import cfg from '../../lib/config/config.js'

let qq=0
let pw

export class zhanghao extends plugin {
  constructor () {
    super({
      name: '帐号管理',
      event: 'message',
      priority: 4000,
      rule: [
        {
          reg: '^#切换(\\d)+$',
          fnc: 'change',
          permission: 'master'
        },
        {
          reg: '^#配置$',
          fnc: 'int',
          permission: 'master'
        },
        {
          reg: '^#删除配置(\\d)+$',
          fnc: 'del',
          permission: 'master'
        },
        {
          reg: '^#查看$',
          fnc: 'check',
          permission: 'master'
        },
        {
          reg: '^#设置替换(开启|关闭)$',
          fnc: 'setchange',
          permission: 'master'
        }
      ]
    })
    let yaml = []
    this._path = process.cwd()
    /** 生成bot.yaml文件存储帐号数据 */
    if (!fs.existsSync(`${this._path}/resources/bot.yaml`)) {
      fs.writeFileSync(`${this._path}/resources/bot.yaml`, YAML.stringify(yaml), 'utf8')
    }
    this.asd=this.get('bot')
    this.key = 'restart'
    this.keys = 'setrestart'
  }

  async init () {
    let restart = await redis.get(this.key)
    let msg = '上个帐号掉线了,已为你替换帐号!'
    if(restart){
      Bot.pickUser(cfg.masterQQ).sendMsg(msg)
    }
    redis.del(this.key)
  }

  async change () {
    let deFault =fs.readFileSync(`${this._path}/resources/Default.yaml`,'utf-8')
    let msg = this.e.msg.match(/\d+/g, '')
    if(parseInt(msg)>this.asd.length){
      this.reply("你有那么多帐号吗?")
      return true
    }
    let QQ =this.asd[parseInt(msg)-1].qq[0]
    let PW =this.asd[parseInt(msg)-1].pw
    let Plat= this.asd[parseInt(msg)-1].plat[0]
    if(QQ===Bot.uin){
      this.reply("不能切换自己的帐号哦!")
      return true
    }
    if (!fs.existsSync(`${this._path}/data/${QQ}/token`)){
      this.reply("该帐号可能未通过登录验证,不支持切换!")
      return true
    }
    deFault = deFault.replace(/qq:/g,'qq: '+ QQ)
    deFault = deFault.replace(/pwd:/g,`pwd:  '${PW}'`)
    deFault = deFault.replace(/platform:/g,'platform: ' + Plat)
    fs.writeFileSync(`${this._path}/config/config/qq.yaml`, deFault, 'utf8')
    this.reply("切换成功，即将重启!")
    setTimeout(() => this.restart(), 2000)
  }

  async check() {
    let msg=[]
    let title =[`帐号如下:\n(当前帐号为${Bot.uin})`]
    for(let i in this.asd){
      msg.push(`${parseInt(i)+1}、${this.asd[i].qq[0]}`)
    }
    let forward =await this.makeForwardMsg(Bot.uin,title,msg)
    this.reply(forward)
  }
  
  async int() {
    if(this.e.isGroup){
      this.reply("请私聊配置哦~")
      return true
    }
    this.setContext('getqq')
    await this.reply("请发送qq号!")
  }

/** 获取qq号、密码、设备 */
  async getqq(){
    if(/结束/.test(this.e.msg)){
      this.reply("已结束配置")
      this.finish('getqq')
      return true
    }
    let data=this.e.msg.match(/\d+/g)
    qq=parseInt(data)
    if(data==null){
      this.reply("请输入正确的qq号!")
      this.finish('getqq')
      return true
    }else{     
      for(let i in this.asd){
        if(this.asd[i].qq[0]===qq){
        this.reply("该账户已配置")
        this.finish('getqq')
        return true
      }
    }
  }
  this.setContext('getpw')
  await this.reply("请输入密码!")
  this.finish('getqq')
}

  async getpw() {
    if(/结束/.test(this.e.msg)){
      this.reply("已结束配置")
      this.finish(`getpw`)
      return true
    }
    pw=this.e.msg
    this.setContext('getplat')
    await this.reply("请选择登录设备!\n1:安卓手机、 2:aPad 、 3:安卓手表、 4:MacOS 、 5:iPad")
    this.finish(`getpw`)
  }

  getplat() {
    if(/结束/.test(this.e.msg)){
      this.reply("已结束配置")
      this.finish('getplat')
      return true
    }
    let plat=parseInt(this.e.msg)
    if(plat === null){
      this.reply("请输入正确的设备号!")
      return true
    }
    if(/无/.test(pw)){
      this.asd.push({'qq':[qq],'pw':[],'plat':[plat]})
      fs.writeFileSync(`${this._path}/resources/bot.yaml`, YAML.stringify(this.asd), 'utf8')
    }else{
      this.asd.push({'qq':[qq],'pw':[pw],'plat':[plat]})
      fs.writeFileSync(`${this._path}/resources/bot.yaml`, YAML.stringify(this.asd), 'utf8')
    }
    if (!fs.existsSync(`${this._path}/data/${qq}/token`)){
      this.reply("该帐号可能未通过登录验证,请及时通过登录验证,否则将会影响帐号切换!")
    }else{
      this.reply("配置成功!")
    }
    this.finish('getplat')
  }

  async del () {
    let del = this.e.msg.match(/\d+/g, '')
    if(parseInt(del)>this.asd.length){
      this.reply("你有那么多帐号吗?")
      return true
    }
    this.asd.splice(del-1,1)
    fs.writeFileSync(`${this._path}/resources/bot.yaml`, YAML.stringify(this.asd), 'utf8')
    this.reply("删除成功!")
    return true
  }

  async setchange () {
    if(/开启/.test(this.e.msg)){
      await redis.set(this.keys, '1')
      this.reply("下线替换已开启!")
      return true
    }
    if(/关闭/.test(this.e.msg)){
      redis.del(this.keys)
      this.reply("下线替换已关闭!")
      return true
    }
  }

/** 获取yaml文件内容 */
  get (name) {
    let file = `${this._path}/resources/${name}.yaml`
    let key = `${name}`
    this[key] = YAML.parse(
      fs.readFileSync(file, 'utf8')
    )
    return this[key]
  }
/** 制作转发内容 */
  async makeForwardMsg (qq, title, msg) {
    let nickname = Bot.nickname
    if (this.e.isGroup) {
      let info = await Bot.getGroupMemberInfo(this.e.group_id, qq)
      nickname = info.card ?? info.nickname
    }
    let userInfo = {
      user_id: Bot.uin,
      nickname
    }
    let forwardMsg = [
      {
        ...userInfo,
        message: title
      }
    ]
    for (let i in msg) {
      forwardMsg.push(
        {
          ...userInfo,
          message: msg[i]
        }
      )
    }
    /** 制作转发内容 */
    if (this.e.isGroup) {
      forwardMsg = await this.e.group.makeForwardMsg(forwardMsg)
    } else {
      forwardMsg = await this.e.friend.makeForwardMsg(forwardMsg)
    }
    /** 处理描述 */
    forwardMsg.data = forwardMsg.data
      .replace(/\n/g, '')
      .replace(/<title color="#777777" size="26">(.+?)<\/title>/g, '___')
      .replace(/___+/, `<title color="#777777" size="26">${title}</title>`)
    return forwardMsg
  }

  restart () {
    new Restart(this.e).restart()
  }


}



