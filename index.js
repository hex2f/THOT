process.title = `THOT`

const path = require('path')
const Database = require('thotdb').Database
const db = new Database(path.join(__dirname, 'dbdata'), 0.1)

const { fork } = require('child_process')
const threads = []
const threadCount = 1
let roundRobin = 0

for (let i = 0; i < threadCount; i++) {
  threads[i] = fork('./THOTThread/index.js')
}

const token = require('../botToken.json')

const Discord = require('discord.js')

const client = new Discord.Client()

client.on('ready', () => {
  threads.forEach(thread => {
    thread.send({ action: 'init', thread: threads.indexOf(thread), token: token.token })
  })

  client.user.setPresence({ game: { name: 'you.', type: 3 } })
})

client.on('message', async (message) => {
  if (message.author.id === client.user.id) { return }
  const i = roundRobin % threadCount
  roundRobin += 1
  setTimeout(() => {
    threads[i].send({
      action: 'message',
      messageID: message.id,
      channelID: message.channel.id,
      guildID: message.guild.id
    })
  }, 0)
})

client.login(token.token)
