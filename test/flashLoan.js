const { expect } = require('chai');
const { ethers } = require('hardhat');


const tokens = (n) => {
	return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe ('FlashLoan', () => {
	
	beforeEach(async () => {
		//Setup accounts 
		accounts = ethers.getSigners()
		deployer = accounts[0]

		// Load accounts
		const FlashLoan = await ethers.getContractFactory('FlashLoan')
		const FlashLoanReceiver = await ethers.getContractFactory('FlashLoanReceiver')
		const Token = await ethers.getContractFactory('Token')

		//Deploy Token
		token = await Token.deploy('Major Vibezz', 'MJZ', '10000000')

		//Deploy Flash loan Pool
		flashLoan = await FlashLoan.deploy(token.address)

		//Approve my token before deposit
		let transaction = await token.connect(deployer).approve(flashLoan.address, tokens(10000000))
		await transaction.wait()

		//Deposit my token into pool
		transaction = await flashLoan.connect(deployer).depositTokens(tokens(10000000))
		await transaction.wait()
		
	})
	describe('Deployment', () => {

		it('sends tokens to the flash loan pool contract', async () => {
		   expect(await token.balanceOf(flashLoan.address)).to.equal(tokens(10000000))
		})
	})
})