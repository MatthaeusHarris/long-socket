var request = require('request');
var uuid = require('node-uuid');

var sockUUID = uuid.v4();


function send(data, callback) {
	request(
		{
			method: 'POST',
			uri: 'http://localhost:8000/connect/' + sockUUID,
			json: data
		}, callback
	);
}

function cb(error, response, body) {
	console.log(error);
	console.log(response);
	console.log(JSON.stringify(body));
}

send({
    "send": {
        "this": {
            "is": [
                "a", 
                "blob", 
                "of", 
                "json"
            ]
        }
    }, 
    "address": "localhost:8888"
}, cb);