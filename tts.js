const textToSpeech = require('@google-cloud/text-to-speech');

process.env.GOOGLE_APPLICATION_CREDENTIALS = 'serviceaccount.json'

require('dotenv').config()
const fs = require('fs')
const util = require('util')

const client = new textToSpeech.TextToSpeechClient()

export async function convertTextToMP3(text) {

    const request = {
        input: {text: text},
        voice: {languageCode: 'en', ssmlGender: 'NEUTRAL'},
        audioConfig: {audioEncoding: 'MP3'}
    }

    const [response] = await client.synthesizeSpeech(request)

    const writeFile = util.promisify(fs.writeFile)

    await writeFile("output.mp3", response.audioContent, 'binary')

    console.log("Audio file completed")
}
