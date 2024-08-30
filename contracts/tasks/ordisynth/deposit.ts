import { task } from "hardhat/config"

/**
 Example:
 hardhat ordisynth-deposit\
 --contract 0x5F7097ca82ed89Fc3dAB99818D493321982b9a4E \
 --erc1155 0x10855D02C07758d7A9F822d2F15a41f228eC81Dc \
 --id 1 \
 --amount 10 \
 --network rskTestnet
 */
task("ordisynth-deposit", "deposit erc1155 tokens for OrdiSynth")
	.addParam<string>("contract", "OrdiSynth Smart Contract Address")
	.addParam<string>("erc1155", "BasicERC1155 Smart Contract Address")
	.addParam<string>("id", "Token ID")
	.addParam<string>("amount", "Token Amount")
	.setAction(async (taskArgs, { ethers }) => {
		const contract = await ethers.getContractAt("OrdiSynth", taskArgs.contract)

		const depositTx = await contract.depositForSynth(taskArgs.contract, taskArgs.id, taskArgs.amount)

		console.log(`Transaction Hash: ${depositTx.hash}`)
		console.log(`Transaction: ${depositTx.value}`)
		await depositTx.wait(1)
		console.log("Transaction confirmed")
	})
