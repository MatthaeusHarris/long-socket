var express = require("express");
var net = require("net");
var openConnections = {};

var app = module.exports = express();

app.configure(function() {
	app.use(express.bodyParser());
});

app.listen(8000, function() {
	console.log("Listening on port %d.",8000);
});

app.post("/connect/:uuid", function(req, res, next) {
	console.log("Connection: %s", req.params.uuid);
	console.log(req.body);
	if (req.body.address) {
		var connection = openConnections[req.params.uuid] = {};
		connection.address = req.body.address;

		connection.send = [];
		connection.response = [];
		connection.lastAck = 0;
		
		connection.send.push(JSON.stringify(req.body.send));

		host = connection.address.split(":")[0];
		port = connection.address.split(":")[1];

		connection.res = res;
		connection.dataHandler = (function(buf) {
			console.log("Recieved " + buf + " from server");
			connection.response.push(buf);
			var seq = connection.response.length;
			if (connection.res) {
				console.log("Sending to client.");
				connection.res.json({"seq": connection.lastAck + 1, "res": JSON.parse(connection.response[connection.lastAck])});
				connection.res.end();
				connection.res = null;
				console.log(connection);
			} else {
				
			}
		});

		connection.server = net.createConnection(port, host, (function(connection) {
			return (function() {
				connection.sock = this;
				connection.sock.write(connection.send[0]);
				connection.sock.on('data', connection.dataHandler);
			});
		})(connection));
	} else {
		var connection = openConnections[req.params.uuid];
		connection.res = res;
		if (req.body.seq == connection.lastAck + 1) {
			connection.lastAck++;
			if (req.body.send) {
				connection.sock.write(req.body.send);
				connection.send.push(req.body.send);
			}
			if (connection.response.length > connection.lastAck) {
				connection.res.json({"seq": connection.lastAck + 1, "res": JSON.parse(connection.response[connection.lastAck])});
				connection.res.end();
				connection.res = null;
			}
		} else {
			console.log("Client did not acknowledge receipt of last blob, so we will re-send.");
			connection.res.json({"seq": connection.lastAck + 1, "res": JSON.parse(connection.response[connection.lastAck])});
			connection.res.end();
			connection.res = null;
		}
	}
});