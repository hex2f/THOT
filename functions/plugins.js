module.exports = function (msg, plugins, cb) {
  let str = ``
  plugins.forEach(plugin => {
    str += `**${plugin.name}** ${plugin.version}\n`
  })
  if (str.length === 0) {
    str = 'No plugins installed.'
  }

  cb(msg, 'Installed Plugins', str)
}
