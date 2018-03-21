const fs = require('fs')

function findPlugins (cb = function () {}) {
  let plugins = []

  fs.readdirSync(__dirname + '/plugins').forEach((plugin) => {
    if (require(`./plugins/${plugin}/plugin.json`)) {
      const pluginConf = require(`./plugins/${plugin}/plugin.json`)
      if (!pluginConf.name || !pluginConf.version || !pluginConf.entry) { return }
      const tempPlugin = require(`./plugins/${plugin}/${pluginConf.entry}`)
      tempPlugin.name = pluginConf.name
      tempPlugin.version = pluginConf.version
      if (pluginConf.commands) {
        tempPlugin.commands = pluginConf.commands
      } else {
        tempPlugin.commands = []
      }
      if (pluginConf.tag) {
        tempPlugin.tag = pluginConf.tag
      } else {
        tempPlugin.tag = 'General'
      }
      plugins.push(tempPlugin)
      cb(pluginConf)
    }
  })

  return plugins
}

function initPlugins (plugins, thot, cb = function () {}) {
  plugins.forEach((plugin) => {
    if (plugin.init) {
      plugin.init(thot)
      cb(null, plugin)
    } else {
      cb(new Error(), plugin)
    }
  })
}

module.exports = {
  find: findPlugins,
  init: initPlugins
}
