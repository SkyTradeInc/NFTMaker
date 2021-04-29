require('dotenv').config();
const { BLOCKCHAIN_RPC_URL, WEB3_PUBLIC_KEY, WEB3_PRIVATE_KEY } = process.env;
const contractAddress = process.env.CONTRACT_ADDRESS;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(BLOCKCHAIN_RPC_URL);
const contract = require("./artifacts/contracts/MyNFT.sol/MyNFT.json");
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

async function mintNFT(tokenURI) {
  const nonce = await web3.eth.getTransactionCount(WEB3_PUBLIC_KEY, 'latest'); //get latest nonce

  //the transaction
  const tx = {
    'from': WEB3_PUBLIC_KEY,
    'to': contractAddress,
    'nonce': nonce,
    'gas': 500000,
    'data': nftContract.methods.mintNFT(WEB3_PUBLIC_KEY, tokenURI).encodeABI()
  };

  console.log(tx)

  const signPromise = web3.eth.accounts.signTransaction(tx, WEB3_PRIVATE_KEY);
  signPromise.then((signedTx) => {
    web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(err, hash) {
      if (!err) {
        const payload = {
          message: `The hash of your transaction is: ${hash}`,
          explorer: `${process.env.BLOCKCHAIN_EXPLORER_URL}/tx/${hash}`,
          transactionHash: hash,
          tokenURI: tokenURI,
          address: contractAddress
        }
        console.log(payload);
      } else {
        console.log("Something went wrong when submitting your transaction:", err)
      }
    });
  }).catch((err) => {
    console.log(" Promise failed:", err);
  });
}

mintNFT("https://gateway.pinata.cloud/ipfs/QmSwkMZoegxCcCtPwQoD1KTEJQPFyMBqQFXHCV7q6K8uLR")
