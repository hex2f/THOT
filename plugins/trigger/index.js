let THOT

function handle (msg) {
  if (msg.content.split(' ')[0] === '!settrigger') { return }
  try {
    if (msg.guild === null) { return }
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

  if (msgstr.split('!settrigger ')[1] === undefined) {
    THOT.reply(msg, 'Trigger Error', 'Usage: !settrigger <Trigger>|<Response>')
    return
  }

  let args = msgstr.split('!settrigger ')[1].split('|')

  data[args[0].toLowerCase()] = args[1]

  THOT.setServerData(msg.guild.id, 'triggers', data)

  msg.react('✅')
}

function init (thot) {
  THOT = thot
  THOT.on('THOTFunction_message', handle)
  THOT.on('!settrigger', setTrigger)
}

module.exports = {
  init
}
