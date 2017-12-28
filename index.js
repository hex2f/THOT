const config = require('./config.json');

const EventEmitter = require('events');

class THOTBot extends EventEmitter {}
const thot = new THOTBot();

thot.on('command', (msg) => {
	msg.reply('hello world')
})

const Discord = require("discord.js");
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
	console.log(msg.content[0])
	if(msg.content[0] == config.prefix) {
		thot.emit('command', msg)
	}
});

client.login(config.token);

console.log(config)
