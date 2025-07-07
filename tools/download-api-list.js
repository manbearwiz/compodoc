const https = require('node:https');
const fs = require('node:fs');
const options = {
    hostname: 'angular.io',
    path: '/generated/docs/api/api-list.json',
    method: 'GET'
};
const file = fs.createWriteStream('src/data/api-list.json');
const req = https.request(options, res => {
    if (res.statusCode === 200) {
        console.log('Download ok');
    }
    res.on('data', d => {
        file.write(d);
    });
});

req.end();

req.on('error', e => {
    console.error(e);
});
