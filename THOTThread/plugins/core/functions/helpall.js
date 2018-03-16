module.exports = function (msg, THOT) {
  let str = ``
  let title = 'Available Commands'

  let tags = {}

  // str = `Usage: !help <plugin>\n\n**Installed Plugins**\n`
  THOT.plugins.forEach(plugin => {
    if (tags[plugin.tag] === undefined) {
      tags[plugin.tag] = [plugin]
    } else {
      tags[plugin.tag].push(plugin)
    }
  })

  Object.keys(tags).forEach(tag => {
    str += `**--------${tag}--------**\n`
    tags[tag].forEach(plugin => {
      str += `**${plugin.name}** ${plugin.version}\n`
      plugin.commands.forEach(command => {
        str += `\`${command.command} ${command.usage}\`\n`
      })
      str += `\n`
    })
    str += `\n\n`
  })

  if (str.length === 0) {
    str = 'No plugins installed.'
  }

  const embed = new THOT.Discord.RichEmbed({
    title,
    description: str,
    color: 11253955
  })

  msg.author.send(embed)
  msg.channel.send('Check your DM\'s')
}
