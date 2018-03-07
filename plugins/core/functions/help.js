module.exports = function (msg, plugins, cb) {
  let str = ``
  let title = 'Available Commands'
  const arg = msg.content.split(' ')[1]

  if (arg === undefined) {
    str = `Usage: \`!help <plugin>\`\nYou can also use \`!helpall\` to get a list of all plugins\n\n**Installed Plugins**\n`
    plugins.forEach(plugin => {
      str += `**${plugin.name}** ${plugin.version}\n`
    })
    if (str.length === 0) {
      str = 'No plugins installed.'
    }
  } else {
    let plugin = plugins.find(p => p.name.toLowerCase() === arg.toLowerCase())
    if (plugin === undefined) {
      str = `Usage: !help <plugin>\nYou can also use \`!helpall\` to get a list of all plugins\n\n**Installed Plugins**\n`
      plugins.forEach(plugin => {
        str += `**${plugin.name}** ${plugin.version}\n`
      })
    } else {
      title = `${plugin.name}'s commands:`
      plugin.commands.forEach(command => {
        str += `**${command.command}** ${command.usage}\n`
      })
    }
  }

  cb(msg, title, str)
}
