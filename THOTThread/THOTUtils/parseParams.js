function parseNumber(str) {
	let num = parseFloat(str);
	if(isNaN(num)) {num = 0;}
	
	return num;
}

function parse(str, expected) {
	let strsplit = str.split(' ');
	strsplit.shift();
	
	let args = [];
	
	if(strsplit.length != expected.length) {
		return { err: 'Length Mismatch' }
	}
	
	expected.forEach((exp, index)=>{
		switch(typeof(exp)) {
			case "number":
				args.push(parseNumber(strsplit[index]))
				break;
			case "string":
				args.push(strsplit[index])
				break;
			default:
				return { err: 'Invalid Type' }
				break;
		}
	})
	
	return args;
}

module.exports = parse;
