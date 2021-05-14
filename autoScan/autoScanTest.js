const Web3 = require('web3');
const Contract = require('web3-eth-contract');
const fs = require('fs');

const web3 = new Web3("ws://localhost:8545");

Contract.setProvider('ws://localhost:8545');

// Saves your account address in a file
const accountAddress = JSON.parse(fs.readFileSync('./accountAddress'));

const blockIncreaserAddress = JSON.parse(fs.readFileSync('./blockIncreaserAddress'));

const jsonInterface = JSON.parse(fs.readFileSync('./../build/contracts/BlockIncreaser.json')).abi;

const blockIncreaserInstance = new Contract(jsonInterface, blockIncreaserAddress);

async function asyncCall() {
  // Increases the blocks in Ganache by 10
  await blockIncreaserInstance.methods.blockIncrease().send({from: accountAddress});
  await blockIncreaserInstance.methods.blockIncrease().send({from: accountAddress});
  await blockIncreaserInstance.methods.blockIncrease().send({from: accountAddress});
  await blockIncreaserInstance.methods.blockIncrease().send({from: accountAddress});
  await blockIncreaserInstance.methods.blockIncrease().send({from: accountAddress});
  await blockIncreaserInstance.methods.blockIncrease().send({from: accountAddress});
  await blockIncreaserInstance.methods.blockIncrease().send({from: accountAddress});
  await blockIncreaserInstance.methods.blockIncrease().send({from: accountAddress});
  await blockIncreaserInstance.methods.blockIncrease().send({from: accountAddress});
  await blockIncreaserInstance.methods.blockIncrease().send({from: accountAddress});
}

asyncCall();
