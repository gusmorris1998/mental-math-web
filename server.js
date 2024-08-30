const express = require('express');
const cors = require('cors');
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const path = require('path');

process.env.GOOGLE_APPLICATION_CREDENTIALS = 'serviceaccount.json';
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all routes

const client = new textToSpeech.TextToSpeechClient();

async function convertTextToMP3(text) {
    const request = {
        input: { text: text },
        voice: { languageCode: 'en', ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' }
    };

    const [response] = await client.synthesizeSpeech(request);
    const writeFile = util.promisify(fs.writeFile);
    const filePath = path.join(__dirname, 'temp','output.mp3');

    await writeFile(filePath, response.audioContent, 'binary');
    console.log("Audio file completed");

    return filePath;
}

app.get('/convert', async (req, res) => {
    console.log('Received request to convert text');
    const text = req.query.text;
    if (!text) {
        console.error('Text query parameter is required');
        return res.status(400).send('Text query parameter is required');
    }

    try {
        const filePath = await convertTextToMP3(text);
        
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('Internal Server Error');
            }
        });
    } catch (error) {
        console.error('Error during conversion:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});