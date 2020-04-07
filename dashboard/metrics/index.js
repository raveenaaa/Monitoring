// websocket server that website connects to.
const io = require('socket.io')(3000);
const os = require('os');
const request = require('request');


/// Servers data being monitored.
var servers = 
[
	{name: "us-east-alpine-001",url:"http://localhost:9000", latency: 0, cpu: 0, memoryLoad: 0, status: "#cccccc"},
	{name: "us-east-alpine-002",url:"http://localhost:9001", latency: 0, cpu: 0, memoryLoad: 0, status: "#cccccc"},
	{name: "us-east-alpine-003",url:"http://localhost:9002", latency: 0, cpu: 0, memoryLoad: 0, status: "#cccccc"}
];

function start()
{
    io.on('connection', function (socket) {
        console.log("Received connection");

        ///////////////
        //// Broadcast heartbeat over websockets ever 5 seconds
        //////////////
        var heartbeatTimer = setInterval( function () 
        {
            console.log("interval", servers)
            socket.emit("heartbeat", servers);
        }, 5000);

        socket.on('disconnect', function () {
            console.log("closing connection")
            clearInterval(heartbeatTimer);
        });
    });
}

function memoryLoad()
{
	// console.log( os.totalmem(), os.freemem() );
	return 0;
}

// Create function to get CPU information
function cpuTicksAcrossCores() 
{
  //Initialise sum of idle and time of cores and fetch CPU info
  var totalIdle = 0, totalTick = 0;
  var cpus = os.cpus();
 
  //Loop through CPU cores
  for(var i = 0, len = cpus.length; i < len; i++) 
  {
		//Select CPU core
		var cpu = cpus[i];
		//Total up the time in the cores tick
		for(type in cpu.times) 
		{
			totalTick += cpu.times[type];
		}     
		//Total up the idle time of the core
		totalIdle += cpu.times.idle;
  }
 
  //Return the average Idle and Tick times
  return {idle: totalIdle / cpus.length,  total: totalTick / cpus.length};
}

var startMeasure = cpuTicksAcrossCores();

function cpuAverage()
{
	var endMeasure = cpuTicksAcrossCores(); 
 
	//Calculate the difference in idle and total time between the measures
	var idleDifference = endMeasure.idle - startMeasure.idle;
	var totalDifference = endMeasure.total - startMeasure.total;
 
	//Calculate the average percentage CPU usage
	return 0;
}

function measureLatenancy(server)
{
	var options = 
	{
		url: server.url
	};
	console.log("request to url");
	request(options, function (error, res, body) 
	{
		console.log( error || res.statusCode, server.url);
		server.latency = 500;
	});
	return server.latency;
}

function calculateColor()
{
	// latency scores of all nodes, mapped to colors.
	var nodes = nodeServers.map( measureLatenancy ).map( function(latency) 
	{
		var color = "#cccccc";
		if( !latency )
			return {color: color};
		if( latency > 1000 )
		{
			color = "#ff0000";
		}
		else if( latency > 20 )
		{
			color = "#cc0000";
		}
		else if( latency > 15 )
		{
			color = "#ffff00";
		}
		else if( latency > 10 )
		{
			color = "#cccc00";
		}
		else if( latency > 5 )
		{
			color = "#00cc00";
		}
		else
		{
			color = "#00ff00";
		}
		console.log( latency );
		return {color: color};
	});
	//console.log( nodes );
	return nodes;
}

module.exports.start = start;