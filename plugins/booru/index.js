let THOT

const https = require('https')
const xml2json = require('xml2js').parseString
const { URL } = require('url')
const Discord = require('discord.js')

function search (cmd, msg, c) {
  let tags = msg.content.toLowerCase().split(' ').splice(1)
  if (tags.length > 2) {
    THOT.reply(msg, 'Booru Error', 'A maximum of 2 tags allowed due to API restrictions.', 10027247)
    c([])
    return
  }
  if (tags.length === 0) {
    THOT.reply(msg, 'Booru Error', `No tags provided.\nUsage: **${cmd} <Tags>**`, 10027247)
    c([])
    return
  }

  if (typeof (tags) === 'object') { tags = tags.join(' ') }
  tags += ' -rating:safe'

  const options = new URL(`https://gelbooru.com/index.php?page=dapi&s=post&q=index&tags=${tags}&limit=100&pid=0`)

  https.get(options, (res) => {
    var body = ''

    res.on('data', (chunk) => {
      body += chunk
    })

    res.on('end', async () => {
      let response
      await xml2json(body, (e, result) => { response = result })

      if (response['posts']['$']['count'] === '0') {
        THOT.reply(msg, 'Booru Error', `No results found for **${tags}**`, 10027247)
        c([])
        return
      }

      c(response['posts']['post'])
    })
  })
}

function r34 (msg) {
  search('!r34', msg, res => {
    if (res.length === 0) { return }
    console.log(res)
    const image = res[Math.floor(Math.random() * res.length)]

    console.log(image)

    let desc = ''
    if (image['$'].source !== '') { desc += `**Source:** ${image['$'].source}\n` }
    if (image['$'].tags !== '') { desc += `**Tags:** ${image['$'].tags.replace(/\s+/g, ' ').trim()}\n` }

    const embed = new Discord.RichEmbed({
      title: 'Booru',
      description: desc,
      color: 10027247,
      url: image['$'].source.split(' ')[0]
    })
    embed.setImage(image['$'].file_url)
    msg.channel.send(embed)
  })
}

function bomb (msg) {
  search('!hentaibomb', msg, res => {
    if (res.length === 0) { return }
    const image1 = res[Math.floor(Math.random() * res.length)]
    const image2 = res[Math.floor(Math.random() * res.length)]
    const image3 = res[Math.floor(Math.random() * res.length)]

    const embed1 = new Discord.RichEmbed({ title: 'Booru', color: 10027247, url: image1['$'].source.split(' ')[0] })
    embed1.setImage(image1['$'].file_url)

    const embed2 = new Discord.RichEmbed({ title: 'Booru', color: 10027247, url: image2['$'].source.split(' ')[0] })
    embed2.setImage(image2['$'].file_url)

    const embed3 = new Discord.RichEmbed({ title: 'Booru', color: 10027247, url: image3['$'].source.split(' ')[0] })
    embed3.setImage(image3['$'].file_url)

    msg.channel.send(embed1)
    msg.channel.send(embed2)
    msg.channel.send(embed3)
  })
}

function init (thot) {
  THOT = thot
  THOT.on('!r34', r34)
  THOT.on('!hentaibomb', bomb)
}

module.exports = {
  init
}
