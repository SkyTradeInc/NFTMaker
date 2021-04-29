const Invoice = require('../models/Invoice')
const logger = require('./Logger')
const web3  = require('web3')

class Web3 {
  constructor() {
    this.http = new web3(new web3.providers.HttpProvider(process.env.BLOCKCHAIN_RPC_URL));
    this.init()
  }

  sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, ms)
    })
  }

  init() {
    setInterval(async() => {
      await this.checkTransactions()
    }, 30000)
  }

  checkTransactions() {
    return new Promise(async(resolve, reject) => {
      const invoices = await Invoice.find({ ipfsCreated: true, txCreated: true, nftCreated: false })
      for (let i = 0; i < invoices.length; i++ ) {
        await this.sleep(2000)
        const tx = await this.http.eth.getTransactionReceipt(invoices[i].txHash)
        if (!tx) continue;
        const invoice = await Invoice.findOne({ invoiceId: invoices[i].invoiceId})
        if (!invoice) continue;
        // console.log(parseInt(tx.logs[0].topics[3]))
        logger.info(`Updating DB for invoice ID: ${invoices[i].invoiceId}, NFT Address: ${tx.to}, NFT Index: ${parseInt(tx.logs[0].topics[3])}`)
        invoice.nftCreated = true;
        invoice.nftAddress = tx.to;
        invoice.nftIndex = parseInt(tx.logs[0].topics[3]);
        await invoice.save()
      }
      resolve()
    })
  }

}

module.exports = new Web3();
