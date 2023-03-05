// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";
import "./FlashLoan.sol";


contract FlashLoanReceiver {
	FlashLoan private pool;
	address private owner;

	event FlashLoanReceived(address token, uint256 amount);
	

	constructor(address _poolAdress) {
		pool = FlashLoan(_poolAdress);
		owner = msg.sender;
	}

	function receiveTokens(address _tokenAddress, uint256 _amount) external {
		require(msg.sender ==address(pool), 'Sender must be pool');
		//Require funds received
		require(Token(_tokenAddress).balanceOf(address(this)) == _amount, 'failed to get loan');
		
		// emit event

		emit FlashLoanReceived(_tokenAddress, _amount);
		
		// Do trade with the money...


		// Return funds back to pool
		require(Token(_tokenAddress).transfer(msg.sender, _amount), "Transfer of token failed");

	}

	function executeFlashLoan(uint _amount) external {
		require(msg.sender == owner, 'only owner can execute flash loan');
		pool.flashLoan(_amount);
	}

}