const colors = require('colors')
const ora = require('ora')
const lookingSpinner = ora('Searching for plugins...').start()

const config = require('./config.json')
const token = require('../botToken.json')
let plugins = require('./plugins.js').find((pl) => {
  lookingSpinner.stopAndPersist({ symbol: '✔', text: `Found ${pl.name} ${pl.version}` })
})

lookingSpinner.succeed('Done searching for plugins.')

const fs = require('fs')
const EventEmitter = require('events')
const THOTUtils = require('./THOTUtils')

class THOTBot extends EventEmitter {
  isDaddy (msg) {
    if (config.servers[msg.guild.id].daddy[`${msg.author.username}#${msg.author.discriminator}`] === 'true') { return true } else { return false }
  }
  log (msg) {
    var time = new Date()
    console.log(`ℹ️ [${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}]`.white, msg)
  }
  warn (msg) {
    var time = new Date()
    console.log(`⚠ [${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}]`.yellow, msg)
  }
  error (msg) {
    var time = new Date()
    console.log(`🚫 [${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}]`.red, msg)
  }
  notMyDaddy (msg) {
    msg.reply(`You're not my daddy :triumph: :raised_hand:`)
    msg.react('😤')
    msg.react('✋')
  }
  reply (msg, title, description, color = 16711680, url = null, image = null) {
    const embed = new Discord.RichEmbed({
      title,
      description,
      color,
      url,
      image
    })
    return msg.channel.send(embed)
  }
  richReply (msg, data) {
    const embed = new Discord.RichEmbed(data)
    msg.channel.send(embed)
  }
  setUserData (uid, key, value) {
    config.userdata[uid][key] = value
    this.config = config
    fs.writeFile('./config.json', JSON.stringify(config, null, 2), () => {})
  }
  getUserData (uid, key) {
    return this.config.userdata[uid][key]
  }
  setServerData (sid, key, value) {
    config.servers[sid][key] = value
    this.config = config
    fs.writeFile('./config.json', JSON.stringify(config, null, 2), () => {})
  }
  getServerData (sid, key) {
    return this.config.servers[sid][key]
  }

  init () {
    this.on('!setDaddy', (msg) => {
      require('./functions/setdaddy.js')(msg, config, this)
    })
    this.on('!plugins', (msg) => {
      require('./functions/plugins.js')(msg, plugins, this.reply)
    })
    this.on('!help', (msg) => {
      require('./functions/help.js')(msg, plugins, this.reply)
    })
    this.on('!reload', (msg) => {
      if (!this.isDaddy(msg)) {
        this.notMyDaddy(msg)
        return
      }
      msg.react('✅')
      setTimeout(() => {
        process.exit()
      }, 250)
    })
    this.on('THOTFunction_guildMemberAdd', (member) => {
      console.log(member)
      let role = this.client.guilds.get(member.guild.id).roles.find('name', this.config.servers[member.guild.id].defaultRole)
      if (role !== undefined) {
        member.addRole(role).catch(this.error)
      }
    })
  }
}

const thot = new THOTBot()

const Discord = require('discord.js')

class BetterClient extends Discord.Client {
  get browser () { return false }
}
const client = new BetterClient()

client.on('ready', () => {
  connectingSpinner.succeed(`Connected to Discord as ${client.user.tag}.`)

  thot.config = config
  thot.client = client

  thot.init()

  const initSpinner = ora('Initializing plugins...').start()

  require('./plugins.js').init(plugins, thot, (err, pl) => {
    if (err) { initSpinner.stopAndPersist({ symbol: '⚠', text: `${pl.name} does not export an init function. Skipping.` }); return }
    initSpinner.stopAndPersist({ symbol: '✔', text: `Successfully loaded ${pl.name} ${pl.version}` })
  })

  initSpinner.succeed(`Ready.`)

  client.user.setPresence({ game: { name: 'you.', type: 3 } })
})

client.on('message', msg => {
  if (msg.author === client.user) { return }
  thot.emit(msg.content.split(' ')[0], msg)
  thot.emit(`THOTFunction_message`, msg)
})

client.on('guildMemberAdd', member => {
  thot.emit(`THOTFunction_guildMemberAdd`, member)
})

client.on('messageReactionAdd', (reaction, user) => {
  thot.emit(`THOTFunction_messageReactionAdd`, {reaction, user})
})

const connectingSpinner = ora('Connecting to Discord...').start()
client.login(token.token)
