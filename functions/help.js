module.exports = function (msg, plugins, cb) {
  let str = ``
  const arg = msg.content.split(' ')[1]

  if (arg === undefined) {
    str = `Usage: !help <plugin>\n\n**Installed Plugins**\n`
    plugins.forEach(plugin => {
      str += `**${plugin.name}** ${plugin.version}\n`
    })
    if (str.length === 0) {
      str = 'No plugins installed.'
    }
  } else {
    let plugin = plugins.find(p => p.name.toLowerCase() === arg.toLowerCase())
    if (plugin === undefined) {
      str = `Usage: !help <plugin>\n\n**Installed Plugins**\n`
      plugins.forEach(plugin => {
        str += `**${plugin.name}** ${plugin.version}\n`
      })
    } else {
      str = `**${plugin.name}'s commands:**\n`
      plugin.commands.forEach(command => {
        str += `**${command.command}** ${command.usage}\n`
      })
    }
  }

  cb(msg, 'Available Commands', str)
}
