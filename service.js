const dotenv = require('dotenv').config()
const logger = require('./lib/components/Logger');

logger.info('Initiating service...')

process.title = 'NFT Maker'

const server = require('./lib/server.js')
