import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const { deployer, user, owner } = await hre.getNamedAccounts()

	await hre.deployments.deploy("OrdiSynth", {
		from: deployer,
		args: ["0xf55c496bb1058690db1401c4b9c19f3f44374961"],
		log: true,
	})
	const ordisynthDeployment = await hre.deployments.get("OrdiSynth")

	await hre.deployments.deploy("RuneToken", {
		from: deployer,
		args: [owner],
		log: true,
	})
	const runeTokenDeployment = await hre.deployments.get("RuneToken")
	const runeToken = await hre.ethers.getContractAt("RuneToken", runeTokenDeployment.address)

	const name = "Pizza Ninjas #1"
	const symbol = "PizzaNinjas"
	const baseURI = "ipfs://base-uri/"
	// account[1] to mint 10 tokens for testing
	await hre.deployments.execute(
		"RuneToken",
		{ from: owner, log: true },
		"mintNonFungible",
		baseURI,
		name,
		symbol,
		user
	)

	// account[1] approve OrdiSynth to transfer 1 token
	await hre.deployments.execute(
		"RuneToken",
		{ from: user, log: true },
		"setApprovalForAll",
		ordisynthDeployment.address,
		true
	)

	const [tokenId] = await runeToken.getUserTokens(user)

	// account[1] deposit 1 token to get 1 synth token
	await hre.deployments.execute(
		"OrdiSynth",
		{ from: user, log: true },
		"depositForSynth",
		runeTokenDeployment.address,
		tokenId,
		1
	)
}
export default func
func.tags = ["test"]
