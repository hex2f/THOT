let THOT
const JsonDB = require('node-json-db')
const db = new JsonDB('triggers', true, false)

function handle (msg) {
  if (msg.content.split(' ')[0] === '!setTrigger') { return }
  try {
    const data = db.getData(`/${msg.guild.id}`)

    Object.keys(data).some(key => {
      if (msg.content.toLowerCase().indexOf(key) > -1) {
        msg.channel.send(data[key])
        return key
      }
    })
  } catch (error) {
    THOT.error(error)
    msg.react('🇽')
  };
}

function setTrigger (msg) {
  if (!THOT.isDaddy(msg.author)) {
    THOT.notMyDaddy(msg)
    return
  }

  const msgstr = msg.content
  let args = msgstr.split('!setTrigger ')[1].split('|')

  db.push(`/${msg.guild.id}/${args[0].toLowerCase()}`, args[1])

  msg.react('✅')
}

function init (thot) {
  THOT = thot
  THOT.on('THOTFunction_message', handle)
  THOT.on('!setTrigger', setTrigger)
}

module.exports = {
  init
}
