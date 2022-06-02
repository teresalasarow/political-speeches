import { readCSVFile }  from "./csvFile";
import express from "express";
import fs, {exists} from "fs";

const dotenv = require('dotenv'); // is used to read environment variables
dotenv.config();

(async () => {
    const https = require('https');
    const http = require('http');
    const createCsvWriter = require('csv-writer').createObjectCsvWriter;
    const options = {
        key: fs.readFileSync('certificates/private.key'),
        cert: fs.readFileSync('certificates/certificate.crt'),
        // ca: fs.readFileSync('certificates/ca_bundle.crt')
    };

    const app = express();

    const host: string = 'localhost';
    const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;

    // App Configurations
    app.use(express.json());

    // call data array with
    // const data = await jsonReturn();
    const csvWriter = createCsvWriter({
        path: 'political-speeches.csv',
        header: [
            {id: 'speaker', title: 'Speaker'},
            {id: 'topic', title: 'Topic'},
            {id: 'date', title: 'Date'},
            {id: 'words', title: 'Words'},
        ]
    });

    let csvData: any[] = [];

    // Entry point without any query parameters
    app.get('/', async (req, res) => {
        try {
            // Data object with 4 different items to be written into a csv-file that is downloaded locally and processed
            csvData = [
                {speaker: 'Alexander Abel', topic: 'Education Policy', date: '30.10.2012', words: 5310},
                {speaker: 'Bernhard Belling', topic: 'Coal Subsidies', date: '05.11.2012', words: 1210},
                {speaker: 'Caesare Collins', topic: 'Coal Subsidies', date: '06.11.2012', words: 1119},
                {speaker: 'Alexander Abel', topic: 'Internal Security', date: '11.12.2012', words: 911}
            ];

            // If the csv File don't exist yet it will be downloaded otherwise not
            if (!fs.existsSync('political-speeches.csv')) {
                csvWriter.writeRecords(csvData).then(() => console.log('CSV File was written successfully'));
            } else {
                console.log("Nothing new to write into the file.")
            }
            res.status(200).send('<html><body><h1>Hello from the TypeScript world!</h1>' +
                '<label>Add /evaluation to get to next side</label></body></html>');
            // let data = await jsonReturn();
        } catch (e) {
            res.status(500).send(e.message);
        }
    });

    // A route handler for the default home page
    app.get( "/evaluation", async ( req, res ) => {
        // let queryParams = req.query;
        // console.log(queryParams);

        try {
            let data = await readCSVFile();
            let jsonObject = {};

            data.forEach((value, key) => {
                jsonObject[key] = value
            });

            res.setHeader('Content-Type', 'text/json');
            res.status(200).send(jsonObject);
        } catch (e) {
            res.status(500).send()
        }
    });

    // Server activation
    // http.createServer(app).listen(PORT, () => {
    //     console.log(`[server]: Server is running at http://${host}:${PORT}`);
    // });
    // https.createServer(options, app).listen(443, () => {
    //     console.log(`[server]: Server is running at https://${host}:${PORT}`)
    // });

    app.listen(PORT, () => console.log(`[server]: Server is running at http://${host}:${PORT}`));
})();