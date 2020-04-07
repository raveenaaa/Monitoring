// websocket server that website connects to.
const os = require('os');
const request = require('request');

/// Servers data being monitored.
var servers = 
[
	{name: "us-east-alpine-001",url:"http://localhost:9001", latency: 0, cpu: 0, memoryLoad: 0, status: "#cccccc"},
	{name: "us-east-alpine-002",url:"http://localhost:9002", latency: 0, cpu: 0, memoryLoad: 0, status: "#cccccc"},
	{name: "us-east-alpine-003",url:"http://localhost:9003", latency: 0, cpu: 0, memoryLoad: 0, status: "#cccccc"}
];

///////////////////////////////////////////////////////////////////////////////////////
// REDIS
///////////////////////////////////////////////////////////////////////////////////////

let client = redis.createClient(6379, 'localhost', {});

function start(app)
{
	////////////////////////////////////////////////////////////////////////////////////////
	// DASHBOARD
	////////////////////////////////////////////////////////////////////////////////////////
	const io = require('socket.io')(3000);
	// force websocket protocol, otherwise some browsers may try polling.
	io.set('transports', ['websocket']);
	io.on('connection', function (socket) {
        console.log(`Received connection id ${socket.id} connected ${socket.connected}`);

		if( socket.connected )
		{
			//// Broadcast heartbeat over websockets ever 1 second
			var heartbeatTimer = setInterval( function () 
			{
				client.lpop("memory", function(err, value)
				{
					
				});
				// console.log("interval", servers)
				socket.emit("heartbeat", servers);
			}, 1000);

			socket.on('disconnect', function (reason) {
				console.log(`closing connection ${reason}`);
				clearInterval(heartbeatTimer);
			});
		}
	});

}

module.exports.start = start;