// SPDX-License-Identifier: MIT
// Abstract contract for the full ERC 20 Token standard

pragma solidity 0.8.4;

abstract contract Token {

    /// total amount of tokens
    uint256 public totalSupply;

    function balanceOf(address _owner) public virtual returns (uint256 balance);

    function transfer(address _to, uint256 _value) public virtual returns (bool success);

    function transferFrom(address _from, address _to, uint256 _value) public virtual returns (bool success);

    function approve(address _spender, uint256 _value) public virtual returns (bool success);

    function allowance(address _owner, address _spender) public virtual returns (uint256 remaining);

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}
