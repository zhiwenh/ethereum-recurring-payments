const RecurringEther = artifacts.require('RecurringEther');
const RecurringERC20 = artifacts.require('RecurringERC20');
const UseableToken = artifacts.require('UseableToken');
const BlockIncreaser = artifacts.require('BlockIncreaser');

contract('Contracts', (accounts) => {
  it('user should be able to add funds to recurring Ether contract', async () => {
    const recurringEtherInstance = await RecurringEther.deployed();
    await recurringEtherInstance.addFunds({from: accounts[0], value: 10000});
    const balance = await recurringEtherInstance.amountStored.call();
    assert.equal(balance.toNumber(), 10000, "10000 was in the first account");
  });

  it('receiver should be able to withdraw Ether from recurring Ether contract after a certain number of blocks ', async () => {
    const recurringEtherInstance = await RecurringEther.deployed();
    const blockIncreaserInstance = await BlockIncreaser.deployed();

    await recurringEtherInstance.addFunds({from: accounts[0], value: 10000000000000000000});

    // These methods creates new blocks for Ganache
    await blockIncreaserInstance.blockIncrease();
    await blockIncreaserInstance.blockIncrease();
    await blockIncreaserInstance.blockIncrease();
    await blockIncreaserInstance.blockIncrease();
    await blockIncreaserInstance.blockIncrease();
    await blockIncreaserInstance.blockIncrease();
    await blockIncreaserInstance.blockIncrease();
    await blockIncreaserInstance.blockIncrease();
    await blockIncreaserInstance.blockIncrease();
    await blockIncreaserInstance.blockIncrease();
    await blockIncreaserInstance.blockIncrease();

    const beforeAccountBalance = await web3.eth.getBalance(accounts[1]);

    let beforeBalance = await recurringEtherInstance.amountStored.call();
    beforeBalance = beforeBalance.toString();

    const tx = await recurringEtherInstance.getPayment({from: accounts[1]});

    let afterBalance = await recurringEtherInstance.amountStored.call();
    afterBalance = afterBalance.toString();

    const afterAccountBalance = await web3.eth.getBalance(accounts[1]);

    assert.isAbove(Number(afterAccountBalance), Number(beforeAccountBalance), ' After account balance is greater than before account balance');
  });

  it('receiver should be able to withdraw tokens from recurring token contract after a certain number of blocks', async () => {
    const useableTokenInstance = await UseableToken.deployed();
    const recurringERC20Instance = await RecurringERC20.deployed();
    const blockIncreaserInstance = await BlockIncreaser.deployed();
    await useableTokenInstance.approve(recurringERC20Instance.address, 10000, {from: accounts[0]});

    const numberOfPayments = await recurringERC20Instance.numberOfPayments.call();

    // These methods creates new blocks for Ganache
    await blockIncreaserInstance.blockIncrease();
    await blockIncreaserInstance.blockIncrease();
    await blockIncreaserInstance.blockIncrease();
    await blockIncreaserInstance.blockIncrease();
    await blockIncreaserInstance.blockIncrease();
    await blockIncreaserInstance.blockIncrease();
    await blockIncreaserInstance.blockIncrease();
    await blockIncreaserInstance.blockIncrease();
    await blockIncreaserInstance.blockIncrease();
    await blockIncreaserInstance.blockIncrease();
    await blockIncreaserInstance.blockIncrease();

    await recurringERC20Instance.getPayment({from: accounts[1], gas: 6721975 });

    let balanceAccount1 = await useableTokenInstance.balanceOf.call(accounts[0]);
    let balanceAccount2 = await useableTokenInstance.balanceOf.call(accounts[1]);

    assert.equal(balanceAccount2.toNumber(), 300, "300 tokens got transfered");
  });
});
