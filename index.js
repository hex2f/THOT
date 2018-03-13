const colors = require('colors')
const ora = require('ora')
const lookingSpinner = ora('Searching for plugins...').start()

const config = require('./config.json')
const events = require('./events.json')
const token = require('../botToken.json')
let plugins = require('./plugins.js').find((pl) => {
  lookingSpinner.stopAndPersist({ symbol: '✔', text: `Found ${pl.name} ${pl.version}` })
})

lookingSpinner.succeed('Done searching for plugins.')

const fs = require('fs')
const EventEmitter = require('events')

class THOTBot extends EventEmitter {
  isDaddy (msg) {
    if (config.servers[msg.guild.id].daddy[msg.author.id] === 'true') { return true } else { return false }
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
  isTurbo (msg) {
    if (!msg.guild) { return false }
    let uses = this.getUserData(msg.author.id, 'turboUses')
    if (uses === undefined) { uses = 2 }
    return uses > 0
  }
  useTurbo (msg) {
    if (!msg.guild) { return false }
    let uses = this.getUserData(msg.author.id, 'turboUses')
    console.log(uses)
    if (uses === undefined) { uses = 100 }
    this.setUserData(msg.author.id, 'turboUses', uses - 1)
  }
  buyTurboMessage (msg) {
    this.richReply(msg, {
      description: "You've used up your monthly TurboTHOT access. To unlock the full potential of THOT please [purchase TurboTHOT](https://google.com/).",
      author: {
        name: 'Buy TurboTHOT',
        url: 'https://google.com/',
        icon_url: 'https://images-na.ssl-images-amazon.com/images/I/61frS-Xn8HL.png'
      },
      color: 431075
    })
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
    if (config.userdata[uid] === undefined) { config.userdata[uid] = {} }
    config.userdata[uid][key] = value
    this.config = config
    fs.writeFile('./config.json', JSON.stringify(config, null, 2), () => {})
  }
  getUserData (uid, key) {
    if (config.userdata[uid] === undefined) { config.userdata[uid] = {} }
    return this.config.userdata[uid][key]
  }
  setServerData (sid, key, value) {
    if (config.servers[sid] === undefined) { config.servers[sid] = {} }
    if (key === '...') { config.servers[sid] = value } else { config.servers[sid][key] = value }
    this.config = config
    fs.writeFile('./config.json', JSON.stringify(config, null, 2), () => {})
  }
  getServerData (sid, key) {
    return this.config.servers[sid][key]
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
  thot.plugins = plugins
  thot.client = client
  thot.Discord = Discord

  const initSpinner = ora('Initializing plugins...').start()

  require('./plugins.js').init(plugins, thot, (err, pl) => {
    if (err) { initSpinner.stopAndPersist({ symbol: '⚠', text: `${pl.name} does not export an init function. Skipping.` }); return }
    initSpinner.stopAndPersist({ symbol: '✔', text: `Successfully loaded ${pl.name} ${pl.version}` })
  })

  initSpinner.succeed(`Ready.`)

  client.user.setPresence({ game: { name: 'you.', type: 3 } })
})

client.on('message', msg => {
  try {
    if (msg.author === client.user) { return }

    if (msg.content.split(' ')[0] === '!setListening') {
      if (!thot.isDaddy(msg)) { thot.notMyDaddy(msg); return }
      if (msg.content.split(' ')[1] === 'true' || msg.content.split(' ')[1] === 'false') {
        thot.setServerData(msg.guild.id, 'enabled', msg.content.split(' ')[1])
        msg.react('✅')
      } else {
        thot.reply(msg, 'Usage Error', 'Usage: !setListening <true>|<false>')
        msg.react('🇽')
      }
    }
    if (msg.guild) {
      if (thot.getServerData(msg.guild.id, 'enabled') === 'true') {
        thot.emit(msg.content.split(' ')[0], msg)
      }
    } else {
      thot.emit(msg.content.split(' ')[0], msg)
    }
  } catch (e) { }
})

events.forEach(event => {
  client.on(event, (e1, e2) => {
    if (e1 && e1.guild && thot.getServerData(e1.guild.id, 'enabled') === 'false') { return }
    thot.emit(`THOTFunction_${event}`, e1, e2)
  })
})

const connectingSpinner = ora('Connecting to Discord...').start()
client.login(token.token)

process.on('uncaughtException', function (err) {
  thot.error(err)
})
