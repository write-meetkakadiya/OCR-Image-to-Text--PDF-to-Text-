const express = require('express');
const app = express();
const vision = require('@google-cloud/vision');
const { json } = require('body-parser');
// const {Translate} = require('@google-cloud/translate').v2;
// const translate = new Translate();
// Creates a client
const client = new vision.ImageAnnotatorClient({
    keyFilename: 'APIkey.json'
});

// Performs label detection on the image file
// client
//     .labelDetection('./demo.png')
//     .then(results => {
//         const labels = results[0].labelAnnotations;

//         console.log('Labels:');
//         labels.forEach(label => console.log(label.description));
//         //console.log(results);
//     })
//     .catch(err => {
//         console.error('ERROR:', err);
//     });

// Image to text
app.use('/test', async function () {
    // const [result] = await client.textDetection('./demo.png');
    const [result] = await client.textDetection('./demo1.jpg');
    const detections = result.textAnnotations;
    console.log('Text:');
    console.log('-----------DATA-----------', detections[0].description)
    // detections.forEach(text => console.log(text[0].description));
})

// PDF to text

app.use('/text', async function () {
    const gcsSourceUri = `gs://test710/sample1.pdf`;
    const gcsDestinationUri = `gs://test710/output/`;

    // const gcsSourceUri = `./sample.pdf`;
    // const gcsDestinationUri = `./`;

    const inputConfig = {
        // Supported mime_types are: 'application/pdf' and 'image/tiff'
        mimeType: 'application/pdf',
        gcsSource: {
            uri: gcsSourceUri,
        },
    };
    const outputConfig = {
        gcsDestination: {
            uri: gcsDestinationUri,
        },
    };
    const features = [{ type: 'DOCUMENT_TEXT_DETECTION' }];
    const request = {
        requests: [
            {
                inputConfig: inputConfig,
                features: features,
                outputConfig: outputConfig,
            },
        ],
    };

    const [operation] = await client.asyncBatchAnnotateFiles(request);
    const [filesResponse] = await operation.promise();
    const destinationUri =
        filesResponse.responses[0].outputConfig.gcsDestination.uri;
    console.log('Json saved to: ' + JSON.stringify(filesResponse.responses));
})

app.listen(5000, '127.0.0.1', () => console.log('Server running'));