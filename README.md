# NFTMaker

Draft

## Quick start

### Download and install dependencies

`git clone https://github.com/SkyTradeInc/NFTMaker.git`

`cd NFTMaker`

`npm i`

`touch .env`

Edit the `.env` file and add the following

```
API_URL=
WEB3_PRIVATE_KEY=
WEB3_PUBLIC_KEY=
CONTRACT_ADDRESS=
```


Run `npx hardhat run scripts/deploy.js --network ropsten` to create the NFT Contract on Ropsten

Run `node index` to MINT an NFT
