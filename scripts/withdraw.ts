import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { deployments, ethers } from "hardhat";

const main = async () => {
  const deployer: SignerWithAddress = (await ethers.getSigners())[0];
  const fundMeAddress = (await deployments.get("FundMe")).address;
  const fundMe = await ethers.getContractAt("FundMe", fundMeAddress, deployer);
  console.log("Withdrawing...");

  const txResponse = await fundMe.withdraw();
  await txResponse.wait(1);
  console.log("Got it back");
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
