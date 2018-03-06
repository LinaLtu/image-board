const spicedPg = require("spiced-pg");
const config = require("./config");

// var { dbUser, dbPass } = require("../secrets.json");

var db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/images`
);

function getImages() {
    const q = `SELECT * FROM images ORDER BY created_at DESC`;

    return db
        .query(q)
        .then(results => {
            console.log(results.rows);
            let images = results.rows;
            images.forEach(function(image) {
                let url = config.s3Url + image.image;
                image.image = url;
            });
            return images;
        })
        .catch(err => console.log(err));
}

function insertImageIntoDB(image, username, title, description) {
    const q = `INSERT INTO images (image, username, title, description) VALUES ($1, $2, $3, $4) RETURNING *`;
    const params = [image, username, title, description];

    return db
        .query(q, params)
        .then(results => {
            console.log("Insert new signature was successful");
            return results;
        })
        .catch(err => console.log(err));
}

module.exports.getImages = getImages;
module.exports.insertImageIntoDB = insertImageIntoDB;
