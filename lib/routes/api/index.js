const express = require('express');
const router = express.Router();

const {
  successResponse,
  errorResponse,
} = require('../../helpers')

const NFT = require('../../components/NFT')
const nft = new NFT()

const logger = require('../../components/Logger')

router.get('/ping', (request, response) => {
  return successResponse(response, 'pong')
})

router.post('/mint', async (request, response) => {
  try {
    const { address, tokenURI } = request.body
    const minted = await nft.mint(address, tokenURI)
    return successResponse(response, "Success", minted)
  } catch (error) {
    console.log(error)
    return errorResponse(response, error)
  }
})

router.post('/ipfsUpload', async (request, response) => {
  try {
    const { json } = request.body
    const ipfs = await nft.IPFSUpload(json)
    return successResponse(response, "Success", ipfs)
  } catch (error) {
    console.log(error)
    return errorResponse(response, error)
  }
})

router.post('/ipfsUploadAndMint', async (request, response) => {
  try {
    const { address, json } = request.body
    const ipfs = await nft.IPFSUpload(json)
    const tokenURI = ipfs.IpfsHash
    let minted = await nft.mint(address, tokenURI)
    minted.ipfs = ipfs
    return successResponse(response, "Success", minted)
  } catch (error) {
    console.log(error)
    return errorResponse(response, error)
  }
})

module.exports = router;
