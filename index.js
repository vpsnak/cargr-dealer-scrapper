const { db, saveDB, loadDB } = require('./storage.js');
const dealers = require('./dealers.js');
const dealerDetails = require('./dealer-details.js');

const scrapAndSaveData = () =>{
  return new Promise((resolve, reject) => {
    dealers.populateDB(db)
      .then(() =>{
        saveDB().then(() =>{
          resolve();
        });
      }).catch((err)=>{
        reject(err)
      })
  })
}

(async () => {
  // await scrapAndSaveData();
  await loadDB();
  console.log('Database ready to use!');

  // await dealers.populateDB(db);
  
  await dealerDetails.populateDB(db);
})();