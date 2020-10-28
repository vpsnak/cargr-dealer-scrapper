const fs = require('fs');
const config = require('./config.js')
const db = require('./storage.js');
const dealers = require('./dealers.js');
const dealerDetails = require('./dealer-details.js');

const scrapAndSaveData = () =>{
  dealers.populateDB(db)
    .then(() =>{
      console.log(db);
      fs.writeFile(config.db.file, JSON.stringify(db), function (err) {
        if (err) return console.log(err);
        console.log('Error saving data in db.json');
      });
    })
}

const saveDB = () => {
  return new Promise((resolve, reject) => {
    fs.writeFile(config.db.file, JSON.stringify(db), function (err) {
      if (err) {
        return reject(err);
      }
      console.log('Saved data in db.json');
      resolve();
    });
  })
}


const loadDB = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(config.db.file, (err, data) => {
        if (err) {
          scrapAndSaveData();
          return reject(err);
        }
        Object.assign(db, JSON.parse(data));
        resolve();
    });
  })
}

(async () => {
  await loadDB();
  console.log('Database ready to use!');
  
  dealerDetails.scrapDealerDetails(db);

  await saveDB();
})();