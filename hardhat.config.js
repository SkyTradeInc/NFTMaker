require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
const { API_URL, WEB3_PRIVATE_KEY } = process.env;
module.exports = {
   solidity: "0.8.0",
   defaultNetwork: "ropsten",
   networks: {
      hardhat: {},
      ropsten: {
         url: API_URL,
         accounts: [`0x${WEB3_PRIVATE_KEY}`]
      }
   },
}
