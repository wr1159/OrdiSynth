import { expect } from "chai"
import { deployments, ethers, getNamedAccounts } from "hardhat"

const name = "MultiToken"
const symbol = "MT"
const baseURI = "ipfs://base-uri/"
const contractURI = "ipfs://contract-uri"
describe("OrdiSynth", () => {
	const setupFixture = deployments.createFixture(async () => {
		await deployments.fixture()
		const signers = await getNamedAccounts()

		const uniswapRouter = "0xf55c496bb1058690db1401c4b9c19f3f44374961"
		const uniswapContract = ethers.getContractAt("IUniswapV2Router02", uniswapRouter)

		const contract = await ethers.deployContract(
			"OrdiSynth",
			[uniswapRouter],
			await ethers.getSigner(signers.deployer)
		)

		const owner = signers.deployer
		console.log(owner)

		const runeContract = await ethers.deployContract(
			"RuneToken",
			[owner],
			await ethers.getSigner(signers.deployer)
		)

		return {
			contract,
			contractAddress: await contract.getAddress(),
			runeContract,
			runeContractAddress: await runeContract.getAddress(),
			deployer: signers.deployer,
			accounts: await ethers.getSigners(),
			contractConstructor: {
				uniswapRouter,
			},
			uniswapContract,
		}
	})


	describe("Deposit Functionality", () => {
		it("Should Transfer ERC1155 and Get SynthToken when minting", async () => {
			const { contract, contractAddress, deployer, runeContract, runeContractAddress} = await setupFixture()

			expect((await runeContract.getTokenInfo(1, ""))).to.equal(0)

			await runeContract.mintFungible(baseURI,name, symbol, 1, 1,0, deployer)
			expect((await runeContract.getTokenInfo(1, "")).maxSupply).to.equal(1)
			expect(await runeContract.balanceOf(deployer, 1)).to.equal(1)

			await runeContract.setApprovalForAll(contractAddress, true)
			await contract.depositForSynth(runeContractAddress, 1, 1)
			expect(await runeContract.balanceOf(deployer, 1)).to.equal(0)
			expect(await runeContract.balanceOf(contractAddress, 1)).to.equal(1)

			const synthTokenContract = await ethers.getContractAt("SynthToken", await contract.synthAddressByContractAddress(runeContractAddress))
			expect(await synthTokenContract.balanceOf(deployer)).to.equal(1000000000000000000n)
			expect(await synthTokenContract.totalSupply()).to.equal(1000000000000000000n)
		})

		// it("Should Transfer ERC1155 and Get SynthToken when token is minted already", async () => {
		// 	const { contract, contractAddress, deployer, runeContract: erc1155Contract, runeContractAddress: erc1155contractAddress} = await setupFixture()

		// 	await erc1155Contract.mintBatch(deployer, [1], [5])
		// 	await erc1155Contract.setApprovalForAll(contractAddress, true)
		// 	await contract.depositForSynth(erc1155contractAddress, 1, 1)
		// 	await contract.depositForSynth(erc1155contractAddress, 1, 1)

		// 	expect(await erc1155Contract.balanceOf(deployer, 1)).to.equal(3)
		// 	expect(await erc1155Contract.balanceOf(contractAddress, 1)).to.equal(2)

		// 	const synthTokenContract = await ethers.getContractAt("SynthToken", await contract.synthAddressByContractAddress(erc1155contractAddress))
		// 	expect(await synthTokenContract.balanceOf(deployer)).to.equal(2000000000000000000n)
		// 	expect(await synthTokenContract.totalSupply()).to.equal(2000000000000000000n)
		// })
	  
	})
	// describe("Redeem Functionality", () => {
	// 	it("Should Burn SynthToken and Get ERC1155 when redeeming", async () => {
	// 		const { contract, contractAddress, deployer, runeContract: erc1155Contract, runeContractAddress: erc1155contractAddress} = await setupFixture()


	// 		await erc1155Contract.mintBatch(deployer, [1], [1])
	// 		await erc1155Contract.setApprovalForAll(contractAddress, true)
	// 		await contract.depositForSynth(erc1155contractAddress, 1, 1)
	// 		expect(await erc1155Contract.balanceOf(deployer, 1)).to.equal(0)
	// 		expect(await erc1155Contract.balanceOf(contractAddress, 1)).to.equal(1)

	// 		const synthTokenContract = await ethers.getContractAt("SynthToken", await contract.synthAddressByContractAddress(erc1155contractAddress))
	// 		await synthTokenContract.approve(contractAddress, 1000000000000000000n)
	// 		await contract.redeemSynth(erc1155contractAddress, 1, 1);
	// 		expect(await erc1155Contract.balanceOf(deployer, 1)).to.equal(1)
	// 		expect(await erc1155Contract.balanceOf(contractAddress, 1)).to.equal(0)
	// 		expect(await synthTokenContract.totalSupply()).to.equal(0)
	// 	})
	// })
	// describe("Add Liquidity Functionality", () => {
	// 	it("Should Add Liquidity to SynthToken", async () => {
	// 		const { contract, contractAddress, deployer, runeContract: erc1155Contract, runeContractAddress: erc1155contractAddress, contractConstructor } = await setupFixture()

	// 		await erc1155Contract.mintBatch(deployer, [1], [1])
	// 		await erc1155Contract.setApprovalForAll(contractAddress, true)
	// 		await contract.addLiquidityToRouter(erc1155contractAddress, 1, 1, {value: "10000"})
	// 		expect(await erc1155Contract.balanceOf(deployer, 1)).to.equal(0)
	// 		expect(await erc1155Contract.balanceOf(contractAddress, 1)).to.equal(1)

	// 		const synthTokenContract = await ethers.getContractAt("SynthToken", await contract.synthAddressByContractAddress(erc1155contractAddress))
	// 		expect(await synthTokenContract.balanceOf(deployer)).to.equal(0)
	// 		expect(await synthTokenContract.totalSupply()).to.equal(1000000000000000000n)
	// 	})
	// })

	// describe("Swap rBTC for ERC1155", () => {
	// 	it("Should Swap rBTC for ERC1155", async () => {
	// 		const { contract, contractAddress, deployer, runeContract: erc1155Contract, runeContractAddress: erc1155contractAddress, uniswapContract } = await setupFixture()

	// 		await erc1155Contract.mintBatch(deployer, [1], [5])
	// 		await erc1155Contract.setApprovalForAll(contractAddress, true)
	// 		await contract.addLiquidityToRouter(erc1155contractAddress, 1, 5, {value: "50000"})

	// 		const synthTokenContract = await ethers.getContractAt("SynthToken", await contract.synthAddressByContractAddress(erc1155contractAddress))
	// 		expect(await synthTokenContract.totalSupply()).to.equal(5000000000000000000n)
	// 		expect(await erc1155Contract.balanceOf(deployer, 1)).to.equal(0)
	// 		// 15000 instead of 10000 because of the slippage
	// 		await contract.swapTokenFor1155(erc1155contractAddress, 1, 1, {value: "15000"})
	// 		expect(await synthTokenContract.totalSupply()).to.equal(4000000000000000000n)
	// 		expect(await erc1155Contract.balanceOf(deployer, 1)).to.equal(1)
	// 	})
	// })

})
