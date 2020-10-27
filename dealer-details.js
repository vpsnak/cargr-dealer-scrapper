const puppeteer = require('puppeteer');
const $ = require('cheerio');
const config = require('./config.js');

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
            // case 'Τηλέφωνο':
            // case 'Τηλέφωνο':
            case 'Τηλέφωνο':
            case 'Ωράριο λειτουργίας':
            case 'Βαθμολογία':
            // @TODO check why follow us case is not working
            case 'Follow us':
                break;
            default:
                console.log('Key', key);
        }
      })
      dealer.stores.push(store);
}

module.exports = { scrapDetails }