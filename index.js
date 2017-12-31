const ora = require('ora')
const lookingSpinner = ora('Searching for plugins...').start()

const config = require('./config.json')
let plugins = require('./plugins.js').find((pl)=>{
	lookingSpinner.stopAndPersist({ symbol: '✔', text: `Found ${pl.name} ${pl.version}` })
})

lookingSpinner.succeed('Done searching for plugins.')

const EventEmitter = require('events')

class THOTBot extends EventEmitter {}
const thot = new THOTBot()

const Discord = require("discord.js")
const client = new Discord.Client()

client.on('ready', () => {
  connectingSpinner.succeed(`Connected to Discord as ${client.user.tag}.`)
  
  const initSpinner = ora('Initializing plugins...').start();
  require('./plugins.js').init(plugins, thot, (err, pl) => {
  	if(err) { initSpinner.stopAndPersist({ symbol: '⚠', text: `${pl.name} does not export an init function. Skipping.` }); return; }
  	initSpinner.stopAndPersist({ symbol: '✔', text: `Successfully loaded ${pl.name} ${pl.version}` });
  });
  
  initSpinner.succeed(`Ready.`)

  client.user.setPresence({ game: { name: 'you.', type: 3 } })
})

client.on('message', msg => {
	if(msg.author == client.user) { return; }
	thot.emit(msg.content.split(' ')[0], msg)
})

const connectingSpinner = ora('Connecting to Discord...').start()
client.login(config.token)
