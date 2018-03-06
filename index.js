const express = require("express");
const app = express();
const db = require("./db.js");
const bodyParser = require("body-parser");
const config = require("./config");

const getImages = db.getImages;
const insertImageIntoDB = db.insertImageIntoDB;

var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(express.static("./public"));

app.use(bodyParser.urlencoded({ extended: false }));

app.post("/upload", uploader.single("file"), function(req, res) {
    // console.log("Inside Post /upload");
    // If nothing went wrong the file is already in the uploads directory
    if (req.file) {
        insertImageIntoDB(
            req.file.filename,
            req.body.username,
            req.body.title,
            req.body.description
        ).then(results => {
            // console.log("Upload Successful", results.rows[0]);
            res.json({
                id: results.rows[0].id,
                title: results.rows[0].title,
                description: results.rows[0].description,
                username: results.rows[0].username,
                timestamp: results.rows[0].created_at,
                image: results.rows[0].image
            });
        });

        // res.json({
        //     title: results.data.title,
        //     description: results.data.description,
        //     username: results.data.username
        // });

        //db.query - insert in title, description, username (req.body.) the file is not in req.body, however(req.file.filename)
        //return data of the images
        //then, res.json back the data of the new image
    } else {
        console.log("Upload didin't work");
        res.json({
            success: false
        });
    }
});

app.get("/images", (req, res) => {
    getImages().then(images => {
        // console.log("Results from get images", images);
        res.json({ images: images });
    });
});

app.listen(8080, function() {
    console.log("Listening Image Board");
});
