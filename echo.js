var net = require('net');

var server = net.createServer(function(sock) {
	var timeout1, timeout2;
	console.log("New connection.");
	sock.on('data', function(buf) {
		timeout1 = setTimeout(function() {
			this.write(buf);	
		}.bind(this), 2000);
		timeout2 = setTimeout(function() {
			this.write(buf);
		}.bind(this), 3000);
		
	});
	sock.on('end', function() {
		console.log("Connection terminated.");
		clearTimeout(timeout1);
		clearTimeout(timeout2);
	});
}).listen(8888);
