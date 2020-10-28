const puppeteer = require('puppeteer');
const $ = require('cheerio');
const { performance } = require('perf_hooks');
const config = require('./config.js');
const dealers = require('./dealers.js');

const scrapDetails = (dealer, html) => {
    const stores = $('.outlet-container', html);
      
    dealer.storeCount = stores.length;
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

const scrapDealerDetails = async (db) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let index = 0;
    const startTime = performance.now();
    const dealerCount = db.dealers.length;
    for(const dealer of db.dealers){
      const timeRunning = (performance.now() - startTime) / 1000;
      const currentPercentage = (index++ / dealerCount) * 100;
      console.clear();
      console.log('------ Dealer Details ------');
      console.log('Running ' + timeRunning.toFixed(2) + ' sec');
      console.log('Dealer ' + index + ' of ' + dealerCount);
      console.log('Progress: ' + currentPercentage.toFixed(2) + '%');
      await page.goto(`${dealer.link}contact`,{ waitUntil: 'networkidle0'});
      const html = await page.content();
      scrapDetails(dealer, html);
      console.log(dealer);
    }
    await browser.close();
}

module.exports = { scrapDealerDetails }