
import YAML from "yaml"
import fs from "node:fs"

export class lanjie extends plugin {
  constructor () {
    let rule = {
      fnc: "lanjie"
    }
    super(
      {
        name: "指令拦截",
        des: "禁止指令",
        event: "message",
        priority: 2,
        rule: [rule,
        {
          reg: "#禁止(.*)$",
          fnc: "jinzhi"
        },
        {
          reg: "#开放(.*)$",
          fnc: "del"
        },
        {
          reg: "#列表|#本群列表$",
          fnc: "help"
        },
        {
          reg: '#更新群列表$',
          fnc: 'update'
        }
        ]
      }
    )
    this._path = process.cwd()
    Object.defineProperty(rule, "log", {
      get: () => false
    })
    this.file = `${this._path}/data/data.yaml`
    if (!fs.existsSync(this.file)) {
      let data = []
      Bot.gl.forEach(function (group, groupId) {
        data.push({ groupid: groupId, groupname: group.group_name, word: [] })
      })
      let yaml = YAML.stringify(data)
      fs.writeFileSync(this.file, yaml, "utf8")
    }

    this.asd =this.get("data")
    /** 定时任务更新群列表 */
    this.task ={
      cron:'0 0/20 * * * ?',
      name:'update',
      fnc:() =>this.update(),
      log: false
    }
  }

  async lanjie () {
    if (!this.e.isGroup) {
      return false
    }
    for (let i in this.asd) {
      if (this.asd[i].groupid === this.e.group_id) {
        let mag = this.asd[i].word
        for (let j in mag) {
          if(!/#禁止/.test(this.e.msg) && !/#开放/.test(this.e.msg) && mag[j].includes("XX") && this.e.msg.includes(mag[j].replace(/XX/,""))){
            return true;
          }
          if(mag[j] === this.e.msg){
            this.e.reply("该功能此已被禁止哦~")
            return true
          }
        }
      }
    }
    return false
  }

  /** 私聊命令后加空格和群号，群聊自动识别该群 */
  async jinzhi () {
    if (!this.e.isMaster) {
      this.e.reply("只有主人才能命令我哦~")
      return true
    }
    let string = this.e.msg
    var list = string.split(" ")
    let add = list[0].replace(/#禁止/, "")
    let mag = []
    console.log(0)
    if (list[1] === undefined) {
      if (!this.e.isGroup) {
        this.e.reply("请在需要禁用的群聊中使用，或加上群号呢~")
        return true
      }
      for (let i in this.asd) {
        if (this.asd[i].groupid === this.e.group_id) {
          mag = this.asd[i].word
          for (let j in mag) {
            if (mag[j] === add) {
              this.e.reply("这个词语已经禁止过了哦~")
              return true
            }
          }
          mag.push(add)
          this.asd[i].word = mag
          fs.writeFileSync(this.file, YAML.stringify(this.asd), "utf-8")
          this.e.reply(`${add}已成功禁止~`)
          return true
        }
      }
    }else{
      for (let i in this.asd) {
        if (this.asd[i].groupid === Number(list[1])) {
          mag = this.asd[i].word
          for(let j in mag){
            if(mag[j] === add){
              this.e.reply("这个词语已经禁止过了哦~")
              return true
            }
          }
          mag.push(add)
          this.asd[i].word = mag
          fs.writeFileSync(this.file, YAML.stringify(this.asd),"utf-8")
          this.e.reply(`${add}已成功禁止~`)
          return true
        }
      }
    }
  }

  /** 私聊命令后加空格和群号，群聊自动识别该群 */
  async del(){
    if(!this.e.isMaster){
      this.e.reply("只有主人才能命令我哦~")
      return true
    }
    let string =this.e.msg
    var list = string.split(" ")
    let del = list[0].replace(/#开放/,"")
    console.log(list[1])
    let mag = []
    if(list[1] === undefined){
      if(!this.e.isGroup){
        this.e.reply("请在需要开放的群聊中使用，或加上群号呢~")
        return true
      }
      for(let i in this.asd){
        if(this.asd[i].groupid === this.e.group_id){
          mag = this.asd[i].word
          if(mag.length === 0){
            this.e.reply("这个群并没有禁用指令哦~")
            return true
          }
          for(let j in mag){
            if(mag[j] === del){
              mag.splice(j ,1)
              this.asd[i].word = mag
              fs.writeFileSync(this.file,YAML.stringify(this.asd),"utf-8")
              this.e.reply(`${del}已成功开放~`)
              return true
            }
          }
          this.e.reply("并没有禁止这个指令哦~")
          return true
        }
      }
    }else{
      for(let i in this.asd){
        if(this.asd[i].groupid ===Number(list[1])){
          mag = this.asd[i].word
          if(mag.length === 0){
            this.e.reply("这个群并没有禁用指令哦~")
            return true
          }
          for(let j in mag){
            if(mag[j] === del){
              mag.splice(j ,1)
              this.asd[i].word = mag
              fs.writeFileSync(this.file,YAML.stringify(this.asd),"utf-8")
              this.e.reply(`${del}已成功开放~`)
              return true
            }
          }
          this.e.reply("并没有禁止这个指令哦~")
          return true
        }
      }
    }
  }

  /** 查看列表（可主人查看所有列表，群员查看本群列表） */
  async help () {
    let msg=[]
    if (this.e.msg === "#本群列表") {
      if(!this.e.isGroup){
        this.e.reply("请在群聊中使用呢~")
        return true
      }
      let title = ["本群列表如下："]
      for(let i in this.asd){
        if(this.asd[i].groupid === this.e.group_id){
          if(this.asd[i].word.length === 0){
            this.e.reply("本群未禁止任何指令")
            return true
          }
          msg=this.asd[i].word
          let forward =await this.makeForwardMsg(Bot.uin,title,msg)
          this.e.reply(forward)
        }
      }
      return true
    }else{
      if(!this.e.isMaster){
        this.e.reply("只有主人才能命令我哦~")
        return true
      }
      for(let i in this.asd){
        if(this.asd[i].word.length === 0){
          msg.push(`群名称：${this.asd[i].groupname} \n群号：【${this.asd[i].groupid}】\n禁止指令：【无】`)
        }else{
          msg.push(`群名称：${this.asd[i].groupname} \n群号：【${this.asd[i].groupid}】\n禁止指令：\n ${this.asd[i].word}`)
        }
      }
      let title = ["主人的群列表如下~"]
      let forward =await this.makeForwardMsg(Bot.uin,title,msg)
      this.e.reply(forward)
      return true
    }
  }

  /** 更新群列表数据 */
  async update() {
    let data =[]
    let num = []
    let gl = []
    Bot.gl.forEach(function (group, groupId) {
      data.push({ groupid: groupId, groupname: group.group_name, word: [] })
      gl.push(groupId)
    })
    for(let i in this.asd){
      num.push(this.asd[i].groupid)
    }
    for(let i in data){
      if(!num.includes(data[i].groupid)){
        this.asd.push(data[i])
        fs.writeFileSync(this.file, YAML.stringify(this.asd), "utf8")
      }
    }
    for(let i in this.asd){
      if(!gl.includes(this.asd[i].groupid)){
        this.asd.splice(i,1)
        fs.writeFileSync(this.file, YAML.stringify(this.asd), "utf8")
      }
    }
    for(let i in this.asd){
      for(let j in data){
        if(this.asd[i].groupid === data[j].groupid){
          this.asd[i].groupname = data[j].groupname
          fs.writeFileSync(this.file, YAML.stringify(this.asd), "utf8")
        }
      }
    }
  }

  /** 获取yaml文件数据 */
  get (name) {
    let file = `${this._path}/data/${name}.yaml`
    let key = `${name}`
    this[key] = YAML.parse(
      fs.readFileSync(file, "utf8")
    )
    return this[key]
  }

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
    for(let i in msg){
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
      .replace(/\n/g, "")
      .replace(/<title color="#777777" size="26">(.+?)<\/title>/g, "___")
      .replace(/___+/, `<title color="#777777" size="26">${title}</title>`)
    return forwardMsg
  }
}
