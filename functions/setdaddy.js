const fs = require('fs')
const THOTUtils = require('./THOTUtils')

module.exports = function (msg, config, that) {
  if (!that.isDaddy(msg.author)) { this.notMyDaddy(msg); return }
  let args = THOTUtils.parseParams(msg.content, ['', ''])
  if (args.err) { msg.channel.send('Usage: !setdaddy <true || false> <usertag>'); msg.react('🇽'); return }
  config.daddy[args[1]] = args[0]
  that.config = config
  fs.writeFile('./config.json', JSON.stringify(config))
  msg.react('✅')
}
