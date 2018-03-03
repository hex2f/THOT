let THOT

const THOTUtils = require('../../THOTUtils/index.js')
const Jimp = require('jimp')
const imgurUploader = require('imgur-uploader')

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
    Jimp.read(`${__dirname}/b.png`, function (err, bemoji) {
      if (err) { msg.react('🇽'); msg.channel.send('Error: ' + err); return }

      Jimp.read(`${__dirname}/cry.png`, function (err, cryemoji) {
        if (err) { msg.react('🇽'); msg.channel.send('Error: ' + err); return }

        Jimp.read(msg.embeds[0].thumbnail.url, function (err, image) {
          if (err) { msg.react('🇽'); msg.channel.send('Error: ' + err); return }

          switch (action) {
            case 'jpeg':
              image.quality(args[1])
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

          image.getBuffer(Jimp.AUTO, (err, buffer) => {
            if (err) { THOT.error(err); return }
            imgurUploader(buffer, {title: `THOT - JPEG by ${msg.author.username}`}).then(data => {
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
}

module.exports = {
  init: init
}
