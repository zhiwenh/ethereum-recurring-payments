// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract RecurringEther {
  address public owner;
  uint public amountStored;
  address public paymentTo;
  uint public lastBlockNumberPaid;
  uint public amountOfBlocksPerPayment;
  uint public paymentPerInterval;
  uint public numberOfPayments;
  uint public lastCyclePaid;

  event Payment(
    address _payer,
    address _recipient,
    uint _amount
  );

  modifier receiverOnly() {
    if (msg.sender == paymentTo) _;
  }

  // @param _paymentTo Address of the receiver of the payments
  // @param _amountOfBlocksPerPayment Amount of blocks needed to pass for each payment
  // @param {_paymentPerInterval} The amount in wei for each payment cycle
  constructor(address _paymentTo,
    uint _amountOfBlocksPerPayment,
    uint _paymentPerInterval)
  {
      owner = msg.sender;
      paymentTo = _paymentTo;
      lastCyclePaid = block.number;
      amountOfBlocksPerPayment = _amountOfBlocksPerPayment;
      paymentPerInterval = _paymentPerInterval;
  }

  function addFunds() payable public {
    amountStored += msg.value;
  }

  function withdrawFunds(uint _amount) payable public {
    payable(msg.sender).transfer(_amount);
    amountStored = amountStored - _amount;
  }

  // If the receiver calls this function after the block number exceeds the
  // the block last cycle paid block + amount of blocks per payment,
  // they can withdraw Ether
  function getPayment() public payable receiverOnly {
    bool hasInterval = false;
    uint blocks = 0;
    uint paymentAmount = 0;
    uint numberOfIntervals = 0;

    // Loops thru the last cycle paid to the current block number for multiple payments
    for (uint i = lastCyclePaid; i <= block.number; i++) {
      blocks++;

      if (blocks >= amountOfBlocksPerPayment) {
        if (hasInterval == false) {
          hasInterval = true;
        }
        blocks = 0;
        lastCyclePaid = lastCyclePaid + amountOfBlocksPerPayment;
        paymentAmount = paymentAmount + paymentPerInterval;
        numberOfIntervals = numberOfIntervals + 1;
        numberOfPayments++;
      }
    }

    if (hasInterval == true) {
      payable(msg.sender).transfer(paymentAmount);
      amountStored = amountStored - paymentAmount;
      emit Payment(owner, msg.sender, paymentAmount);
    }
  }
}
