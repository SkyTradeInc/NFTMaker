require('dotenv').config();

const axios = require('axios')
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(process.env.API_URL);
const contract = require("../../artifacts/contracts/MyNFT.sol/MyNFT.json");

class NFT {
  constructor() {
    this.publicKey = process.env.WEB3_PUBLIC_KEY;
    this.privateKey = process.env.WEB3_PRIVATE_KEY;
    this.contractAddress = process.env.CONTRACT_ADDRESS;
    this.nftContract = new web3.eth.Contract(contract.abi, this.contractAddress);
    this.ipfsApiKey = process.env.IPFS_API_KEY
    this.ipfsSecretKey = process.env.IPFS_SECRET_KEY
  }

  mint(address, tokenURI) {
    return new Promise(async(resolve, reject) => {
      try {
        const nonce = await web3.eth.getTransactionCount(this.publicKey, 'latest');
        const tx = {
          'from': this.publicKey,
          'to': this.contractAddress,
          'nonce': nonce,
          'gas': 500000,
          'data': this.nftContract.methods.mintNFT(address, tokenURI).encodeABI()
        };
        const signPromise = web3.eth.accounts.signTransaction(tx, this.privateKey);
        signPromise.then((signedTx) => {
          web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(err, hash) {
            if (!err) {
              resolve({
                message: `The hash of your transaction is: ${hash} Check Alchemy's Mempool to view the status of your transaction!`,
                transactionHash: hash,
                tokenURI: tokenURI,
                address: address
              });
            } else {
              reject("Something went wrong when submitting your transaction:", err)
            }
          });
        }).catch((err) => {
          reject(`Promise failed: ${err}`);
        });
      } catch (error) {
        reject(error)
      }
    })
  }

  IPFSUpload(invoiceJSON) {
    return new Promise(async(resolve, reject) => {
      try {
        axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', invoiceJSON, { headers: { pinata_api_key: this.ipfsApiKey, pinata_secret_api_key: this.ipfsSecretKey } })
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      } catch (error) {
        reject(error)
      }
    })
  }



}

module.exports = NFT
