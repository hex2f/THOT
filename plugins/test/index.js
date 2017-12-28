let THOT;
let inc = 0;

const THOTUtils = require('../../THOTUtils/index.js');

function add(msg) {
	let args = THOTUtils.parseParams(msg.content, [0]);
	if(args.err) { msg.channel.send('Usage: !add <NUMBER>'); return; }
	
	inc += parseInt(msg.content.split(' ')[1]);
	msg.channel.send(`The number is now ${inc}`);
}

function sub(msg) {
	let args = THOTUtils.parseParams(msg.content, [0]);
	if(args.err) { msg.channel.send('Usage: !sub <NUMBER>'); return; }
	
	inc -= parseInt(msg.content.split(' ')[1]);
	msg.channel.send(`The number is now ${inc}`);
}


function init(thot) {
	THOT = thot;
	THOT.on('add', add);
	THOT.on('sub', sub);
}

module.exports = {
	init: init,
};
