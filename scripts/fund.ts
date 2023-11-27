import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { deployments, ethers } from "hardhat";

const main = async () => {
  const deployer: SignerWithAddress = (await ethers.getSigners())[0];
  const fundMeAddress = (await deployments.get("FundMe")).address;
  const fundMe = await ethers.getContractAt("FundMe", fundMeAddress, deployer);
  console.log("Funding contract...");

  const txResponse = await fundMe.fund({ value: ethers.parseEther("0.1") });
  await txResponse.wait(1);
  console.log("Funded contract!");
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
