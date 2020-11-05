const { db, loadDB } = require('./storage.js');
const dealers = require('./dealers.js');
const dealerDetails = require('./dealer-details.js');
const { exportToExcel } = require('./export');

(async () => {
  await loadDB();
  console.log('Database ready to use!');
  
  await dealers.populateDB(db);
  
  await dealerDetails.populateDB(db);

  exportToExcel(db);
})();