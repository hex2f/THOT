const fs = require('fs')

function findPlugins() {
	let plugins = []
	
	fs.readdirSync('./plugins').forEach((plugin)=>{
		console.log('Searching for plugins...')
		if(require(`./plugins/${plugin}/plugin.json`)) {
			const pluginConf = require(`./plugins/${plugin}/plugin.json`)
			if(!pluginConf.name || !pluginConf.version || !pluginConf.entry) {return}
			console.log(`found ${pluginConf.name} ${pluginConf.version}`)
			plugins.push(require(`./plugins/${plugin}/${pluginConf.entry}`))
		}
	})
	
	console.log(plugins)
	
	return plugins;
}

function initPlugins(plugins, thot) {
  plugins.forEach((plugin) => {
  	if(!plugin.name || !plugin.version) {return}
  	
  	if(plugin.init) {
  		plugin.init(thot)
  		console.log(`Successfully loaded ${plugin.name} ${plugin.version}`)
  	} else {
  		console.warn(`${plugin.name} has no init() Skipping.`)
  	}
  })
}

module.exports = {
	find: findPlugins,
	init: initPlugins,
}
