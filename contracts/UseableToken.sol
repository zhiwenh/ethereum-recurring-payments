// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./BaseToken.sol";

contract UseableToken is BaseToken {

  constructor (uint256 _initialAmount) {
      balances[msg.sender] = _initialAmount;
      totalSupply = _initialAmount;
  }

}
