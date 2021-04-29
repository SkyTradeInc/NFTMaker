const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
  originalPayload: {type: Object, default: {}},
  invoiceId: { type: String, default: '' },
  invoiceNumber: { type: String, default: '' },
  amountDue: { type: String, default: '' },
  invoiceCurrency: { type: String, default: '' },
  dueDate: { type: String, default: '' },
  issueDate: { type: String, default: '' },
  ipfsCreated: { type: Boolean, default: false },
  ipfsHash: { type: String, default: '' },
  txCreated: { type: Boolean, default: false },
  txHash: { type: String, default: '' },
  nftCreated: { type: Boolean, default: false },
  nftAddress: { type: String, default: '' },
  nftIndex: { type: String, default: '' },
});

invoiceSchema.set('timestamps', true)

module.exports = mongoose.model('Invoice', invoiceSchema);
