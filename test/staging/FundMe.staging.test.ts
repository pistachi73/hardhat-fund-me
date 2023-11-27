import {
  HardhatEthersSigner,
  SignerWithAddress,
} from "@nomicfoundation/hardhat-ethers/signers";
import { FundMe } from "../../typechain-types";
import { deployments, ethers, network } from "hardhat";
import { developmentChains } from "../../helper-hardhat-config";
import { expect } from "chai";

developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", () => {
      let fundMe: FundMe, fundMeAddress: string;
      let deployer: SignerWithAddress;
      const sendValue = ethers.parseEther("0.1");

      beforeEach(async () => {
        deployer = (await ethers.getSigners())[0];
        fundMeAddress = (await deployments.get("FundMe")).address;
        fundMe = await ethers.getContractAt("FundMe", fundMeAddress, deployer);
      });

      it("Allwos people to fund and withdraw", async () => {
        await fundMe.fund({ value: sendValue });

        await fundMe.withdraw();
        const endigBalance = await ethers.provider.getBalance(fundMeAddress);
        expect(endigBalance).to.equal(0);
      });
    });
