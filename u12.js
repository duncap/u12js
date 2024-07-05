#!/usr/bin/env node

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

if (process.argv.length < 5) {
  console.error('Usage: u12.js <domain> <offer> <path-to-file>');
  process.exit(1);
}

const [,, domain, offer, filePath] = process.argv;

const submitOffer = async () => {
  try {
    const form = new FormData();
    form.append('title', offer);
    form.append('offerFile', fs.createReadStream(filePath));

    const response = await axios.post(`http://${domain}/offer`, form, {
      headers: {
        ...form.getHeaders()
      }
    });

    console.log(response.data.message);
  } catch (error) {
    console.error('Error submitting offer:', error.response ? error.response.data : error.message);
  }
};

submitOffer();
