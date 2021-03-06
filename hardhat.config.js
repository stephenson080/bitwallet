require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-truffle5");

require('dotenv').config()


// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const accounts = [process.env.ACCOUNTPK1 ,process.env.ACCOUNTPK2,  process.env.ACCOUNTPK3 ]
module.exports = {
  solidity: "0.8.4",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
    },
    rinkeby: {
      url: process.env.RINKEBY_NETWORK,
      accounts: accounts
    },
    kovan: {
      url: process.env.KOVAN_NETWORK,
      accounts: accounts
    },
    testnet: {
      url: "https://speedy-nodes-nyc.moralis.io/2c6e94da4d4dabdf417f05a7/bsc/testnet",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: {mnemonic: process.env.MNEMONIC_PHRASE}
    }
  }
};
