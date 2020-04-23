const redis = require('redis');
const util  = require('util');
const os = require('os');
const si = require('systeminformation');

// Calculate metrics.
// TASK 1:
class Agent
{
    round(num) {
        return Math.round(num * 100) / 100
    }

    memoryLoad()
    {
        let totalMem = os.totalmem()
        let freeMem = os.freemem()
        let usedMemory = (totalMem - freeMem) * 100 / totalMem
        return this.round(usedMemory)
    }
    async cpu()
    {
       let load = await si.currentLoad();
       return this.round(load.currentload);
    }

    async nodeMem()
    {
        let node = await si.processLoad('node');
        return this.round(node.mem);
    }
}

(async () => 
{
    // Get agent name from command line.
    let args = process.argv.slice(2);
    main(args[0]);

})();


async function main(name)
{
    let agent = new Agent();

    let connection = redis.createClient(6379, '192.168.44.92', {})
    connection.on('error', function(e)
    {
        console.log(e);
        process.exit(1);
    });
    let client = {};
    client.publish = util.promisify(connection.publish).bind(connection);

    // Push update ever 1 second
    setInterval(async function()
    {
        let payload = {
            memoryLoad: agent.memoryLoad(),
            cpu: await agent.cpu(),
            // nodeMem: await agent.nodeMem()
        };
        let msg = JSON.stringify(payload);
        await client.publish(name, msg);
        console.log(`${name} ${msg}`);
    }, 1000);

}



