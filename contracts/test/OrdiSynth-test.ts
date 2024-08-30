import { expect } from "chai"
import { deployments, ethers, getNamedAccounts } from "hardhat"

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

		const name = "MultiToken"
		const symbol = "MT"
		const baseURI = "ipfs://base-uri/"
		const contractURI = "ipfs://contract-uri"
		const owner = signers.deployer

		const erc1155Contract= await ethers.deployContract(
			"MockERC1155",
			[name, symbol, baseURI, contractURI, owner],
			await ethers.getSigner(signers.deployer)
		)


		return {
			contract,
			contractAddress: await contract.getAddress(),
			erc1155Contract,
			erc1155contractAddress: await erc1155Contract.getAddress(),
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
			const { contract, contractAddress, deployer, erc1155Contract, erc1155contractAddress} = await setupFixture()

			expect(await erc1155Contract["totalSupply(uint256)"](1)).to.equal(0)
			expect(await erc1155Contract["totalSupply(uint256)"](2)).to.equal(0)

			await erc1155Contract.mintBatch(deployer, [1, 2], [2000, 4000])

			expect(await erc1155Contract["totalSupply(uint256)"](1)).to.equal(2000)
			expect(await erc1155Contract["totalSupply(uint256)"](2)).to.equal(4000)

			expect(await erc1155Contract.balanceOf(deployer, 1)).to.equal(2000)
			expect(await erc1155Contract.balanceOf(deployer, 2)).to.equal(4000)

			await erc1155Contract.setApprovalForAll(contractAddress, true)
			await contract.depositForSynth(erc1155contractAddress, 1, 1)
			expect(await erc1155Contract.balanceOf(deployer, 1)).to.equal(1999)
			expect(await erc1155Contract.balanceOf(contractAddress, 1)).to.equal(1)

			const synthTokenContract = await ethers.getContractAt("SynthToken", await contract.synthAddressByContractAddress(erc1155contractAddress))
			expect(await synthTokenContract.balanceOf(deployer)).to.equal(1)
			expect(await synthTokenContract.totalSupply()).to.equal(1)
		})

		it("Should Transfer ERC1155 and Get SynthToken when token is minted already", async () => {
			const { contract, contractAddress, deployer, erc1155Contract, erc1155contractAddress} = await setupFixture()

			expect(await erc1155Contract["totalSupply(uint256)"](1)).to.equal(0)

			await erc1155Contract.mintBatch(deployer, [1], [5])

			expect(await erc1155Contract["totalSupply(uint256)"](1)).to.equal(5)

			expect(await erc1155Contract.balanceOf(deployer, 1)).to.equal(5)

			await erc1155Contract.setApprovalForAll(contractAddress, true)
			await contract.depositForSynth(erc1155contractAddress, 1, 1)
			await contract.depositForSynth(erc1155contractAddress, 1, 1)

			expect(await erc1155Contract.balanceOf(deployer, 1)).to.equal(3)
			expect(await erc1155Contract.balanceOf(contractAddress, 1)).to.equal(2)

			const synthTokenContract = await ethers.getContractAt("SynthToken", await contract.synthAddressByContractAddress(erc1155contractAddress))
			expect(await synthTokenContract.balanceOf(deployer)).to.equal(2)
			expect(await synthTokenContract.totalSupply()).to.equal(2)
		})
	  
	})
	describe("Redeem Functionality", () => {
		it("Should Burn SynthToken and Get ERC1155 when redeeming", async () => {
			const { contract, contractAddress, deployer, erc1155Contract, erc1155contractAddress} = await setupFixture()

			expect(await erc1155Contract["totalSupply(uint256)"](1)).to.equal(0)

			await erc1155Contract.mintBatch(deployer, [1], [1])

			expect(await erc1155Contract["totalSupply(uint256)"](1)).to.equal(1)
			expect(await erc1155Contract.balanceOf(deployer, 1)).to.equal(1)

			await erc1155Contract.setApprovalForAll(contractAddress, true)
			await contract.depositForSynth(erc1155contractAddress, 1, 1)
			expect(await erc1155Contract.balanceOf(deployer, 1)).to.equal(0)
			expect(await erc1155Contract.balanceOf(contractAddress, 1)).to.equal(1)

			const synthTokenContract = await ethers.getContractAt("SynthToken", await contract.synthAddressByContractAddress(erc1155contractAddress))
			expect(await synthTokenContract.balanceOf(deployer)).to.equal(1)
			expect(await synthTokenContract.totalSupply()).to.equal(1)

			await synthTokenContract.approve(contractAddress, 1)
			await contract.redeemSynth(erc1155contractAddress, 1, 1);
			expect(await erc1155Contract.balanceOf(deployer, 1)).to.equal(1)
			expect(await erc1155Contract.balanceOf(contractAddress, 1)).to.equal(0)
			expect(await synthTokenContract.totalSupply()).to.equal(0)
		})
	})
	describe("Add Liquidity Functionality", () => {
		it("Should Add Liquidity to SynthToken", async () => {
			const { contract, contractAddress, deployer, erc1155Contract, erc1155contractAddress, contractConstructor } = await setupFixture()

			await erc1155Contract.mintBatch(deployer, [1], [1000])
			await erc1155Contract.setApprovalForAll(contractAddress, true)
			await contract.addLiquidityToRouter(erc1155contractAddress, 1, 1000, {value: "10000"})
			expect(await erc1155Contract.balanceOf(deployer, 1)).to.equal(0)
			expect(await erc1155Contract.balanceOf(contractAddress, 1)).to.equal(1000)

			const synthTokenContract = await ethers.getContractAt("SynthToken", await contract.synthAddressByContractAddress(erc1155contractAddress))
			expect(await synthTokenContract.balanceOf(deployer)).to.equal(0)
			expect(await synthTokenContract.totalSupply()).to.equal(1000)


		})
	})

})
