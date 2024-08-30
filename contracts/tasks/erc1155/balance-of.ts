import { task } from "hardhat/config"

/**
 Example:
 hardhat erc1155-mint \
 --contract 0x320bd6de80d3D5361e1c9bB4CF1D7D9Ef24F3Ac7 \
 --recipient 0x73faDd7E476a9Bc2dA6D1512A528366A3E50c3cF \
 --id 1 \
 --network rskTestnet
 */
task("erc1155-balance", "Balance of BasicERC1155 Smart Contract")
	.addParam<string>("contract", "BasicERC1155 Smart Contract Address")
	.addParam<string>("recipient", "Token Recipient")
	.addParam<string>("id", "Token ID")
	.setAction(async (taskArgs, { ethers }) => {
		const contract = await ethers.getContractAt("MockERC1155", taskArgs.contract)
		const balance = await contract.balanceOf(taskArgs.recipient, taskArgs.id)
		const name = await contract.name()
		const owner = await contract.owner()

		console.log(`Balance: ${balance}`)
		console.log(`Contract Name: ${name}`)
		console.log(`Owner: ${owner}`)
	})

