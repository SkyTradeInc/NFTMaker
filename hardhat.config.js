require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
const { BLOCKCHAIN_RPC_URL, WEB3_PRIVATE_KEY } = process.env;
module.exports = {
   solidity: "0.8.0",
   defaultNetwork: "mumbai",
   networks: {
      hardhat: {},
      ropsten: {
         url: BLOCKCHAIN_RPC_URL,
         accounts: [`0x${WEB3_PRIVATE_KEY}`]
      },
      mumbai: {
         url: BLOCKCHAIN_RPC_URL,
         accounts: [`0x${WEB3_PRIVATE_KEY}`]
      },
   },
}
