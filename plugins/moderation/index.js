let THOT
const THOTUtils = require('../../THOTUtils/index.js')

function purge (msg) {
  try {
    let args = THOTUtils.parseParams(msg.content, [0])
    if (args.err) { THOT.reply(msg, 'Usage Error', 'Usage: `!purge <Amount of Messages>`'); return }

    msg.channel.fetchMessages({limit: args[0]})
      .then(messages => {
        msg.channel.bulkDelete(messages.array())
      })
  } catch (e) {
    THOT.error(e)
    THOT.reply(msg, 'Error', e)
  }
}

function selectPurge (msg) {
  try {
    let hasPurged = false
    THOT.reply(msg, 'Select Purge', 'Select the message you want to purge until by reacting to it with :x: `:x:`\nThis function will timeout in 60 seconds.')
    const onReact = (reaction, user) => {
      console.log(reaction.emoji.toString(), user.id)
      if (user.id === msg.author.id) {
        THOT.removeListener('THOTFunction_messageReactionAdd', onReact)

        reaction.message.channel.fetchMessages({after: reaction.message.id})
        .then(messages => {
          reaction.message.channel.bulkDelete(messages.array())
          reaction.message.delete()
          hasPurged = true
        })
      }
    }
    THOT.on('THOTFunction_messageReactionAdd', onReact)
    setTimeout(() => {
      if (!hasPurged) {
        THOT.reply(msg, 'Select Purge', `<@${msg.author.id}> your purge has timed out.`)
        THOT.removeListener('THOTFunction_messageReactionAdd', onReact)
      }
    }, 1000 * 60)
  } catch (e) {
    THOT.error(e)
    THOT.reply(msg, 'Error', e)
  }
}

function init (thot) {
  THOT = thot
  THOT.on('!purge', purge)
  THOT.on('!selectpurge', selectPurge)
}

module.exports = {
  init
}
