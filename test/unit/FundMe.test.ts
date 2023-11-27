import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { FundMe, MockV3Aggregator } from "../../typechain-types";
import { deployments, ethers, network } from "hardhat";
import { developmentChains } from "../../helper-hardhat-config";
import { expect } from "chai";

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", () => {
      let fundMe: FundMe;
      let mockV3Aggregator: MockV3Aggregator;
      let deployer: SignerWithAddress;
      const sendValue = ethers.parseEther("1");
      beforeEach(async () => {
        deployer = await ethers.provider.getSigner();

        await deployments.fixture(["all"]);

        const fundMeAddress = (await deployments.get("FundMe")).address;
        const MockV3AggregatorAddress = (
          await deployments.get("MockV3Aggregator")
        ).address;

        fundMe = await ethers.getContractAt("FundMe", fundMeAddress, deployer);
        mockV3Aggregator = await ethers.getContractAt(
          "MockV3Aggregator",
          MockV3AggregatorAddress,
          deployer
        );
      });

      describe("Constructor", () => {
        it("Sets the aggregator addresses correctly", async () => {
          const res = await fundMe.getPriceFeed();
          expect(res).to.equal(await mockV3Aggregator.getAddress());
        });
      });

      describe("fund", () => {
        it("Fails if you don't send enought eth", async () => {
          await expect(fundMe.fund()).to.be.revertedWith(
            "You need to spend more ETH!"
          );
        });

        it("Updates the amount funded data structure", async () => {
          await fundMe.fund({ value: sendValue });
          const response = await fundMe.getAddressToAmountFunded(
            deployer.address
          );
          expect(response).to.equal(sendValue);
        });

        it("Adds funder to array of funders", async () => {
          await fundMe.fund({ value: sendValue });
          const funder = await fundMe.getFunder(0);
          expect(funder).to.equal(deployer.address);
        });
      });

      describe("withdraw", () => {
        beforeEach(async () => {
          await fundMe.fund({ value: sendValue });
        });

        it("Withdraw ETH from a single founder", async () => {
          const startingBalance = await ethers.provider.getBalance(
            await fundMe.getAddress()
          );

          const startingDeployerBalance = await ethers.provider.getBalance(
            deployer.address
          );

          const txResponse = await fundMe.withdraw();
          const txReciept = await txResponse.wait(1);

          if (!txReciept) {
            return;
          }
          const { gasUsed, gasPrice } = txReciept;
          const gasCost = gasUsed * gasPrice;

          const endingBalance = await ethers.provider.getBalance(
            await fundMe.getAddress()
          );

          const endingDeployerBalance = await ethers.provider.getBalance(
            deployer.address
          );

          expect(endingBalance).to.equal(0);
          expect(startingBalance + startingDeployerBalance).to.equal(
            endingDeployerBalance + gasCost
          );
        });

        it("Allows us to withdraw from multiple funders", async () => {
          const accounts = await ethers.getSigners();

          for (let i = 0; i < accounts.length; i++) {
            await fundMe.connect(accounts[i]).fund({ value: sendValue });
          }

          const startingBalance = await ethers.provider.getBalance(
            await fundMe.getAddress()
          );

          const startingDeployerBalance = await ethers.provider.getBalance(
            deployer.address
          );

          const txResponse = await fundMe.withdraw();
          const txReciept = await txResponse.wait(1);

          if (!txReciept) {
            return;
          }

          const { gasUsed, gasPrice } = txReciept;
          const gasCost = gasUsed * gasPrice;

          const endingBalance = await ethers.provider.getBalance(
            await fundMe.getAddress()
          );

          const endingDeployerBalance = await ethers.provider.getBalance(
            deployer.address
          );

          let addresses;

          expect(endingBalance).to.equal(0);
          expect(startingBalance + startingDeployerBalance).to.equal(
            endingDeployerBalance + gasCost
          );

          await expect(fundMe.getFunder(0)).to.be.reverted;

          accounts.forEach(async (account) => {
            expect(
              await fundMe.getAddressToAmountFunded(account.address)
            ).to.equal(0);
          });
        });

        it("Only allows the owner to withdraw", async () => {
          const accounts = await ethers.getSigners();

          await expect(
            fundMe.connect(accounts[1]).withdraw()
          ).to.be.revertedWithCustomError(fundMe, "FundMe__NotOwner");
        });
      });
    });
