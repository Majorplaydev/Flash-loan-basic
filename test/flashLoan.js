const { expect } = require('chai');
const hre = require('hardhat');


const tokens = (n) => {
	return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe ('FlashLoan', () => {
	let token, flashLoan, FlashLoanReceiver
	let deployer
	
	beforeEach(async () => {
		//Setup accounts 
		accounts = await ethers.getSigners()
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

		// Deploy flash Loan Receiver
		flashLoanReceiver = await FlashLoanReceiver.deploy(flashLoan.address)

	})

	describe('Deployment', () => {

		it('sends tokens to the flash loan pool contract', async () => {
		   expect(await token.balanceOf(flashLoan.address)).to.equal(tokens(10000000))
		})
	})

	describe('Borrowing funds from flash loan pool', () => {
 	  it('borrows funds from the pool', async () => {
 	  	let amount = tokens(1000)
 	  	let transaction = await flashLoanReceiver.connect(deployer).executeFlashLoan(amount)
 	  	let result = await transaction.wait()

 	  	await expect(transaction).to.emit(flashLoanReceiver, 'FlashLoanReceived')
 	  	.withArgs(token.address, amount)
 	  })
	})  
})