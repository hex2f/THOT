let THOT

function poll (msg) {
  msg.react('✅')
  msg.react('🇽')
}

function init (thot) {
  THOT = thot
  THOT.on('!qp', poll)
}

module.exports = {
  init
}
