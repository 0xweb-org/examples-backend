### Blockchain-as-a-Backend

This repository demonstrates how a smart contract can function as a REST-like endpoint for frontend applications. It also serves as a CI pipeline for publishing the 0xweb package, streamlining the development and deployment process.


> Further reading https://dev.kit.eco/blockchain-as-a-backend

----

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/0xweb-org/examples-backend/tree/master.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/0xweb-org/examples-backend/tree/master)

----

- [Deploy CLI](./deploy-cli.sh)
- [Deploy via Script](./deploy-cli.sh)


```bash

# Create account
npx 0xweb accounts new -n tester --pin test --login

# Fund tester
npx 0xweb hardhat setBalance tester 2ether --pin test

# Deploy contract or check if the bytecode has not been not changed
npx 0xweb deploy ./contracts/AppVersionManager.sol --chain hardhat --pin test


# Update title
npx 0xweb c write AppVersionManager updateInfo --newTitle MySuperApp --pin test


# Update package
npx 0xweb c write AppVersionManager updatePackage --arg0 'load(./data/package.json)' --pin test

# Read title
npx 0xweb c read AppVersionManager title


# Execute TypesScript test script
npx ts-node test/check.ts --pin test


# Change generation to JavaScript
npx 0xweb config --set settings.generate.target=js


# Create contracts JavaScript client
npx 0xweb install ./contracts/AppVersionManager.sol --name AppVersionManager --chain hardhat


# Execute JavaScript test script
npx node test/check.mjs --pin test


# Execute CJS script to get block
npx node test/check.js --pin test
```


----

🏁 [0xweb.org](https://0xweb.org)
