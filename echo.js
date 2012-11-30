var net = require('net');

var server = net.createServer(function(sock) {
	console.log("New connection.");
	sock.on('data', function(buf) {
		setTimeout(function() {
			this.write(buf);	
		}.bind(this), 2000);
		
	});
	sock.on('end', function() {
		console.log("Connection terminated.");
	});
}).listen(8888);
