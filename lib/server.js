require('./components/Database')
const logger = require('./components/Logger')

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')

const app = express()
const port = process.env.SERVER_PORT || 4000

const server = app.listen(port, () => {
  app.use(express.json())
  app.use(helmet())
  app.use(cors())
  app.use('/', require('./routes'))
  logger.info(`Listening on port: ${port}`)
})

process.on('unhandledRejection', (reason, p) => {
  console.log(reason)
  console.log(p)
  logger.error('Unhandled Rejection at Promise');
  logger.error(reason)
  logger.error(p)
});

process.on('uncaughtException', error => {
  console.log(error)
  logger.error('Uncaught Exception thrown');
  logger.error(error.message || error)
  process.exit(1);
});
