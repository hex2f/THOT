let THOT;

const THOTUtils = require('../../THOTUtils');
const ytdl = require('ytdl-core');

function play(msg) {
	let args = THOTUtils.parseParams(msg.content, [""]);
	if(args.err) { msg.channel.send('Usage: !play <YOUTUBE ID>'); return; }
	
	if (msg.member.voiceChannel) {
		msg.member.voiceChannel.join()
		.then(connection => { // Connection is an instance of VoiceConnection
			const stream = ytdl(`http://www.youtube.com/watch?v=${args[0]}`);
			const dispatcher = connection.playStream(stream);
			dispatcher.on('end', () => {
				msg.member.voiceChannel.leave();
			});
		})
		.catch(console.log);
	} else {
		msg.reply('You need to join a voice channel first!');
	}
}

function begone(msg) {
	if (msg.member.voiceChannel) {
		msg.channel.send('no thots :flushed: :flushed: :flushed:');
		msg.member.voiceChannel.leave();
	} else {
		msg.channel.send('but DADDY OwO');
	}
}


function init(thot) {
	THOT = thot;
	THOT.on('!play', play);
	THOT.on('begone', begone);
}

module.exports = {
	init: init,
};
