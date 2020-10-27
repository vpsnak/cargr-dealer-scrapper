const puppeteer = require('puppeteer');
const $ = require('cheerio');
const config = require('./config.js');

const scrapDealers = (db, html) => {
  $('.cat-lis tr', html).each(function() {
      const row = $(this);
      let dealer = {};
      dealer.name = row.find('[itemprop="legalName"]').text().trim();
      dealer.link = row.find('[itemprop="legalName"]').attr('href');
      dealer.location = row.find('[itemprop="location"] span').text().trim();
      dealer.telephone = row.find('[itemprop="telephone"] a').text().trim();
      db.dealers.push(dealer);
  });
}

const scrapRegions = (db, vType, html) => {
  $('button[type="submit"]', html).each(function() {
      const button = $(this);
      let region = {};
      region.vtype = vType;
      region.link = config.baseUrl + button.attr('formaction')
      db.regions.push(region);
  });
}

const populateDB = async (db) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  for (const vType of config.dealers.vehicleTypesToExport) {
    config.dealers.regions.vtype = vType;
    await page.goto(config.dealers.regions.requestUrl())
    const html = await page.content();
    scrapRegions(db, vType, html);
    // @TODO remove
    break;
  }
  for (const region of db.regions) {
    config.dealers.list.vtype = region.vtype;
    await page.goto(config.dealers.list.requestUrl(region.link))
    const html = await page.content();
    scrapDealers(db, html);
    // @TODO remove
    break;
  }
  await browser.close();
}

module.exports = { populateDB }