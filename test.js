const Discord = require('discord.js')
const ytdl = require('ytdl-core')

const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
const clientToken = 'Mzg3MzI0ODE4ODUwMzE2Mjkx.DXwf0g.oPgHjnhhrK39xnU5S7e_ZtuwSAg'

const client = new Discord.Client()
client.login(clientToken)

client.on('ready', () => {
  console.log('discord.js client ready')
})

client.on('message', message => {
  if (message.content.startsWith('++play')) {
    console.log('Got a song request!')
    const voiceChannel = message.member.voiceChannel
    voiceChannel.join()
      .then(connection => {
        const stream = ytdl(url, { filter: 'audioonly' })
        const dispatcher = connection.playStream(stream)
        dispatcher.on('end', () => {
          voiceChannel.leave()
        })
      })
  }
})
