#!/bin/bash

echo "Create account"
npx 0xweb accounts new -n tester --pin test --login


echo "Fund tester"
npx 0xweb hardhat setBalance tester 2ether --pin test


echo "Deploy contract"
npx 0xweb deploy ./contracts/AppVersionManager.sol --chain hardhat --pin test


echo "Update title"
npx 0xweb c write AppVersionManager updateInfo --newTitle MySuperApp --pin test


echo "Update package"
npx 0xweb c write AppVersionManager updatePackage --arg0 'load(./data/package.json)' --pin test


echo "Read title"
npx 0xweb c read AppVersionManager title


echo "Execute TypesScript test script"
npx ts-node test/check.ts --pin test


echo "Change generation to JavaScript"
npx 0xweb config --set "settings.generate.target=js;settings.generate.extension=mjs"


echo "Create contracts JavaScript client"
npx 0xweb install ./contracts/AppVersionManager.sol --name AppVersionManager --chain hardhat


echo "Execute JavaScript test script"
npx node test/check.mjs --pin test


echo "Execute CJS script to get block"
npx node test/check.js --pin test
