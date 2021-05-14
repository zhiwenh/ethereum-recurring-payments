// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./UseableToken.sol";

contract RecurringERC20 {
  address public owner;
  address paymentTo;
  uint public lastBlockNumberPaid;
  uint public amountOfBlocksPerPayment;
  uint public paymentPerInterval;
  uint public numberOfPayments;
  uint public lastCyclePaid;
  address public tokenAddress;

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
  // @param _paymentPerInterval The amount in tokens for each payment cycle
  // @param _tokenAddress The ERC20 token contract address used for payment
  constructor(address _paymentTo,
    uint _amountOfBlocksPerPayment,
    uint _paymentPerInterval,
    address _tokenAddress
    )
  {
      owner = msg.sender;
      paymentTo = _paymentTo;
      lastCyclePaid = block.number;
      amountOfBlocksPerPayment = _amountOfBlocksPerPayment;
      paymentPerInterval = _paymentPerInterval;
      tokenAddress = _tokenAddress;
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
      Token c = Token(tokenAddress);
      c.transferFrom(owner, msg.sender, paymentAmount);
      emit Payment(owner, msg.sender, paymentAmount);
    }
  }
}
