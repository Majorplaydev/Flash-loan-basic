// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";


contract FlashLoan {
	Token public token;
	uint256 public poolBalance;


	constructor(address _tokenAddress) {
		token = Token(_tokenAddress);
	}

	function depositTokens (uint256 _amount) external {

		require (amount > 0, 'Must deposit at least one token');
		token.transferFrom(msg.sender, address(this), _amount);
		poolBalance = poolBalance.add(_amount);
	}

}