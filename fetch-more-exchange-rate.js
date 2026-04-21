const https = require('https');
const fs = require('fs');
const path = require('path');

const outputFile = path.join(__dirname, 'exchange-rate.json');
const moreExchangeApiUrl = process.env.MORE_EXCHANGE_API_URL || 'https://api.exchangerate.host/latest?base=BRL&symbols=CLP';
const providerName = process.env.MORE_EXCHANGE_PROVIDER_NAME || 'More Exchange';

function fetchRate(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          if (res.statusCode !== 200) {
            return reject(new Error('Unexpected status code: ' + res.statusCode));
          }
          try {
            const data = JSON.parse(body);
            if (data && data.rates && data.rates.CLP) {
              return resolve(Number(data.rates.CLP));
            }
            reject(new Error('CLP rate not found in response'));
          } catch (err) {
            reject(err);
          }
        });
      })
      .on('error', reject);
  });
}

function writeRate(rate) {
  const payload = {
    source: providerName,
    base: 'BRL',
    target: 'CLP',
    rate: rate,
    updatedAt: new Date().toISOString()
  };

  fs.writeFileSync(outputFile, JSON.stringify(payload, null, 2), 'utf8');
  console.log('Exchange rate updated:', payload);
}

fetchRate(moreExchangeApiUrl)
  .then(writeRate)
  .catch((err) => {
    console.error('Failed to fetch exchange rate:', err.message);
    process.exit(1);
  });
