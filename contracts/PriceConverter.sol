// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
  function getDecimals() internal view returns (uint256) {
    AggregatorV3Interface priceFeed = AggregatorV3Interface(
      0x694AA1769357215DE4FAC081bf1f309aDC325306
    );
    return priceFeed.decimals();
  }

  function getPrice(
    AggregatorV3Interface priceFeed
  ) internal view returns (uint256) {
    (, int price, , , ) = priceFeed.latestRoundData();

    return uint256(price * 1e10);
  }

  function getConversionRate(
    uint256 ethAmount,
    AggregatorV3Interface priceFeed
  ) internal view returns (uint256) {
    uint256 ethPrice = getPrice(priceFeed);
    uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18;

    return ethAmountInUsd;
  }
}
