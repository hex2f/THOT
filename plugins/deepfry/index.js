let THOT

const THOTUtils = require('../../THOTUtils/index.js')
const Jimp = require('jimp')
const imgurUploader = require('imgur-uploader')

const getPixels = require('get-pixels')
const tracking = require('jstracking')

let prevImages = {}

const actions = {
  jpeg: { parse: ['', 0], usage: '<Image URL> <Quality 1-100>' },
  scale: { parse: ['', 0], usage: '<Image URL> <Factor>' },
  pixelate: { parse: ['', 0], usage: '<Image URL> <Size>' },
  brightness: { parse: ['', 0], usage: '<Image URL> <Number between -1 and +1>' },
  contrast: { parse: ['', 0], usage: '<Image URL> <Number between -1 and +1>' },
  invert: { parse: [''], usage: '<Image URL>' },
  fry: { parse: ['', 0], usage: '<Image URL> <Amount of Oil 1-100>' }
}

function track (msg, totrack, image, cb) {
  let args = THOTUtils.parseParams(msg.content, [''])

  if (args.err) {
    msg.react('🇽'); msg.channel.send(`Usage: **!eyes <Image URL>**`); return
  }

  if (msg.embeds[0] && !msg.embeds[0].thumbnail.url) {
    msg.react('🇽'); msg.channel.send('Sorry but i could not find that image.'); return
  }

  if (args[0] === '.') {
    if (prevImages[msg.author.id]) {
      msg.embeds[0] = {}
      msg.embeds[0].thumbnail = {}
      msg.embeds[0].thumbnail.url = prevImages[msg.author.id]
    } else {
      msg.react('🇽'); msg.channel.send('Sorry but i could not find your previous image.'); return
    }
  } else if (!msg.embeds[0]) {
    cb(new Error(), {})
  }
  msg.react('⌛')

  const tracker = new tracking.ObjectTracker(totrack)

  tracker.on('track', event => cb(null, event))

  tracker.track(image.bitmap.data, image.bitmap.width, image.bitmap.height)
}

function eyes (m) {
  let retryCount = 0
  const tryload = (msg) => {
    try {
      Jimp.read(msg.embeds[0].thumbnail.url, function (e, image) {
        if (e) { msg.react('🇽'); msg.channel.send('Error: ' + e); return }
        let mime = Jimp.AUTO
        image.scaleToFit(512, 512)

        const handleEvent = (err, event) => {
          if (err && retryCount < 4) {
            retryCount++
            setTimeout(() => tryload(msg), 500)
          } else {
            if (err) { msg.react('🇽'); msg.channel.send('Error: ' + err); return }

            Jimp.read(`${__dirname}/flare.png`, function (err, flare) {
              if (err) throw err
              flare.scaleToFit(image.bitmap.width, image.bitmap.height)

              event.data.forEach(eye => {
                image.composite(flare, eye.x + (eye.width / 2) - (flare.bitmap.width / 2), eye.y + (eye.height / 2) - (flare.bitmap.height / 2))
              })

              image.getBuffer(mime, (err, buffer) => {
                if (err) { THOT.error(err); return }
                imgurUploader(buffer, {title: `THOT - EYES by ${msg.author.username}`}).then(data => {
                  msg.react('✅')
                  setTimeout(() => {
                    prevImages[msg.author.id] = data.link
                    msg.channel.send(data.link)
                  }, 150)
                })
              })
            })
          }
        }

        track(msg, 'eye', image, handleEvent)
      })
    } catch (e) {
      if (retryCount < 5) {
        retryCount++
        setTimeout(() => tryload(msg), 500)
      } else {
        msg.react('🇽'); msg.channel.send('Error: ' + e)
      }
    }
  }

  tryload(m)
}

function face (m) {
  let retryCount = 0
  const tryload = (msg) => {
    try {
      Jimp.read(msg.embeds[0].thumbnail.url, function (e, image) {
        if (e) { msg.react('🇽'); msg.channel.send('Error: ' + e); return }
        let mime = Jimp.AUTO
        image.scaleToFit(512, 512)

        const handleEvent = (err, event) => {
          if (err && retryCount < 4) {
            retryCount++
            setTimeout(() => tryload(msg), 500)
          } else {
            if (err) { msg.react('🇽'); msg.channel.send('Error: ' + err); return }

            Jimp.read(`${__dirname}/cry.png`, function (err, cry) {
              if (err) throw err

              event.data.forEach(face => {
                cry.scaleToFit(face.height * 1.2, face.height * 1.2)
                image.composite(cry, face.x + (face.width / 2) - (cry.bitmap.width / 2), face.y + (face.height / 2) - (cry.bitmap.height / 2))
              })

              image.getBuffer(mime, (err, buffer) => {
                if (err) { THOT.error(err); return }
                imgurUploader(buffer, {title: `THOT - EYES by ${msg.author.username}`}).then(data => {
                  msg.react('✅')
                  setTimeout(() => {
                    prevImages[msg.author.id] = data.link
                    msg.channel.send(data.link)
                  }, 150)
                })
              })
            })
          }
        }

        track(msg, 'face', image, handleEvent)
      })
    } catch (e) {
      if (retryCount < 5) {
        retryCount++
        setTimeout(() => tryload(msg), 500)
      } else {
        msg.react('🇽'); msg.channel.send('Error: ' + e)
      }
    }
  }

  tryload(m)
}

function emojis (m) {
  let retryCount = 0
  m.react('⌛')
  const tryload = (msg) => {
    try {
      let args = THOTUtils.parseParams(msg.content, ['', 0])
      if (args.err) {
        msg.react('🇽'); msg.channel.send(`Usage: **!emojis <Image URL> <Size 1-100>**`); return
      }

      if (args[0] === '.') {
        if (prevImages[msg.author.id]) {
          msg.embeds[0] = {}
          msg.embeds[0].thumbnail = {}
          msg.embeds[0].thumbnail.url = prevImages[msg.author.id]
        } else {
          msg.react('🇽'); msg.channel.send('Sorry but i could not find your previous image.'); return
        }
      } else if (!msg.embeds[0]) {
        msg.react('🇽'); msg.channel.send('Seems like you didn\'t attach an image :thinking:.'); return
      }

      Jimp.read(`${__dirname}/b.png`, function (err, bemoji) {
        if (err) { msg.react('🇽'); msg.channel.send('Error: ' + err); return }

        Jimp.read(`${__dirname}/cry.png`, function (err, cryemoji) {
          if (err) { msg.react('🇽'); msg.channel.send('Error: ' + err); return }

          Jimp.read(msg.embeds[0].thumbnail.url, function (e, image) {
            bemoji.rotate(Math.floor(Math.random() * 90) - 45)
            bemoji.resize(Jimp.AUTO, (Math.floor(Math.random() * image.bitmap.width / 2) + 50) * (args[1] / 100))

            cryemoji.rotate(Math.floor(Math.random() * 90) - 45)
            cryemoji.resize(Jimp.AUTO, (Math.floor(Math.random() * image.bitmap.width / 2) + 50) * (args[1] / 100))

            image.composite(bemoji,
              Math.floor(Math.random() * (image.bitmap.width - image.bitmap.width / 4)) + image.bitmap.width / 4 - bemoji.bitmap.width,
              Math.floor(Math.random() * (image.bitmap.height - image.bitmap.height / 4)) + image.bitmap.height / 4 - bemoji.bitmap.height)

            image.composite(cryemoji,
              Math.floor(Math.random() * (image.bitmap.width - image.bitmap.width / 4)) + image.bitmap.width / 4 - bemoji.bitmap.width,
              Math.floor(Math.random() * (image.bitmap.height - image.bitmap.height / 4)) + image.bitmap.height / 4 - bemoji.bitmap.height)

            image.getBuffer(Jimp.AUTO, (err, buffer) => {
              if (err) { THOT.error(err); return }
              imgurUploader(buffer, {title: `THOT - emojis by ${msg.author.username}`}).then(data => {
                msg.react('✅')
                setTimeout(() => {
                  prevImages[msg.author.id] = data.link
                  msg.channel.send(data.link)
                }, 150)
              })
            })
          })
        })
      })
    } catch (e) {
      if (retryCount < 5) {
        retryCount++
        setTimeout(() => tryload(msg), 500)
      } else {
        msg.react('🇽'); msg.channel.send('Error: ' + e)
      }
    }
  }

  tryload(m)
}

function image (action, msg) {
  setTimeout(() => {
    let args = THOTUtils.parseParams(msg.content, actions[action].parse)

    if (args.err) {
      msg.react('🇽'); msg.channel.send(`Usage: **!${action} ${actions[action].usage}**`); return
    }

    if (msg.embeds[0] && !msg.embeds[0].thumbnail.url) {
      msg.react('🇽'); msg.channel.send('Sorry but i could not find that image.'); return
    }

    if (args[0] === '.') {
      if (prevImages[msg.author.id]) {
        msg.embeds[0] = {}
        msg.embeds[0].thumbnail = {}
        msg.embeds[0].thumbnail.url = prevImages[msg.author.id]
      } else {
        msg.react('🇽'); msg.channel.send('Sorry but i could not find your previous image.'); return
      }
    } else if (!msg.embeds[0]) {
      msg.react('🇽'); msg.channel.send('You didn\'t seem to attach an image 🤔'); return
    }

    msg.react('⌛')

    Jimp.read(msg.embeds[0].thumbnail.url, function (err, image) {
      let mime = Jimp.AUTO
      if (err) { msg.react('🇽'); msg.channel.send('Error: ' + err); return }

      switch (action) {
        case 'jpeg':
          image.quality(args[1])
          mime = Jimp.MIME_JPEG
          break
        case 'scale':
          image.scale(args[1])
          break
        case 'pixelate':
          image.pixelate(args[1])
          break
        case 'brightness':
          image.brightness(args[1])
          break
        case 'contrast':
          image.contrast(args[1])
          break
        case 'invert':
          image.invert()
          break
        case 'fry':
          image.quality(1)
          image.contrast(1)
          image.color([
            { apply: 'brighten', params: [args[1] / 5] },
            { apply: 'saturate', params: [100] }
          ])
          image.quality(1)
          break
        default:
          break
      }

      image.getBuffer(mime, (err, buffer) => {
        if (err) { THOT.error(err); return }
        imgurUploader(buffer, {title: `THOT - ${action} by ${msg.author.username}`}).then(data => {
          msg.react('✅')
          setTimeout(() => {
            prevImages[msg.author.id] = data.link
            msg.channel.send(data.link)
          }, 150)
        })
      })
    })
  }, 500)
}

function init (thot) {
  THOT = thot
  THOT.on('!jpeg', msg => image('jpeg', msg))
  THOT.on('!scale', msg => image('scale', msg))
  THOT.on('!pixelate', msg => image('pixelate', msg))
  THOT.on('!brightness', msg => image('brightness', msg))
  THOT.on('!contrast', msg => image('contrast', msg))
  THOT.on('!invert', msg => image('invert', msg))
  THOT.on('!fry', msg => image('fry', msg))

  THOT.on('!eyes', msg => eyes(msg))
  THOT.on('!face', msg => face(msg))
  THOT.on('!emojis', msg => emojis(msg))
}

module.exports = {
  init: init
}
