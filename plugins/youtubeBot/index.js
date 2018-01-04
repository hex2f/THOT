let THOT;
let streamOptions = { passes: 3, bitrate: 28000 };

const THOTUtils = require('../../THOTUtils');
const YouTube = require('youtube-node');
const ytdl = require('ytdl-core');

const youTube = new YouTube();
youTube.setKey('AIzaSyCp0bWktjYaLcmrooSzlAxSuydt7zy2MEY');

function search(query, msg, cb) {
	youTube.search(query, 2, function(error, result) {
		if (error) {
			THOT.error(error);
			msg.react('🇽');
			msg.channel.send('An error occured.');
			return error;
		} else {
			if(result.items[0] == undefined) {
				msg.react('🇽');
				msg.channel.send(`${query} was not found.`);
				return;
			}
			msg.react('✅');
			cb(msg, result.items[0].id.videoId);
		}
	});
}

function play(msg) {
	let id = msg.content.split(' ')[1];
	let skip = "0s";

	if(id.indexOf('watch?v=') > -1) {
		id = id.split('watch?v=')[1];
		if(id.indexOf('&t=') > -1) {
			console.log('&t', id.split('&t=')[1])
			skip = id.split('&t=')[1];
			id = id.split('&t=')[0];
		}
	}
	if(id.indexOf('youtu.be/') > -1) {
		id = id.split('youtu.be/')[1];
		if(id.indexOf('?t=') > -1) {
			console.log('?t', id.split('?t=')[1])
			skip = id.split('?t=')[1];
			id = id.split('?t=')[0];
		}
	}

	if(!ytdl.validateID(id)) {
		let query = msg.content.split(' ');
		query.shift();
		query = query.join(' ');
		search(query, msg, playAudio);
	} else {
		console.log('before play', skip)
		playAudio(msg, id, skip);
	}
}

function youtube(msg) {
	let query = msg.content.split(' ');
	query.shift();
	query = query.join(' ');
	if(query.length > 1) {
		search(query, msg, playAudio);
	} else {
		msg.react('🇽')
	}
}

function playAudio(msg, id, skip = "0s") {
	console.log(skip)
	if (msg.member.voiceChannel) {
		try {
			let stream;
			if (skip != "0s") {
				stream = ytdl(`http://www.youtube.com/watch?v=${id}`, { begin: skip });
			} else {
				stream = ytdl(`http://www.youtube.com/watch?v=${id}`, { filter: 'audioonly' });
			}
			msg.member.voiceChannel.join()
			.then(connection => { // Connection is an instance of VoiceConnection
				const dispatcher = connection.playStream(stream, streamOptions);
				dispatcher.on('end', () => {
					msg.member.voiceChannel.leave();
				});
			})
			.catch(console.log);
		} catch(e) {
			msg.react('🇽');
			msg.channel.send('Invalid video ID.');
		}
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

function developerOptions(msg) {
	let args = THOTUtils.parseParams(msg.content, [0,0]);
	if (args.err) {msg.channel.send('usage: !options <passes> <bitrate>')}
	if(THOT.isDaddy(msg.author)) {
		streamOptions = { passes: args[0], bitrate: args[1] };
		msg.react('✅')
	} else {
		msg.reply(`You're not my daddy :triumph: :raised_hand:`)
		msg.react('😤')
		msg.react('✋')
	}
}


function init(thot) {
	THOT = thot;
	THOT.on('!play', play);
	THOT.on('!youtube', youtube);
	THOT.on('!yt', youtube);
	THOT.on('!options', developerOptions);
	THOT.on('begone', begone);
}

module.exports = {
	init: init,
};
