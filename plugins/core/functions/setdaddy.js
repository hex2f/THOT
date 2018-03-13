const fs = require('fs')
const THOTUtils = require('../../../THOTUtils')

module.exports = function (msg, config, that) {
  console.log(msg.mentions.users.array[0])
  if (!that.isDaddy(msg)) { that.notMyDaddy(msg); return }

  let args = THOTUtils.parseParams(msg.content, ['', ''])

  if (args.err) { msg.channel.send('Usage: !setdaddy <usertag> <true || false>'); msg.react('🇽'); return }

  config.servers[msg.guild.id].daddy[args[0]] = args[1]
  that.config = config
  fs.writeFile('./config.json', JSON.stringify(config, null, 2))

  msg.react('✅')
}
