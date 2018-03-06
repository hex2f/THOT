const request = require('request')
const THOTUtils = require('../../THOTUtils/index.js')

let THOT

function fmset (msg) {
  let args = THOTUtils.parseParams(msg.content, [''])
  if (args.err) { THOT.reply(msg, 'LastFM', 'Usage: !fmset <Username>', 12189696); return }
  THOT.setUserData('lastfm_username', args[0])
  msg.react('✅')
}

function currentPlaying (msg) {
  try {
    var user = THOT.getUserData(msg.author.id, 'lastfm_username')
    request(`http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&api_key=8a3f54b3b37c3a5e0adda40da34af4fb&format=json`, (err, res, body) => {
      if (err) { throw err }
      let data = JSON.parse(body).recenttracks
      if (data == null) { THOT.reply(msg, 'LastFM', 'Invalid username. Set it using !fmset <Username>', 12189696); return }
      let str = `**Current: ${data.track[0].artist['#text']} - ${data.track[0].name}**\nPrevious: ${data.track[1].artist['#text']} - ${data.track[1].name}`
      THOT.reply(msg, `${user}'s LastFM`, str, 12189696)
    })
  } catch (error) {
    THOT.reply(msg, 'LastFM', 'You need to set your lastfm username using !fmset <Username>', 12189696)
  }
}

function init (thot) {
  THOT = thot

  THOT.on('!fm', currentPlaying)
  THOT.on('!fmset', fmset)
}

module.exports = {
  init
}
