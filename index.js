const express = require('express');
const app = express();
const db = require('./db.js');
const s3 = require('./s3.js');
const bodyParser = require('body-parser');
const config = require('./config');
const InfiniteLoading = require('vue-infinite-loading');

const getImages = db.getImages;
const insertImageIntoDB = db.insertImageIntoDB;
const getImageById = db.getImageById;
const getComments = db.getComments;
const insertComment = db.insertComment;
const upload = s3.upload;

var multer = require('multer');
var uidSafe = require('uid-safe');
var path = require('path');

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + '/uploads');
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

app.use(express.static('./public'));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.post('/upload', uploader.single('file'), s3.upload, function(req, res) {
    if (req.file) {
        insertImageIntoDB(
            req.file.filename,
            req.body.username,
            req.body.title,
            req.body.description
        ).then(results => {
            res.json({
                id: results.id,
                title: results.title,
                description: results.description,
                username: results.username,
                timestamp: results.created_at,
                image: results.image
            });
        });
    } else {
        console.log("Upload didin't work");
        res.json({
            success: false
        });
    }
});

app.get('/imagesList/:offset', (req, res) => {
    getImages(req.params.offset).then(images => {
        res.json({ images });
    });
});

app.get('/images/:id', function(req, res) {
    var id = req.params.id;
    getImageById(id).then(image => {
        if (image) {
            image.image = config.s3Url + image.image;
            res.json({
                image,
                success: true
            });
        } else {
            res.json({ success: false });
        }
    });
});

app.post('/comments', function(req, res) {
    insertComment(req.body.image_id, req.body.username, req.body.comments).then(
        results => {
            res.json({ results });
        }
    );
});

app.get('/comments/:imageId', function(req, res) {
    getComments(req.params.imageId).then(comments => {
        res.json({ comments });
    });
});

app.listen(8080, function() {
    console.log('Listening Image Board');
});
