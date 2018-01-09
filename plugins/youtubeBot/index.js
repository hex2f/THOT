let THOT;
let streamOptions = { passes: 3, bitrate: 28000 };

const THOTUtils = require('../../THOTUtils');
const YouTube = require('youtube-node');
const ytdl = require('ytdl-core');

let yt = {};

const youTube = new YouTube();
youTube.setKey('AIzaSyCp0bWktjYaLcmrooSzlAxSuydt7zy2MEY');

function search(query, msg, cb) {
	youTube.search(query, 2, function(error, result) {
		if (error) {
			THOT.error(error);
			THOT.reply(msg, 'Music Error', 'An error occured.');
			return error;
		} else {
			if(result.items[0] == undefined) {
				THOT.reply(msg, 'Music Error', `${query} was not found.`);
				return;
			}
			cb(msg, result.items[0].id.videoId, result.items[0].snippet.title);
		}
	});
}

function play(msg) {
	let id = msg.content.split(' ')[1];
	let skip = "0s";

	if(!msg.member.voiceChannel) {msg.reply('You need to join a voice channel first!'); return;}
	
	const vc = msg.member.voiceChannel;

	if(yt[vc.id] == undefined) { yt[vc.id] = {vc: vc, queue: [], dispatcher: null}; }

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
		search(query, msg, (msg, id, name)=>{
			yt[vc.id].queue.push({id, skip, name})
			THOT.reply(msg, 'Music Queue', `Added **${name}** to the queue.`)
			if(yt[vc.id].queue.length == 1) {
				playQueue(vc, id, skip, name);
			}
		});
	} else {
		youTube.getById(id, function(error, result) {
			if (error) {
				THOT.reply(msg, 'Music Error', 'Invalid video.');
				return;
			} else {
				console.log(yt[vc.id].queue)
				yt[vc.id].queue.push({id, skip, name: result.items[0].snippet.title})
				console.log(yt[vc.id].queue)
				THOT.reply(msg, 'Music Queue', `Added **${result.items[0].snippet.title}** to the queue.`)
				if(yt[vc.id].queue.length == 1) {
					playQueue(vc, id, skip, result.items[0].snippet.title);
				}
			}
		});
	}
}

function youtube(msg) {
	if(!msg.member.voiceChannel) {msg.reply('You need to join a voice channel first!'); return;}
	
	const vc = msg.member.voiceChannel;
	
	let query = msg.content.split(' ');
	query.shift();
	query = query.join(' ');
	if(query.length > 1) {
		search(query, msg, (msg, id, name)=>{
			yt[vc.id].queue.push({id, skip, name})
			THOT.reply(msg, 'Music Queue', `Added **${name}** to the queue.`)
			if(yt[vc.id].queue.length == 1) {
				playQueue(vc, id, skip, name);
			}
		});
	} else {
		msg.react('🇽')
	}
}

function playQueue(vc, id, skip = "0s", name) {
	try {
		let msg = {channel: THOT.client.channels.get(THOT.config.home)};
		THOT.reply(msg, 'Music Queue', `Playing **${name}**`);
		let stream;
		if (skip != "0s") {
			stream = ytdl(`https://www.youtube.com/watch?v=${id}`, { begin: skip });
		} else {
			stream = ytdl(`https://www.youtube.com/watch?v=${id}`, { filter: 'audioonly' });
		}
		yt[vc.id].vc.join()
		.then(connection => { // Connection is an instance of VoiceConnection
			yt[vc.id].dispatcher = connection.playStream(stream, streamOptions);
			yt[vc.id].dispatcher.on('end', () => {
				yt[vc.id].queue.shift();
				if(yt[vc.id].queue.length == 0) {
					yt[vc.id].vc.leave();
				} else {
					setTimeout(()=>{
						playQueue(vc, yt[vc.id].queue[0].id, yt[vc.id].queue[0].skip, yt[vc.id].queue[0].name);
					}, 250);
				}
			});
		})
		.catch(THOT.error);
	} catch(e) {
		THOT.error(e);
		yt[vc.id].queue.shift();
		if(yt[vc.id].queue.length == 0) {
			yt[vc.id].vc.leave();
		} else {
			setTimeout(()=>{
				playQueue(vc, yt[vc.id].queue[0].id, yt[vc.id].queue[0].skip, yt[vc.id].queue[0].name);
			}, 250);
		}
	}
}

function begone(msg) {
	if (msg.member.voiceChannel) {
		msg.member.voiceChannel.leave();
	} else {
		THOT.reply(msg, 'OwO', 'but DADDY OwO');
	}
}

function skip(msg) {
	let vc = msg.member.voiceChannel;
	if(vc == undefined) {return;}
	if(!THOT.isDaddy(msg.author)) {
		THOT.notMyDaddy(msg);
		return;
	}
	if(yt[vc.id].queue.length > 0) {
		THOT.reply(msg, 'Music Queue', `Skipped **${yt[vc.id].queue[0].name}**`)
		if(yt[vc.id].dispatcher) {
			yt[vc.id].dispatcher.end();
		}
	}
}

function clear(msg) {
	let vc = msg.member.voiceChannel;
	if(vc == undefined) {return;}
	if(!THOT.isDaddy(msg.author)) {
		THOT.notMyDaddy(msg);
		return;
	}
	if(yt[vc.id].queue.length > 0) {
		yt[vc.id].queue = [];
		if(yt[vc.id].dispatcher) {
			yt[vc.id].dispatcher.end();
		}
		THOT.reply(msg, 'Music Queue', '**Cleared the queue.**')
	}
}

function developerOptions(msg) {
	let args = THOTUtils.parseParams(msg.content, [0,0]);
	if (args.err) {THOT.reply(msg, 'Usage Error', 'Usage: !options <passes> <bitrate>')}
	if(THOT.isDaddy(msg.author)) {
		streamOptions = { passes: args[0], bitrate: args[1] };
		msg.react('✅')
	} else {
		THOT.notMyDaddy(msg);
	}
}

function sendQueue(msg) {
	let vc = msg.member.voiceChannel;
	if(vc == undefined) {return;}
	let str = ``;
	yt[vc.id].queue.forEach(song => {
		str += `**${song.name}**\n`;
	});
	if(str.length > 0) {
		THOT.reply(msg, 'Music Queue', str);
	} else {
		THOT.reply(msg, 'Music Queue', '**There are no songs in the queue.**');		
	}
}

function init(thot) {
	THOT = thot;
	THOT.on('!play', play);
	THOT.on('!youtube', youtube);
	THOT.on('!yt', youtube);
	THOT.on('!options', developerOptions);
	THOT.on('!queue', sendQueue);
	THOT.on('!clear', clear);
	THOT.on('!skip', skip);
	THOT.on('begone', begone);
}

module.exports = {
	init: init,
};
