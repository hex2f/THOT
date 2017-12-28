const config = require('./config.json')
let plugins = require('./plugins.js').find()

const EventEmitter = require('events')

class THOTBot extends EventEmitter {}
const thot = new THOTBot()

thot.on('hi', (msg) => {
	msg.reply('hello world')
})

const Discord = require("discord.js")
const client = new Discord.Client()

client.on('ready', () => {
  console.log(`Connected to Discord as ${client.user.tag}.`)
  console.log(`Initializing plugins...`)
  require('./plugins.js').init(plugins, thot)
})

client.on('message', msg => {
	console.log(msg.content[0])
	if(msg.content[0] == config.prefix) {
		console.log(`emit ${msg.content.split(' ')[0]}`)
		thot.emit(msg.content.split(' ')[0].substr(1), msg)
	}
})

client.login(config.token)
