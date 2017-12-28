const config = require('./config.json');

const EventEmitter = require('events');

class THOTBot extends EventEmitter {}
const thot = new THOTBot();

const plugins = [
	require('./plugins/test.js'),
];

thot.on('command', (msg) => {
	msg.reply('hello world')
})

const Discord = require("discord.js");
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Initializing plugins...`);
  plugins.forEach((plugin) => {
  	if(!plugin.name || !plugin.version) return;
  	
  	if(plugin.init) {
  		plugin.init(thot);
  		console.log(`Successfully loaded ${plugin.name} ${plugin.version}`);
  	} else {
  		console.warn(`${plugin.name} has no init(); Skipping.`)
  	}
  })
});

client.on('message', msg => {
	console.log(msg.content[0])
	if(msg.content[0] == config.prefix) {
		console.log(`emit ${msg.content.split(' ')[0]}`);
		thot.emit(msg.content.split(' ')[0].substr(1), msg)
	}
});

client.login(config.token);

console.log(config)
