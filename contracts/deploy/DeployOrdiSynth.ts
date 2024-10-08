import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const { deployer,  owner } = await hre.getNamedAccounts()

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
}
export default func
func.tags = ["OrdiSynth"]