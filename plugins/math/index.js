let THOT
const math = require('mathjs')

function meval (msg) {
  let args = msg.content.split('!math ')[1]

  if (args !== undefined) {
    let m = math.eval(args).toString()
    THOT.reply(msg, 'Math', m, 431075)
  } else {
    THOT.reply(msg, 'Math Error', 'Usage: !math <Expression>', 431075)
  }
}

function init (thot) {
  THOT = thot
  THOT.on('!math', meval)
}

module.exports = {
  init
}
