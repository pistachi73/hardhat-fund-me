const networkConfig: Record<
  number,
  {
    name: string;
    ethUsdPriceFeed: string;
    blockConfimations?: number;
  }
> = {
  11155111: {
    name: "sepolia",
    ethUsdPriceFeed:
      "0x694aa1769357215de4fac081bf1f309adc325306",
    blockConfimations: 6,
  },

  31337: {
    name: "localhost",
    ethUsdPriceFeed:
      "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
  },
};

const developmentChains = ["hardhat", "localhost"];
const DECIMALS = 8;
const INITIAL_PRICE = 200000000000;

export {
  networkConfig,
  developmentChains,
  DECIMALS,
  INITIAL_PRICE,
};
