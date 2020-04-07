const redis = require('redis');
const util  = require('util');

class Agent
{
    memoryLoad()
    {
 	// console.log( os.totalmem(), os.freemem() );
       return 0;
    }
}

(async () => 
{

    main();

})();


async function main()
{
    let agent = new Agent();

    let connection = redis.createClient(6379, '192.168.44.92', {})
    connection.on('error', function(e)
    {
        console.log(e);
        process.exit(1);
    });
    let client = {};
    client.lpush = util.promisify(connection.lpush).bind(connection);

    await client.lpush('memory', agent.memoryLoad());


}



