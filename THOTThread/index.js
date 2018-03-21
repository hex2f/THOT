const moment = require('moment')

const Client = require('thotdb').Client
const db = new Client('ws://localhost:28375', 'PASSWORD')

const Discord = require('discord.js')
class BetterClient extends Discord.Client {
  get browser () { return false }
}
let client = new BetterClient()
let thread

function log (str) {
  console.log(`\x1b[3${thread.id % 7 + 1}m`, `[THREAD_${thread.id} @ ${moment().format('hh:mm:ss:SSS')}]\x1b[0m ${str}`)
}

client.on('ready', () => {
  thread.plugins = require('./plugins.js').find((pl) => {})

  require('./plugins.js').init(thread.plugins, thread, (err, pl) => {
    if (err) { log(`${pl.name} does not export an init function. Skipping.`); return }
    log(`Successfully loaded ${pl.name} ${pl.version}`)
  })
  log(`thread is now ready`)
})

const EventEmitter = require('events')

class THOTThread extends EventEmitter {
  async handleMessage (data, retries) {
    let guild = client.guilds.get(data.guildID)
    let channel = guild.channels.get(data.channelID)
    let message = channel.messages.get(data.messageID)

    if (message === undefined) {
      setTimeout(() => this.handleMessage(data, retries + 1), 50)
    } else {
      this.emit(message.content.split(' ')[0], message)
    }
  }
  async setUserData (sid, key, value) {
    let dbdata = db.get('userdata', sid)
    if (!dbdata) { dbdata = {} }

    dbdata[key] = value
    await db.set('userdata', sid, dbdata)
    return dbdata
  }
  async getUserData (sid, key) {
    let dbdata = await db.get('userdata', sid)
    if (!dbdata) { dbdata = {} }

    return dbdata[key]
  }
  async setServerData (sid, key, value) {
    let dbdata = db.get('servers', sid)
    if (!dbdata) { dbdata = {} }

    dbdata[key] = value
    await db.set('servers', sid, dbdata)
    return dbdata
  }
  async getServerData (sid, key) {
    let dbdata = await db.get('servers', sid)
    if (!dbdata) { dbdata = {} }

    return dbdata[key]
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
}

process.on('message', (data) => {
  try {
    if (data.action === 'init') {
      thread = new THOTThread()
      thread.id = data.thread
      thread.client = client

      process.title = `THOT_THREAD_${thread.id}`
      client.login(data.token)
      log(`Initializing thread`)
    }

    if (data.action === 'message') {
      thread.handleMessage(data, 0)
    }
  } catch (e) {

  }
})
