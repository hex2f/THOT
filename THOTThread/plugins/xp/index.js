let THOT

async function handle (msg) {
  try {
    console.log(msg.content)
    let emojisraw = msg.content.match(/\<.*\>/g)
    let emojis = THOT.getUserData(msg.author.id, 'emojis')
    if (emojis === undefined) { emojis = {} }
    if (emojisraw) {
      emojisraw.forEach(emoji => {
        let emojiid = (emoji.split(':').pop()).slice(0, -1)
        if (!isNaN(parseInt(emojiid))) {
          if (emojis[emojiid] === undefined) { emojis[emojiid] = {emoji, uses: 0} }
          emojis[emojiid].uses += 1
        }
      })

      THOT.setUserData(msg.author.id, 'emojis', emojis)
    }

    let points = THOT.getUserData(msg.author.id, 'xp')
    if (points === undefined) { points = 0 }
    THOT.setUserData(msg.author.id, 'xp', points + 1)
  } catch (error) {
    THOT.error(error)
  };
}

async function getPoints (msg) {
  let user = msg.mentions.users.array()[0]
  console.log(msg.mentions.users.array()[0])
  if (user === undefined) {
    user = msg.author
  }

  try {
    let points = THOT.getUserData(user.id, 'xp')
    if (points === undefined) { points = 0 }
    console.log(user.username)
    THOT.reply(
      msg,
      `${user.username.toString()}'s xp`,
      `${user.username.toString()} has ${points} xp.`,
      431075
    )
  } catch (error) {
    THOT.error(error)
  };
}

async function getTopEmojis (msg) {
  let user = msg.mentions.users.array()[0]
  console.log(msg.mentions.users.array()[0])
  if (user === undefined) {
    user = msg.author
  }

  try {
    let emojis = THOT.getUserData(user.id, 'emojis')
    if (emojis === undefined) { emojis = {} }

    let max = []
    Object.keys(emojis).forEach(emoji => {
      max.push(emojis[emoji])
    })

    max = max.reduce((x, y) => {
      return (x.uses > y.uses) ? x : y
    })

    console.log(user.username)
    console.log(max)
    msg.react((max.emoji.split(':').pop()).slice(0, -1))
  } catch (error) {
    THOT.error(error)
  };
}

function init (thot) {
  THOT = thot
  THOT.on('THOTFunction_message', handle)
  THOT.on('!points', getPoints)
  THOT.on('!topemoji', getTopEmojis)
}

module.exports = {
  init
}
