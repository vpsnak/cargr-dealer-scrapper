const fs = require('fs');
const config = require('./config.js')

const db = {
    regions: [],
    dealers: []
};

const saveDB = () => {
    return new Promise((resolve, reject) => {
        fs.writeFile(config.db.file, JSON.stringify(db), function (err) {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    })
}

const loadDB = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(config.db.file, (err, data) => {
        if (err) {
          return reject(err);
        }
        Object.assign(db, JSON.parse(data));
        resolve();
    });
  })
}

module.exports = { db, saveDB, loadDB }