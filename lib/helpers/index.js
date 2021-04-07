const fs = require('fs')
const axios = require('axios')
const logger = require('../components/Logger')

const objectIdToTimestamp = (objectId) => {
  return parseInt(objectId.toString().substring(0,8), 16)*1000
}

const isObjectEmpty = (object) => {
  return Object.entries(object).length === 0
}

const isArray = (array) => {
  return Array.isArray(array);
}

const myobWebhook = (cfURI, invoiceUid, statusCode, responseCode = null, responseReason = null) => {
  return new Promise(async(resolve, reject) => {
    try {
      logger.info(`[MYOB WEBHOOK] UID: ${invoiceUid} | StatusCode: ${statusCode} | ResponseCode: ${responseCode} | ResponseReason: ${responseReason}`)
      const response = await axios.post(`${process.env.NODE_ENV === "dev" ? "http://localhost:1337/" : `https://api.myob.com/accountright/${cfURI}/Sale/Invoice/EInvoiceEvent`}`, {
        InvoiceUid: invoiceUid,
        AppDevKey: process.env.MYOB_APP_DEV_KEY,
        StatusCode: statusCode,
        ResponseCode: responseCode,
        ResponseReason: responseReason,
      })
      resolve(response.data)
    } catch (error) {
      reject(error)
    }
  })
}

const successResponse = (response, message = null, data = null) => {
  response.status(200).send({
    success: true,
    timestamp: Date.now(),
    message,
    data
  })
}

const errorResponse = (response, message, data = null, status = 403) => {
  response.status(status).send({
    success: false,
    timestamp: Date.now(),
    message,
    data,
  })
}

const appendFile = (path, data) => {
  return new Promise((resolve, reject) => {
    fs.appendFile(path, data, 'utf8', function (error) {
      if (error) return reject(error);
      return resolve(true);
    });
  });
};

const readFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', function (error, data) {
      if (error) return reject(error);
      return resolve(data);
    });
  });
};

const writeFile = (path, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, 'utf8', (error) => {
      if(error) return reject(error);
      return resolve(true);
    })
  })
}

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(()=>{
      resolve(true)
    }, ms)
  })
}

const average = (array) => array.reduce((a, b) => a + b) / array.length;

module.exports = {
  myobWebhook,
  isArray,
  isObjectEmpty,
  successResponse,
  errorResponse,
  readFile,
  writeFile,
  average,
  sleep,
}
