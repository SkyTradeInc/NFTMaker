# NFTMaker

**Table of Contents**
- [Download and Setup](#setup-guide)
- [API Routes](#api)

# Setup Guide

### Download and install dependencies

`git clone https://github.com/SkyTradeInc/NFTMaker.git`

`cd NFTMaker`

`npm i`

`touch .env`

### Adding required environment variables

Edit the `.env` file and add the following

```
SERVER_PORT=
API_URL=
WEB3_PUBLIC_KEY=
WEB3_PRIVATE_KEY=
CONTRACT_ADDRESS=
IPFS_API_KEY=
IPFS_SECRET_KEY=
```
- `SERVER_PORT` (OPTIONAL) Default is `4000`
- `API_URL` [Alchemy](https://www.alchemyapi.io/) Ropsten API Key
- `WEB3_PUBLIC_KEY` Ropsten Address Public Key
- `WEB3_PRIVATE_KEY` Ropsten Address Private Key
- `CONTRACT_ADDRESS` NFT Creator contract deployed on Ropsten (see below to deploy)
- `IPFS_API_KEY` [Pinata](https://pinata.cloud/) API Key
- `IPFS_SECRET_KEY` https://pinata.cloud/ Secret Key

*Note: The Ropsten address requires a some balance*
- [Ropsten Faucet #1](https://faucet.dimensions.network/)
- [Ropsten Faucet #2](https://faucet.ropsten.be/)  

### Starting Service

Run `npx hardhat run scripts/deploy.js --network ropsten` to create the NFT Factory contract on Ropsten and add this to the `CONTRACT_ADDRESS` environment variable

Run `node service.js` to begin the service

# API

### Create NFT with IPFS URI

```
POST /api/mint
```

Object Name| Type| Mandatory|
----| ----|------
address|STRING| YES
tokenURI|STRING|YES

### Create IPFS with JSON Payload

```
POST /api/ipfsUpload
```

Object Name| Type| Mandatory|
----| ----|------
json|STRING| YES

### Create Invoice (NFT) with JSON Payload

```
POST /api/ipfsUpload
```

Object Name| Type| Mandatory|
----| ----|------
address|STRING| YES
json|STRING| YES
