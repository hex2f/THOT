let THOT;
let inc = 0;

function add(msg) {
	if(isNaN(parseInt(msg.content.split(' ')[1]))) {msg.channel.send('Usage: !add <NUMBER>'); return;}
	
	inc += parseInt(msg.content.split(' ')[1]);
	msg.channel.send(`The number is now ${inc}`);
}

function sub(msg) {
	if(isNaN(parseInt(msg.content.split(' ')[1]))) {msg.channel.send('Usage: !sub <NUMBER>'); return;}
	
	inc -= parseInt(msg.content.split(' ')[1]);
	msg.channel.send(`The number is now ${inc}`);
}


function init(thot) {
	THOT = thot;
	THOT.on('add', add);
	THOT.on('sub', sub);
}

module.exports = {
	name: 'Test',
	version: 'v1.0',
	init: init,
};
