// websocket server that website connects to.
const os = require('os');
const request = require('request');
const redis = require('redis');

/// Servers data being monitored.
var servers = 
[
	{name: "computer", memoryLoad: 0},
	{name: "alpine-01",url:"http://localhost:9001", latency: 0, cpu: 0, memoryLoad: 0, status: "#cccccc"},
	{name: "alpine-02",url:"http://localhost:9002", latency: 0, cpu: 0, memoryLoad: 0, status: "#cccccc"},
	{name: "alpine-03",url:"http://localhost:9003", latency: 0, cpu: 0, memoryLoad: 0, status: "#cccccc"}
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
				// console.log("interval", servers)
				socket.emit("heartbeat", servers);
			}, 1000);

			socket.on('disconnect', function (reason) {
				console.log(`closing connection ${reason}`);
				clearInterval(heartbeatTimer);
			});
		}
	});

	/////////////////////////////////////////////////////////////////////////////////////////
	// REDIS SUBSCRIPTION
	/////////////////////////////////////////////////////////////////////////////////////////
	client.on("message", function (channel, message) 
	{
		console.log(`Received message from ${channel}`)
		for( var server of servers )
		{
			if( server.name == channel)
			{
				server.memoryLoad = JSON.parse(message).memoryLoad;
			}
		}
	});

	for( var server of servers )
	{
		client.subscribe(server.name);
	}



}

module.exports.start = start;