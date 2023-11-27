import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
  developmentChains,
  DECIMALS,
  INITIAL_PRICE,
} from "../helper-hardhat-config";
import { DeployFunction } from "hardhat-deploy/types";

const deployMocks: DeployFunction = async ({
  getNamedAccounts,
  deployments,
  network,
}: HardhatRuntimeEnvironment) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const { chainId } = network.config;

  if (developmentChains.includes(network.name)) {
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_PRICE],
    });

    log("Mocks deployed");
    log("------------------");
  }
};

export default deployMocks;
deployMocks.tags = ["all", "mocks"];
