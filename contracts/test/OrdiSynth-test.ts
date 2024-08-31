import { expect } from "chai"
import { deployments, ethers, getNamedAccounts } from "hardhat"
import { uniswap } from "typechain-types"

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
		it("Should Transfer Ordinal and Get SynthToken when minting", async () => {
			const { contract, contractAddress, deployer, runeContract, runeContractAddress} = await setupFixture()

			await runeContract.mintNonFungible(baseURI, name, symbol, deployer)
			const userTokens = await runeContract.getUserTokens(deployer);
			const tokenId = userTokens[0]
			expect(await runeContract.balanceOf(deployer, tokenId)).to.equal(1)
			expect(await runeContract.isFrozen(name, deployer)).to.equal(false)

			await runeContract.setApprovalForAll(contractAddress, true)
			await contract.depositForSynth(runeContractAddress, tokenId, 1)
			expect(await runeContract.balanceOf(deployer, tokenId)).to.equal(0)
			expect(await runeContract.balanceOf(contractAddress, tokenId)).to.equal(1)

			const synthTokenContract = await ethers.getContractAt("SynthToken", await contract.synthAddressByContractAddress(runeContractAddress))
			expect(await synthTokenContract.balanceOf(deployer)).to.equal(1000000000000000000n)
			expect(await synthTokenContract.totalSupply()).to.equal(1000000000000000000n)
		
			const contractTokens = await runeContract.getUserTokens(contractAddress);
			const updatedUserTokens = await runeContract.getUserTokens(deployer);
			expect(contractTokens.length).to.equal(1)
			expect(updatedUserTokens.length).to.equal(0)
		})

		it("Should Transfer Runes and Get SynthToken when token is deposited", async () => {
			const { contract, contractAddress, deployer, runeContract, runeContractAddress} = await setupFixture()

			await runeContract.mintFungible(baseURI, name, symbol, 5, 5, 1, deployer)
			const userTokens = await runeContract.getUserTokens(deployer);
			const tokenId = userTokens[0]
			expect(await runeContract.balanceOf(deployer, tokenId)).to.equal(5)
			expect(await runeContract.isFrozen(name, deployer)).to.equal(false)

			await runeContract.setApprovalForAll(contractAddress, true)
			await contract.depositForSynth(runeContractAddress, tokenId, 1)
			await contract.depositForSynth(runeContractAddress, tokenId, 1)

			expect(await runeContract.balanceOf(deployer, tokenId)).to.equal(3)
			expect(await runeContract.balanceOf(contractAddress, tokenId)).to.equal(2)

			const synthTokenContract = await ethers.getContractAt("SynthToken", await contract.synthAddressByContractAddress(runeContractAddress))
			expect(await synthTokenContract.balanceOf(deployer)).to.equal(2000000000000000000n)
			expect(await synthTokenContract.totalSupply()).to.equal(2000000000000000000n)
		})
	  
	})
	describe("Redeem Functionality", () => {
		it("Should Burn SynthToken and Get ERC1155 when redeeming", async () => {
			const { contract, contractAddress, deployer, runeContract, runeContractAddress} = await setupFixture()


			await runeContract.mintNonFungible(baseURI, name, symbol, deployer)
			const userTokens = await runeContract.getUserTokens(deployer);
			const tokenId = userTokens[0]

			await runeContract.setApprovalForAll(contractAddress, true)
			await contract.depositForSynth(runeContractAddress, tokenId, 1)
			expect(await runeContract.balanceOf(deployer, tokenId)).to.equal(0)
			expect(await runeContract.balanceOf(contractAddress, tokenId)).to.equal(1)

			const synthTokenContract = await ethers.getContractAt("SynthToken", await contract.synthAddressByContractAddress(runeContractAddress))
			await synthTokenContract.approve(contractAddress, 1000000000000000000n)
			await contract.redeemSynth(runeContractAddress, tokenId, 1);
			expect(await runeContract.balanceOf(deployer, tokenId)).to.equal(1)
			expect(await runeContract.balanceOf(contractAddress, tokenId)).to.equal(0)
			expect(await synthTokenContract.totalSupply()).to.equal(0)
		})
	})

	describe("Add Liquidity Functionality", () => {
		it("Should Add Liquidity to SynthToken", async () => {
			const { contract, contractAddress, deployer, runeContract, runeContractAddress} = await setupFixture()

			await runeContract.mintNonFungible(baseURI, name, symbol, deployer)
			const userTokens = await runeContract.getUserTokens(deployer);
			const tokenId = userTokens[0]

			await runeContract.setApprovalForAll(contractAddress, true)
			await contract.addLiquidityToRouter(runeContractAddress, tokenId, 1, {value: "10000"})
			expect(await runeContract.balanceOf(deployer, tokenId)).to.equal(0)
			expect(await runeContract.balanceOf(contractAddress, tokenId)).to.equal(1)

			const synthTokenContract = await ethers.getContractAt("SynthToken", await contract.synthAddressByContractAddress(runeContractAddress))
			expect(await synthTokenContract.balanceOf(deployer)).to.equal(0)
			expect(await synthTokenContract.totalSupply()).to.equal(1000000000000000000n)
		})

		it("Should Add Liquidity Correctly after Deployment", async () => {
			const signers = await getNamedAccounts()
			const uniswapRouter = "0xf55c496bb1058690db1401c4b9c19f3f44374961"

			const contract = await ethers.deployContract(
				"OrdiSynth",
				[uniswapRouter],
				await ethers.getSigner(signers.deployer)
			)
			const contractAddress = await contract.getAddress()
			const owner = signers.deployer
			const user = signers.user
			const runeContract = await ethers.deployContract(
				"RuneToken",
				[owner],
				await ethers.getSigner(signers.deployer)
			)
			const runeContractAddress = await runeContract.getAddress()
			await runeContract.mintNonFungible(baseURI, name, symbol, user)
			const runeContractWithUserSigner = runeContract.connect(await ethers.getSigner(user))
			await runeContractWithUserSigner.setApprovalForAll(contractAddress, true)
			const [tokenId] = await runeContract.getUserTokens(user)

			const contractWithUserSigner = contract.connect(await ethers.getSigner(user))
			await contractWithUserSigner.depositForSynth(runeContractAddress, tokenId, 1)

			const synthTokenContract = await ethers.getContractAt("SynthToken", await contract.synthAddressByContractAddress(runeContractAddress))
			const synthTokenContractWithSigner = synthTokenContract.connect(await ethers.getSigner(user))
			await synthTokenContractWithSigner.approve(contractAddress, 1000000000000000000n)
			await contractWithUserSigner.redeemSynth(runeContractAddress, tokenId, 1)

			await contractWithUserSigner.addLiquidityToRouter(runeContractAddress, tokenId, 1, {value: "10000"})
			expect(await runeContract.balanceOf(user, tokenId)).to.equal(0)
			expect(await runeContract.balanceOf(contractAddress, tokenId)).to.equal(1)

			expect(await synthTokenContract.balanceOf(user)).to.equal(0)
			expect(await synthTokenContract.totalSupply()).to.equal(1000000000000000000n)
		})
	})

	describe("Swap rBTC for RuneToken", () => {
		it("Should Swap rBTC for Runes", async () => {
			const { contract, contractAddress, deployer, runeContract, runeContractAddress} = await setupFixture()

			await runeContract.mintFungible(baseURI, name, symbol, 5, 5, 1, deployer)
			const userTokens = await runeContract.getUserTokens(deployer);
			const tokenId = userTokens[0]

			await runeContract.setApprovalForAll(contractAddress, true)
			await contract.addLiquidityToRouter(runeContractAddress, tokenId, 5, {value: "50000"})

			const synthTokenContract = await ethers.getContractAt("SynthToken", await contract.synthAddressByContractAddress(runeContractAddress))
			expect(await synthTokenContract.totalSupply()).to.equal(5000000000000000000n)
			expect(await runeContract.balanceOf(deployer, tokenId)).to.equal(0)
			// 15000 instead of 10000 because of the slippage
			await contract.swapTokenForRune(runeContractAddress, tokenId, 1, {value: "15000"})
			expect(await synthTokenContract.totalSupply()).to.equal(4000000000000000000n)
			expect(await runeContract.balanceOf(deployer, tokenId)).to.equal(1)
		})
		it("Should Swap rBTC for Ordinal", async () => {
			const { contract, contractAddress, deployer, runeContract, runeContractAddress, uniswapContract} = await setupFixture()

			await runeContract.mintNonFungible(baseURI, name, symbol, deployer)
			await runeContract.mintNonFungible(baseURI, name+"2", symbol, deployer)
			const userTokens = await runeContract.getUserTokens(deployer);
			const tokenId = userTokens[0]
			const tokenId2 = userTokens[1]

			await runeContract.setApprovalForAll(contractAddress, true)
			await contract.addLiquidityToRouter(runeContractAddress, tokenId, 1, {value: "10000"})
			await contract.addLiquidityToRouter(runeContractAddress, tokenId2, 1, {value: "10000"})

			const synthTokenContract = await ethers.getContractAt("SynthToken", await contract.synthAddressByContractAddress(runeContractAddress))
			expect(await synthTokenContract.totalSupply()).to.equal(2000000000000000000n)
			expect(await runeContract.balanceOf(deployer, tokenId)).to.equal(0)
			// 50000 because of slippage
			await contract.swapTokenForRune(runeContractAddress, tokenId, 1, {value: "50000"})
			expect(await synthTokenContract.totalSupply()).to.equal(1000000000000000000n)
			expect(await runeContract.balanceOf(deployer, tokenId)).to.equal(1)
		})
	})

})
