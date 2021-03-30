
const fs = require('fs');
const express = require('express');
const ejs = require('ejs');
const PredictionApiClient = require("azure-cognitiveservices-customvision-prediction");
const predictionKey = "4b82869e737b43cc9f087c1888d12d07";
const endpoint = "https://southcentralus.api.cognitive.microsoft.com"
const mongoose = require("mongoose");
const app = express();
const port = 8080;
const Disease = require("./Models/diseaseSchema");
app.use(express.static('public'));
app.use(express.json({limit:"10mb"}));
app.set('view engine', 'ejs');
const uri = 'mongodb+srv://group02:'+process.env.pswd+'@cluster01.u5iy3.mongodb.net/SkinDisease?retryWrites=true&w=majority'

let img64 = "";
let disease = "";
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

app.post("/saveImage", (req,res) => {
    img64 = req.body.image;
    res.send(img64);
});

app.get("/detect", async (req, res) => {

    let final = "";
    let details = "";
    img64 = img64.split(';base64,').pop();
    //var bitmap = new Buffer(b64, 'base64');
    var bitmap = Buffer.from(img64, 'base64');
    // // write buffer to file
    await fs.writeFileSync("sample.png", bitmap);
    
    const predictor = new PredictionApiClient(predictionKey, endpoint);
	const testFile = fs.readFileSync(`sample.png`);

	const results = await predictor.classifyImage("e5d5c503-b0e7-447e-97e7-ae5d7f792515", "Iteration2", testFile);

	// Show results
    console.log("Results:");
    final = results.predictions[0].tagName;
	// results.predictions.forEach(predictedResult => {
    //     res.send(`\t ${predictedResult.tagName}: ${(predictedResult.probability * 100.0).toFixed(2)}%`);
    //     //final += `\t ${predictedResult.tagName}: ${(predictedResult.probability * 100.0).toFixed(2)}%`;
    // });
    
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
        .then((result) => {
            Disease.findOne({"name":final})
                .then((result) => {
                    console.log("result: \n"+result);
                    res.render('details', {
                        name: result.name,
                        description: result.description,
                        causes:result.causes,
                        link: result.link,
                        imageFile:testFile

                    });
        })
        .catch((err) => {
            console.log(err);
        })
    })
        .catch((err) => { console.log(err) });
    
    
    
    // res.render('details', {
    //     description:
    // })
});

app.get("/test", (req, res) => {
    res.sendFile(__dirname + "/views/home.html")
})

app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});

