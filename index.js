const express = require("express");
const app = express();
const db = require("./db.js");
const bodyParser = require("body-parser");
const config = require("./config");

const getImages = db.getImages;

app.use(express.static("./public"));

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/images", (req, res) => {
    getImages().then(images => {
        console.log("Results from get images", images);
        res.json({ images: images });
    });
});

app.listen(8080, function() {
    console.log("Listening Image Board");
});
