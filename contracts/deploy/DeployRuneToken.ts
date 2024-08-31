import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const { deployer, user } = await hre.getNamedAccounts()

	console.log(deployer)
	await hre.deployments.deploy("OrdiSynth", {
		from: deployer,
		args: [deployer],
		log: true,
	})

	// // account[1] approve OrdiSynth to transfer 1 token
	// await hre.deployments.execute(
	// 	"MockERC1155",
	// 	{ from: user, log: true },
	// 	"setApprovalForAll",
	// 	(await hre.deployments.get("OrdiSynth")).address,
	// 	true
	// )

	// // account[1] deposit 1 token to get 1 synth token
	// await hre.deployments.execute(
	// 	"OrdiSynth",
	// 	{ from: user, log: true },
	// 	"depositForSynth",
	// 	(await hre.deployments.get("MockERC1155")).address,
	// 	1,
	// 	1
	// )
}
export default func
func.tags = ["ordisynth"]
