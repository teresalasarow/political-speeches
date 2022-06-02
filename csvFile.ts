import * as fs from "fs";
import * as path from "path";
import {parse} from "csv-parse";

type PoliticalSpeeches = {
    Speaker: string;
    Topic: string;
    Date: string;
    Words: number;
};

const resultData = new Map<string, string>();

function findSpeakerWithLeastWords(entry: any, speaker: Map<string, number>, value) {
    let name = entry['Speaker'];
    if (!speaker.has(name)) {
        // @ts-ignore
        speaker.set(name, value);
    } else {
        // @ts-ignore
        let val: number = speaker.get(name);
        // @ts-ignore
        val += value;
        speaker.set(name, val);
    }
}

export const readCSVFile = async () => {

    const csvFilePath = path.resolve(__dirname, 'political-speeches.csv');
    const headers = ['Speaker', 'Topic', 'Date', 'Words'];
    const fileContent = fs.readFileSync(csvFilePath, {encoding: 'utf-8'});

    // Reads the content of the given csv-file and returns the results as an array of items
    parse(fileContent, {
        delimiter: ',',
        columns: headers,
        fromLine: 2,
        // Converts the string of spoken words into an integer value
        cast: (value, context) => {
            if (context.column === 'Words') {
                return parseInt(value, 10);
            }
            return value
        }
    }, (error, result: PoliticalSpeeches) => {
        if (error) {
            console.error(error);
        }

        /*
           Iterate over each single entry of the result array to calculate the answers on the
           following questions:
            [1] Which politician gave the most speeches in 2013?
            [2] Which politician gave the most speeches on the topic „Internal Security"?
            [3] Which politician used the fewest words (in total)?
         */

        let speaker = new Map<string, number>();
        Object.values(result).forEach((entry: any) => {
            for (let [key, value] of Object.entries(entry)) {
                switch (key) {
                    case 'Topic': {
                        // @ts-ignore
                        if (value.includes('Security')) {
                            resultData.set('mostSecurity', entry['Speaker']);

                        } else {
                            resultData.set('mostSecurity', "nil");
                        }
                        break;
                    }
                    case 'Date': {
                        // @ts-ignore
                        if (value.includes('2013')) {
                            resultData.set('mostSpeeches', entry['Speaker']);
                        } else {
                            resultData.set('mostSpeeches', "nil");
                        }
                        break;
                    }
                    case 'Words': {
                        findSpeakerWithLeastWords(entry, speaker, value);
                        for (let [key,value] of speaker) {
                            if (value === Math.min(...speaker.values())) {
                                resultData.set('leastWordy', key);
                            }
                        }
                    }
                }
            }
        });
        return resultData;
    });

    return resultData;
};