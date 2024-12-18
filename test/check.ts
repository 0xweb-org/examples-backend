


import { AppVersionManager } from '../0xc/hardhat/AppVersionManager/AppVersionManager';
import { ChainAccountService } from 'dequanto/ChainAccountService';
import { Web3ClientFactory } from 'dequanto/clients/Web3ClientFactory';
import { Config } from 'dequanto/config/Config';
import { Deployments } from 'dequanto/contracts/deploy/Deployments';
import { $require } from 'dequanto/utils/$require';
import { l } from 'dequanto/utils/$logger';

async function main () {

    let config = await Config.fetch({
        'configAccounts': './0xc/config/accounts.json',
        'pin': 'test'
    });

    let account = await ChainAccountService.get('tester');
    $require.notNull(account, 'Account not found');

    let client = await Web3ClientFactory.getAsync('hardhat');
    l`Block: ${ await client.getBlockNumber() }`;

    let deployments = new Deployments(client, account);
    let manager = await deployments.get(AppVersionManager);

    let title = await manager.title()

    l`Title: "${title}"`;
    $require.eq(title, 'MySuperApp', `Title does not match expected value`);
};

main().then(
    () => process.exit(0),
);
