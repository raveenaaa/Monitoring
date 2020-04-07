
const child = require('child_process');
const chalk = require('chalk');
const path = require('path');
const os = require('os');

const scpSync = require('../lib/scp');
const VBox = require('../lib/VBoxManage');

exports.command = 'up';
exports.desc = 'Provision monitoring infrastructure';
exports.builder = yargs => {
    yargs.options({
        privateKey: {
            describe: 'Install the provided private key on the configuration server',
            type: 'string'
        }
    });
};


exports.handler = async argv => {
    const { privateKey } = argv;

    (async () => {

        await run( privateKey );

    })();

};

async function run(privateKey) {

    console.log(chalk.greenBright('Standing up infrastructure!'));

    console.log(chalk.blueBright('Provisioning monitoring server...'));
    let result = child.spawnSync(`bakerx`, `run monitor queues --ip 192.168.44.92 --sync`.split(' '), {shell:true, stdio: 'inherit'} );
    if( result.error ) { console.log(result.error); process.exit( result.status ); }

    console.log(chalk.blueBright('Provisioning alpine-01...'));
    result = child.spawnSync(`bakerx`, `run alpine-01 alpine-node`.split(' '), {shell:true, stdio: 'inherit'} );
    if( result.error ) { console.log(result.error); process.exit( result.status ); }
    VBox.execute('controlvm', 'alpine-01 natpf1 "service,tcp,,9001,,3000"');

    console.log(chalk.blueBright('Provisioning alpine-01...'));
    result = child.spawnSync(`bakerx`, `run alpine-02 alpine-node`.split(' '), {shell:true, stdio: 'inherit'} );
    if( result.error ) { console.log(result.error); process.exit( result.status ); }
    VBox.execute('controlvm', 'alpine-02 natpf1 "service,tcp,,9002,,3000"');

    console.log(chalk.blueBright('Provisioning alpine-03...'));
    result = child.spawnSync(`bakerx`, `run alpine-03 alpine-node`.split(' '), {shell:true, stdio: 'inherit'} );
    if( result.error ) { console.log(result.error); process.exit( result.status ); }
    VBox.execute('controlvm', 'alpine-03 natpf1 "service,tcp,,9003,,3000"');

    // console.log(chalk.blueBright('Running init script...'));
    // result = sshSync('/bakerx/cm/server-init.sh', 'vagrant@192.168.33.10');
    // if( result.error ) { console.log(result.error); process.exit( result.status ); }

}


