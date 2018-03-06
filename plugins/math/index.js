let THOT
const math = require('mathjs')

function meval (msg) {
  try {
    let args = msg.content.split('!math ')[1]

    if (args !== undefined) {
      let m = math.eval(args).toString()
      THOT.reply(msg, 'Math', m, 431075)
    } else {
      THOT.reply(msg, 'Math Error', 'Usage: !math <Expression>', 431075)
    }
  } catch (e) {
    THOT.reply(msg, 'Math Error', e, 431075)
  }
}

function derivative (msg) {
  try {
    let args = msg.content.split('!derivative ')[1]
    let arg1 = args.split(';')[0]
    let arg2 = args.split(';')[1]

    if (arg1 !== undefined) {
      let m = math.derivative(arg1, arg2).toString()
      THOT.reply(msg, 'Math', m, 431075)
    } else {
      THOT.reply(msg, 'Math Error', 'Usage: !derivative <Expression>', 431075)
    }
  } catch (e) {
    THOT.reply(msg, 'Math Error', e, 431075)
  }
}

function init (thot) {
  THOT = thot

  math.config({
    number: 'BigNumber',
    precision: 32
  })

  THOT.on('!math', meval)
  THOT.on('!derivative', derivative)
}

module.exports = {
  init
}
