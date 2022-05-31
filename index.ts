const express = require('express');
const https = require('https');
const http = require('http');
const url = require('url');
const bodyParser = require('body-parser');
const dotenv = require('dotenv'); // is used to read environment variables

dotenv.config();

const host = 'localhost';
const PORT = process.env.PORT || 3000;
const app = express();

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send('<h1>Hello from the TypeScript + Express world!</h1>');
} );

app.listen(PORT, () => console.log(`[server]: Server is running at http://${host}:${PORT}`));