import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const { deployer, owner, user } = await hre.getNamedAccounts()

	await hre.deployments.deploy("MockERC1155", {
		from: deployer,
		args: ["PizzaNinjas", "PN", "ipfs://base-uri/", "ipfs://contract-uri", owner],
		log: true,
	})

	// account[1] to mint 10 tokens for testing
	await hre.deployments.execute(
		"MockERC1155",
		{ from: owner, log: true },
		"mintBatch",
		user,
		[0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
		Array(10).fill(1)
	)
}
export default func
func.tags = ["1155"]
