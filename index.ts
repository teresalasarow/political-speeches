// const express = require('express');
const https = require('https');
const http = require('http');
const url = require('url');
// const bodyParser = require('body-parser');

const host = 'localhost';
const PORT = process.env.PORT || 3000;
// const app = express();

const options = {
    host: host,
    path: '/evaluation',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

// Create a local server to receive data from
const server = http.createServer();

//Listen to the request event
server.on('request', (request, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        data: 'Hello from the TypeScript world!'
    }));
});

server.listen(PORT, () => console.log(`Server is running on http://${host}:${PORT}`));