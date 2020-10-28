const puppeteer = require('puppeteer');
const $ = require('cheerio');
const { performance } = require('perf_hooks');
const { saveDB } = require('./storage.js');

const scrapDetails = (dealer, html) => {
    const stores = $('.outlet-container', html);
    dealer.stores = [];
    stores.each(function() {
        scrapStoreDetails(dealer, $(this).html())
    })
}

const scrapStoreDetails = (dealer, storeHtml) => {
    let store = {};
    $('.contact-firstcol', storeHtml).each(function() {
        const item = $(this);
        const key = item.find('span').text().trim();
        const value = item.next('div:not(".contact-firstcol")').text().trim();
        switch(key){
            case 'Διεύθυνση':
                store.address = value;
                break;
            case 'Fax':
                store.fax = value;
                break;
            case 'Email':
                store.email = value;
                break;
            case 'Κινητό':
                store.mobile = value;
                break;
            case 'Ιστοσελίδα':
                store.website = value;
                break;
            case 'Τηλέφωνο':
            case 'Ωράριο λειτουργίας':
            case 'Βαθμολογία':
            // @TODO check why follow us case is not working
            case 'Follow us':
                break;
        }
      })
      dealer.stores.push(store);
}

const populateDB = async (db) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let index = 0, dealerAvgParseTime = 0, dealerParseTime = 0;

    const getTimestamp = () => performance.now() / 1000;

    const startTime = getTimestamp(),
        dealerTotal = db.dealers.length;
    for(const dealer of db.dealers){
      const currentStartTime = getTimestamp(); 
      console.clear();
      console.log(`------ Dealer Details ------`);
      console.log(`Dealer ${index} of ${dealerTotal}`);
      console.log(`Average Parse Time: ${dealerAvgParseTime.toFixed(2)} sec`);
      console.log(`Elapsed Time: ${((currentStartTime - startTime) / 60).toFixed(0)} mins`);
      console.log(`Estimated Time: ${((dealerAvgParseTime * (dealerTotal - index)) / 60).toFixed(0)} mins`);
      console.log(`Progress: ${((++index / dealerTotal) * 100).toFixed(2)} %`);
      await page.goto(`${dealer.link}contact`);
      const html = await page.content();
      scrapDetails(dealer, html);
      await saveDB();
      dealerParseTime += getTimestamp() - currentStartTime;
      dealerAvgParseTime = dealerParseTime / index;
    }
    await browser.close();
}

module.exports = { populateDB }