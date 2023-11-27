import { run } from "hardhat";

export const verify = async (
  contractAddress: string,
  args: any
) => {
  console.log("Verifying contract...");

  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (
      e instanceof Error &&
      e.message.includes("already verified")
    ) {
      console.log("Contract already verified");
    } else {
      console.log(e);
    }
  }
};
