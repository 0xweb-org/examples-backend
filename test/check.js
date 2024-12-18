
const { ChainAccountService } = require('dequanto/ChainAccountService');
const { Web3ClientFactory } = require('dequanto/clients/Web3ClientFactory');
const { Config } = require('dequanto/config/Config');
const { Deployments } = require('dequanto/contracts/deploy/Deployments');
const { $require } = require('dequanto/utils/$require');
const { l } = require('dequanto/utils/$logger');


async function main () {

    let config = await Config.fetch({
        'configAccounts': './0xc/config/accounts.json'
    })

    let account = await ChainAccountService.get('tester');
    $require.notNull(account, 'Account not found');

    let client = await Web3ClientFactory.getAsync('hardhat');
    l`Block: ${ await client.getBlockNumber() }`;
};

main().then(
    () => process.exit(0),
);
