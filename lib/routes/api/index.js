const express = require('express');
const router = express.Router();
const axios = require('axios');

const {
  successResponse,
  errorResponse,
} = require('../../helpers')

const NFT = require('../../components/NFT')
const Blockchain = require('../../components/Blockchain')
const Invoice = require('../../models/Invoice')

const logger = require('../../components/Logger')
router.get('/ping', (request, response) => {
  return successResponse(response, 'pong')
})

router.post('/mint', async (request, response) => {
  try {
    const { address, tokenURI } = request.body
    const minted = await NFT.mint(address, tokenURI)
    return successResponse(response, "Success", minted)
  } catch (error) {
    console.log(error)
    return errorResponse(response, error)
  }
})

router.get('/ipfs/:hash', async (request, response) => {
  const { hash } = request.params
  axios.get(`https://ipfs.io/ipfs/${hash}`)
    .then(serverResponse => {
      return successResponse(response, "Success", serverResponse.data)
    })
    .catch(error => {
      return errorResponse(response, error.error)
    })
})

router.post('/ipfsUpload', async (request, response) => {
  try {
    const { json } = request.body
    const ipfs = await NFT.IPFSUpload(json)
    return successResponse(response, "Success", ipfs)
  } catch (error) {
    console.log(error)
    return errorResponse(response, error)
  }
})

router.post('/invoice', async (request, response) => {
  try {
    const address = '0x38264ec73791866E83598F01E6859575cd1058CF'
    const { amountDue, dueDate, id, invoiceCurrency, invoiceNumber, issueDate } = request.body;
    logger.info(`Creating invoice with ID: ${id}`)
    const invoice = await Invoice.findOne({ invoiceId: id })
    if (invoice) {
      logger.info(`Invoice already exists with ID: ${id}`)
      return errorResponse(response, 'Aborting, Invoice already exists', invoice);
    }
    const json = { originalPayload: request.body, invoiceId: id, amountDue, dueDate, invoiceCurrency, invoiceNumber, issueDate }
    logger.info(`Recording new invoice in DB with ID: ${id}`)
    const createdInvoice = await Invoice.create(json)
    logger.info(`Recorded invoice in DB with ID: ${id}`)
    logger.info(`Uploading invoice to IPFS`)
    const ipfs = await NFT.IPFSUpload(json)
    logger.info(`Uploaded IPFS with hash: ${ipfs.IpfsHash}`)
    createdInvoice.ipfsCreated = true;
    createdInvoice.ipfsHash = ipfs.IpfsHash;
    const tokenURI = ipfs.IpfsHash
    logger.info(`Minting NFT invoice`)
    const minted = await NFT.mint(address, tokenURI)
    logger.info(`Minted NFT with TXID: ${minted.transactionHash}`)
    createdInvoice.txCreated = true;
    createdInvoice.txHash = minted.transactionHash;
    await createdInvoice.save()
    return successResponse(response, "Success", createdInvoice)
  } catch (error) {
    console.log(error)
    return errorResponse(response, error)
  }
})

router.post('/ipfsUploadAndMint', async (request, response) => {
  try {
    const { address, json } = request.body
    const ipfs = await NFT.IPFSUpload(json)
    const tokenURI = ipfs.IpfsHash
    let minted = await NFT.mint(address, tokenURI)
    minted.ipfs = ipfs
    return successResponse(response, "Success", minted)
  } catch (error) {
    console.log(error)
    return errorResponse(response, error)
  }
})

module.exports = router;
