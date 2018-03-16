let THOT

async function handle (msg) {
  try {
    let points = THOT.getUserData(msg.author.id, 'points')
    if (points === undefined) { points = 0 }
    THOT.setUserData(msg.author.id, 'points', points + 1)
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
    let points = THOT.getUserData(user.id, 'points')
    if (points === undefined) { points = 0 }
    console.log(user.username)
    THOT.reply(
      msg,
      `${user.username.toString()}'s points`,
      `${user.username.toString()} has ${points} points.`,
      431075
    )
  } catch (error) {
    THOT.error(error)
  };
}

function init (thot) {
  THOT = thot
  THOT.on('THOTFunction_message', handle)
  THOT.on('!points', getPoints)
}

module.exports = {
  init
}
