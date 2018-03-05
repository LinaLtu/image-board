const express = require("express");
const app = express();
const db = require("./db.js");

const getImages = db.getImages;

app.use(express.static("./public"));

// app.get("/", (req, res) => {
//     console.log("we are here");
// });

app.listen(process.env.PORT || 8080, function() {
    console.log("Listening Image Board");
});
