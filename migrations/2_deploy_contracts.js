const fs = require('fs');
const path = require('path');

const UseableToken = artifacts.require('UseableToken');
const RecurringEther = artifacts.require('RecurringEther');
const RecurringERC20 = artifacts.require('RecurringERC20');
const BlockIncreaser = artifacts.require('BlockIncreaser');

module.exports = async function(deployer) {
  const accounts = await web3.eth.getAccounts();

  // Deploys an ERC20 token smart contract with the user having an intial amount of 1000000 tokens
  await deployer.deploy(UseableToken, 1000000);

  // Deploys with the receiverO being account 2 in Ganache,
  // amount of blocks per payment of 10, and a payment of Ether per interval of 1000000000000000000
  await deployer.deploy(RecurringEther, accounts[1], 10, '1000000000000000000');

  // Deploys with the receiverO being account 2 in Ganache,
  // amount of blocks per payment of 10, a payment of ERC20 tokens per interval of 100
  // and have the recurring smart contract point to the ERC20 token smart contract address
  await deployer.deploy(RecurringERC20, accounts[1], 10, '100', UseableToken.address);
  await deployer.deploy(BlockIncreaser);

  // Write the account address to be used by the receiver auto scanner
  fs.writeFileSync(path.join(__dirname, './../autoScan/accountAddress'), JSON.stringify(accounts[1]));

  const recurringEtherAddressArr = [RecurringEther.address];
  const recurringERC20AddressArr = [RecurringERC20.address];
  const blockIncreaserAddress = BlockIncreaser.address;

  // Write the contract addresses of the recurring contracts in a file for the receiver auto scanner
  fs.writeFileSync(path.join(__dirname, './../autoScan/etherContractAddresses') , JSON.stringify(recurringEtherAddressArr));
  fs.writeFileSync(path.join(__dirname, './../autoScan/tokenContractAddresses'), JSON.stringify(recurringERC20AddressArr));
  fs.writeFileSync(path.join(__dirname, './../autoScan/blockIncreaserAddress'), JSON.stringify(blockIncreaserAddress));

};
