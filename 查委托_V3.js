import plugin from '../../lib/plugins/plugin.js'
import common from '../../lib/common/common.js'
import fs from 'fs'
import YAML from 'yaml'

export class DailyTask extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: '查委托',
      /** 功能描述 */
      dsc: '查询每日委托任务有没有成就',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 5000,
      rule: [{
          /** 命令正则匹配 */
          reg: '^---查委托---$',
          /** 执行方法 */
          fnc: 'dailyTask',
        },
        {
          /** 命令正则匹配 */
          reg: '^#*(设置|配置)?(.+)(别称|别名)$',
          /** 执行方法 */
          fnc: 'Abbr',
          /** false时不显示执行日志 */
          log: false
        },
        {
          /** 命令正则匹配 */
          reg: '^#*(修改|设置|配置|删除|移除)《(.+)》文案$',
          /** 执行方法 */
          fnc: 'Msg',
          /** 权限 master,owner,admin,all */
          permission: 'master',
          /** false时不显示执行日志 */
          log: false
        }
      ]
    })
  }

  /**

   * ---查委托---

   * 插件(.js)复制到 Yunzai-Bot/plugins/example/ 目录下

   * 全成就文档：docs.qq.com/doc/DS01hbnZwZm5KVnBB

   * 有事找乐神805475874，没事找我1146638442

   * 指令：#岩游记|#帝君故事|#修改《岩游记》文案|#删除《岩游记》文案|#岩游记 别称|#设置 岩游记 别称

   */

  /** 插件初始化 */
  init () {
    let file = './data/dailyTask/'

    let url = `http://114.132.218.87:12583${file.slice(1)}`

    if (!fs.existsSync(file)) {
      fs.mkdirSync(file)
    }

    ['委托成就', '委托名字'].forEach(async (v) => {
      await common.downFile(`${url}${v}`, `${file}${v}.yaml`)
    })
  }

  /** 判断消息是否命中 */
  set Data (msg = '') {
    let Name = new Map()
    let name = this.read('委托名字')
    let obj = this.read('自定义别称')

    let reg = new RegExp('#|＃|？|。|,|，|·|!|！|—|《|》|…|「|」|『|』|、', 'g')
    msg = msg.replace(/\.|\?/g, '').replace(reg, '')

    if (!name) return
    for (let i in name) {
      if (obj && obj[i]) {
        name[i] = [...name[i], ...obj[i]]
      }
      name[i].forEach((v) => {
        Name.set(v, i)
      })
    }

    this.Name = Name.get(msg.trim())
  }

  /** 判断委托是否含成就并返回数据 */
  get Data () {
    let res = this.read('委托成就')
    let data = res.find(v => v.name == this.Name)

    let _res = this.read('自定义文案') || []
    let _data = _res.find(v => v.name == this.Name)
    if (_res && _data) data = _data

    if (['蒙德委托', '璃月委托', '稻妻委托', '须弥委托'].includes(this.Name)) {
      let msg = `${this.Name}，无成就。`
      return {
        msg
      }
    }

    if (data) return {
      data,
      status: 1
    }
  }

  /** 匹配用户消息 */
  async accept () {
    if (!this.e.msg || new RegExp(this.rule[2].reg).test(this.e.msg)) return
    this.Data = this.e.msg
    if (this.Name) {
      this.e.msg = '---查委托---'

      this.status = this.Data.status

      this.res = this.Data

      return true
    }
  }

  /** 发送xml卡片消息 */
  async dailyTask () {
    if (!this.res) return

    if (!this.status) return await this.reply(this.res.msg)

    let data = this.res.data

    let name = `隐藏成就《${data.name}》\n${data.desc}`
    let task = new Array()
    if (!data.hidden) name = name.slice(2)
    data.involve.forEach((v) => {
      task.push(`${v.type.replace('委托任务', '每日委托')}《${v.task}》`)
    })

    let by = '\n————————\n※ 文案: B站 oz水银'
    let msg = await common.makeForwardMsg(this.e, [name, task.join('\n'), data.msg + by], name)

    return await this.reply(msg)
  }

  /** 发送xml卡片消息 */
  async Abbr () {
    this.Data = this.e.msg.replace(new RegExp('设置|配置|别称|别名', 'g'), '')
    let name = this.Name
    if (!name) return

    if (this.e.msg && /(设置|配置)(.+)(别称|别名)$/g.test(this.e.msg)) {
      /** 主人权限 */
      if (!this.e.isMaster) return
      await this.reply(`请发送《${this.Name}》别名，多个用空格隔开`)
      this.e.Name = name
      this.setContext('setAbbr')
      return true
    }

    let obj = this.read('委托名字')
    let _obj = this.read('自定义别称')

    let ret = []
    ret.push(...obj[name])
    if (_obj && _obj[name]) ret.push(..._obj[name])

    let msg = `委托成就《${name}》别称，${ret.length}个`
    msg = await common.makeForwardMsg(this.e, [msg, ret.join('\n')], msg)

    await this.reply(msg)
  }

  /** 上下文 */
  async Msg () {
    this.Data = this.e.msg.replace(new RegExp('修改|设置|配置|删除|移除|委托|文案|别称|别名', 'g'), '')
    if (!this.Data?.status) return await this.reply('操作失败: 成就不存在或暂未收录')

    this.e.Data = this.Data.data
    this.e.Name = this.Name

    if (this.e.msg && /(修改|设置|配置)(.+)文案$/g.test(this.e.msg)) {
      await this.reply('请发送内容')
      this.setContext('setMsg')
    }

    if (this.e.msg && /(删除|移除)(.+)文案$/g.test(this.e.msg)) {
      this.e.msg = '删除文案'
      this.getContext = () => {
        return {
          setMsg: this.e
        }
      }
      await this.setMsg()
    }
  }

  /** 设置文案上下文 */
  async setMsg () {
    if (!this.e.msg || this.e.at || this.e.img) {
      await this.reply('操作错误：请发送正确内容')
      return
    }

    let {
      setMsg = {}
    } = this.getContext()

    let name = setMsg.Name

    let Data = setMsg.Data
    Data.msg = this.e.msg

    let arr = this.read('自定义文案') || []
    let data = arr.filter(v => v.name !== name)

    let msg = `委托成就《${name}》文案设置成功！`
    if (setMsg.msg == '删除文案') {
      msg = `委托成就《${name}》文案已删除！`
      if (!arr.find(v => v.name == name)) {
        msg = `删除失败: 委托成就《${name}》自定义文案不存在！`
        await this.reply(msg)
        return true
      }
    } else {
      data.push(Data)
      this.finish('setMsg')
    }

    await this.reply(msg)

    this.write('自定义文案', data)
  }

  /** 设置名称上下文 */
  async setAbbr () {
    if (!this.e.msg || this.e.at || this.e.img) {
      await this.reply('设置错误：请发送正确内容')
      return
    }

    let {
      setAbbr = {}
    } = this.getContext()
    this.finish('setAbbr')

    let Name = setAbbr.Name
    let setName = this.e.msg.split(' ')

    let obj = this.read('自定义别称') || {}

    if (!obj[Name]) {
      obj[Name] = []
    }

    let ret = []
    for (let name of setName) {
      if (!name) continue
      /** 重复添加 */
      if (obj[Name].includes(name)) {
        continue
      }

      obj[Name].push(name)
      ret.push(name)
    }
    if (ret.length <= 0) {
      await this.reply('设置失败：别名错误或已存在')
      return
    }
    this.write('自定义别称', obj)
    await this.reply(`设置别名成功：${ret.join('、')}`)
  }

  /** 读取文件 */
  read (files) {
    let file = `./data/dailyTask/${files}.yaml`

    try {
      return YAML.parse(
        fs.readFileSync(file, 'utf8')
      )
    } catch (error) {
      return false
    }
  }

  /** 写入文件 */
  write (files, data) {
    let file = `./data/dailyTask/${files}.yaml`

    return fs.writeFileSync(
      file,
      YAML.stringify(data)
    )
  }
}