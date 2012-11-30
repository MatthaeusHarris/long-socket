var http = require("http");
var net = require("net");

http.createServer(function(request, response) {
	setTimeout(function() {
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.end("Hello, world.");
	});
}).listen(8000);