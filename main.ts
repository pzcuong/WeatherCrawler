import puppeteer from 'puppeteer';

async function crawlWeatherData() {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  const cities = [
    { name: 'Seoul', url: 'https://weather.com/weather/today/l/Seoul+South+Korea+KSXX0037:1:KS' },
    { name: 'Hanoi', url: 'https://weather.com/weather/today/l/7327192544e869cf94b941035ea3e95d7524fe55bab45d3d0d7e570faadd37d3' },
    { name: 'Ho Chi Minh City', url: 'https://weather.com/weather/today/l/VMXX0007:1:VM' },
  ];

  for (const city of cities) {
    await page.goto(city.url);

    const temperatureElement = await page.$('.CurrentConditions--tempValue--MHmYY');
    let temperature = await page.evaluate(element => element.textContent, temperatureElement);
    // Temperature log ex: 91°

    const timeElement = await page.$('.CurrentConditions--timestamp--1ybTk');
    let time = await page.evaluate(element => element.textContent, timeElement);
    // Time log ex: As of 3:46 pm GMT+07:00 => use regex to get time => 3:46 pm
    const timeRegex = /(\d{1,2}:\d{2}\s*[ap]m)/i;
    const matches = time.match(timeRegex);
    time = matches ? matches[1] : null;

    console.log(`city: ${city.name}, temperature: ${temperature}, time: ${time}`);
  }

  await browser.close();
}

crawlWeatherData();
