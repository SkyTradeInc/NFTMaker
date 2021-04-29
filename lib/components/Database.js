const mongoose = require('mongoose');
const logger = require('./Logger')

mongoose.connect(`mongodb://${ process.env.MONGO_HOST || '127.0.0.1' }/${ process.env.MONGO_DB || 'invoiceNFT' }`, { useNewUrlParser: true, useUnifiedTopology: true, }, (error) => {
  if(!error) return;
  logger.error('Connection to MongoDB unsuccessful')
})

const db = mongoose.connection

db.on('connected', () => {
  logger.info('Connected to MongoDB')
});
