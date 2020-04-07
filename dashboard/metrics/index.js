// websocket server that website connects to.
const os = require('os');
const request = require('request');

/// Servers data being monitored.
var servers = 
[
	{name: "us-east-alpine-001",url:"http://localhost:9000", latency: 0, cpu: 0, memoryLoad: 0, status: "#cccccc"},
	{name: "us-east-alpine-002",url:"http://localhost:9001", latency: 0, cpu: 0, memoryLoad: 0, status: "#cccccc"},
	{name: "us-east-alpine-003",url:"http://localhost:9002", latency: 0, cpu: 0, memoryLoad: 0, status: "#cccccc"}
];

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
			///////////////
			//// Broadcast heartbeat over websockets ever 5 seconds
			//////////////
			var heartbeatTimer = setInterval( function () 
			{
				console.log("interval", servers)
				socket.emit("heartbeat", servers);
			}, 5000);

			socket.on('error', function(err)
			{
				console.log(err);
				clearInterval(heartbeatTimer);
			});

			socket.on('disconnect', function (reason) {
				console.log(`closing connection ${reason}`);
				clearInterval(heartbeatTimer);
			});
		}
	});

	///////////////////////////////////////////////////////////////////////////////////////
	// REDIS
	///////////////////////////////////////////////////////////////////////////////////////
	
	let client = redis.createClient(6379, 'localhost', {});


}

module.exports.start = start;