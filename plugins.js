const fs = require('fs')

function findPlugins() {
	let plugins = []
	
	console.log('Searching for plugins...')
	
	fs.readdirSync('./plugins').forEach((plugin)=>{
		if(require(`./plugins/${plugin}/plugin.json`)) {
			const pluginConf = require(`./plugins/${plugin}/plugin.json`)
			if(!pluginConf.name || !pluginConf.version || !pluginConf.entry) {return}
			console.log(`Found ${pluginConf.name} ${pluginConf.version}`)
			const tempPlugin = require(`./plugins/${plugin}/${pluginConf.entry}`);
			tempPlugin.name = pluginConf.name;
			tempPlugin.version = pluginConf.version;
			plugins.push(tempPlugin)
		}
	})
	
	return plugins;
}

function initPlugins(plugins, thot) {
  plugins.forEach((plugin) => {
  	if(plugin.init) {
  		console.log(`Successfully loaded ${plugin.name} ${plugin.version}.`)
  		plugin.init(thot)
  	} else {
  		console.warn(`${plugin.name} has no init() Skipping.`)
  	}
  })
}

module.exports = {
	find: findPlugins,
	init: initPlugins,
}
