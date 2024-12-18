import { ChainAccountService } from 'dequanto/ChainAccountService';
import { Web3ClientFactory } from 'dequanto/clients/Web3ClientFactory';
import { Deployments } from 'dequanto/contracts/deploy/Deployments';
import { l } from 'dequanto/utils/$logger';
import { $require } from 'dequanto/utils/$require';
import { AppVersionManager } from './0xc/hardhat/AppVersionManager/AppVersionManager';
import { Config } from 'dequanto/config/Config';



async function main () {

    let config = await Config.fetch({
        'configAccounts': './0xc/config/accounts.json',
        'pin': 'test'
    });

    let account = await ChainAccountService.get('tester');
    $require.notNull(account, 'Account not found');

    let client = await Web3ClientFactory.getAsync('hardhat');
    let deployments = new Deployments(client, account);
    let { contract: manager } = await deployments.ensureWithProxy(AppVersionManager, {
        id: 'AppVersionManagerFoo',
        arguments: []
    });

    await manager.$receipt().updateInfo(account, `Foo Bar`);

    let title = await manager.title()

    l`Title: "${title}"`;
    $require.eq(title, 'Foo Bar', `Title does not match expected value`);
}


main().then(() => {
    process.exit(0);
})
