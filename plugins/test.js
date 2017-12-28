let THOT;
let inc = 0;

function add(msg) {
	inc++;
	msg.channel.send(`The number is now ${inc}`);
}

function init(thot) {
	THOT = thot;
	THOT.on('add', add);
}

module.exports = {
	name: 'Test',
	version: 'v1.0',
	init: init,
};
