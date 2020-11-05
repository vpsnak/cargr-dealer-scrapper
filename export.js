const Excel = require('exceljs')
const config = require('./config.js');

const exportToExcel = (db) => {
    let workbook = new Excel.Workbook();
    let sheets = [];
    
    for(const type of config.dealers.vehicleTypesToExport){
        sheets[type] = workbook.addWorksheet(type);
        sheets[type].columns = [
            { header: 'Name', key: 'name', width: 50 },
            { header: 'Location', key: 'location', width: 20 },
            // { header: 'Link', key: 'link', width: 32 },
            { header: 'Store Name', key: 'storename0', width: 30 },
            { header: 'Store Email', key: 'email0', width: 32 },
            { header: 'Store Name', key: 'storename1', width: 30 },
            { header: 'Store Email', key: 'email1', width: 32 },
            { header: 'Store Name', key: 'storename2', width: 30 },
            { header: 'Store Email', key: 'email2', width: 32 },
            { header: 'Store Name', key: 'storename3', width: 30 },
            { header: 'Store Email', key: 'email3', width: 32 },
            { header: 'Store Name', key: 'storename4', width: 30 },
            { header: 'Store Email', key: 'email4', width: 32 },
            { header: 'Store Name', key: 'storename5', width: 30 },
            { header: 'Store Email', key: 'email5', width: 32 },
            { header: 'Store Name', key: 'storename6', width: 30 },
            { header: 'Store Email', key: 'email6', width: 32 },
            { header: 'Store Name', key: 'storename7', width: 30 },
            { header: 'Store Email', key: 'email7', width: 32 },
            { header: 'Store Name', key: 'storename8', width: 30 },
            { header: 'Store Email', key: 'email8', width: 32 },
            { header: 'Store Name', key: 'storename9', width: 30 },
            { header: 'Store Email', key: 'email9', width: 32 },
            { header: 'Store Name', key: 'storename11', width: 30 },
            { header: 'Store Email', key: 'email11', width: 32 },
            { header: 'Store Name', key: 'storename10', width: 30 },
            { header: 'Store Email', key: 'email10', width: 32 },
            { header: 'Store Name', key: 'storename12', width: 30 },
            { header: 'Store Email', key: 'email12', width: 32 },
          ];
    }
    db.dealers.map(dealer => {
        const { name, location, link, vtype, stores } = dealer;
        let entry = {
            name: name,
            location: location,
            // link: `${link}contact`
        };
        stores.map((store, index) => {
            if(store.email){
                entry[`storename${index}`] = store.title;
                entry[`email${index}`] = store.email;
            }
        })
        sheets[vtype].addRow(entry);
    })
    workbook.xlsx.writeFile(config.export.file)
}

module.exports = { exportToExcel }