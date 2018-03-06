let THOT

function handle (msg) {
  if (msg.content.split(' ')[0] === '!setTrigger') { return }
  try {
    const data = THOT.getServerData(msg.guild.id, 'triggers')

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
  if (!THOT.isDaddy(msg)) {
    THOT.notMyDaddy(msg)
    return
  }

  let data = THOT.getServerData(msg.guild.id, 'triggers')
  if (data === undefined) { data = {} }

  const msgstr = msg.content
  let args = msgstr.split('!setTrigger ')[1].split('|')

  data[args[0].toLowerCase()] = args[1]

  THOT.setServerData(msg.guild.id, 'triggers', data)

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
