
const { AppVersionManager } = require('../0xc/hardhat/AppVersionManager/AppVersionManager.js');
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

    let deployments = new Deployments(client, account);
    let manager = await deployments.get(AppVersionManager);

    let title = await manager.title()
    l`Title: "${title}"`;
    $require.eq(title, 'MySuperApp', `Title does not match expected value`);

    let p1 = await manager.package();
    console.log(`Package from Property`, p1);
    $require.eq(p1.version, 1n);

    let p2 = await manager.findPackageAtTimestamp(Date.now());
    console.log(`Package from Method`, p2);
    $require.eq(p2.version, 1n);
};

main().then(
    () => process.exit(0),
);
