var spicedPg = require("spiced-pg");

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
            return results;
        })
        .catch(err => console.log(err));
}

module.exports.getImages = getImages;
