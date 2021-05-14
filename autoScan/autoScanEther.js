const Web3 = require('web3');
const Contract = require('web3-eth-contract');
const fs = require('fs');

const web3 = new Web3("ws://localhost:8545");

Contract.setProvider('ws://localhost:8545');

// Saves your account address in a file
const accountAddress = JSON.parse(fs.readFileSync('./accountAddress'));

// Saves desired contracts for scanning in a file
const etherContractAddresses = JSON.parse(fs.readFileSync('./etherContractAddresses'));

const jsonInterface = JSON.parse(fs.readFileSync('./../build/contracts/RecurringEther.json')).abi;

// Allows for the scanning of multiple smart contracts
const contracts = [];
for (let i = 0; i < etherContractAddresses.length; i++) {
  contracts.push(new Contract(jsonInterface, etherContractAddresses[i]));
}

for (let i = 0; i < contracts.length; i++) {
  async function asyncCall() {
    const accounts = await web3.eth.getAccounts();

    // Scans smart contracts specified in the etherContractAddresses file for the block number being greater than
    // the last cycle paid block + amount of blocks per payment
    while(true) {
      const amountOfBlocksPerPayment = await contracts[i].methods.amountOfBlocksPerPayment().call({from: accountAddress});
      const blockNumber = await web3.eth.getBlockNumber();
      const lastCyclePaid = await contracts[i].methods.lastCyclePaid().call({from: accountAddress});

      // If the desired amount of block numbers has been met, executes the method to get payment
      if (blockNumber - lastCyclePaid >= amountOfBlocksPerPayment) {
        const prevNumberOfPayments = await contracts[i].methods.numberOfPayments().call({from: accountAddress});

        await contracts[i].methods.getPayment().send({from: accountAddress, gas: 6721975});

        const afterNumberOfPayments = await contracts[i].methods.numberOfPayments().call({from: accountAddress});

        // Displays the amount of payments recieved
        if ((afterNumberOfPayments - prevNumberOfPayments) === 1) {
          console.log('Got payment from', contracts[i].options.address, 'for', afterNumberOfPayments - prevNumberOfPayments, 'payment');
        } else {
          console.log('Got payment from', contracts[i].options.address, 'for', afterNumberOfPayments - prevNumberOfPayments, 'payments');
        }
      }
    }
  }

  asyncCall();
}
