const TelegramBot = require('node-telegram-bot-api');
const CoinGecko = require('coingecko-api');
const _ = require('lodash');
const dotenv = require('dotenv');
dotenv.config();
const TOKEN = process.env.TELEGRAM_TOKEN || 'some-token-here';

// Heroku routes from port :443 to $PORT
// Add URL of your app to env variable or enable Dyno Metadata
// to get this automatically
// See: https://devcenter.heroku.com/articles/dyno-metadata
// const url = process.env.APP_URL || 'https://<app-name>.herokuapp.com:443';
const bot = new TelegramBot(TOKEN, {polling: true});


// This informs the Telegram servers of the new webhook.
// Note: we do not need to pass in the cert, as it already provided
// bot.setWebHook(`${url}/bot${TOKEN}`);

const TOKENS = {
    'xamp': {
      address: "0xf911a7ec46a2c6fa49193212fe4a2a9b95851c27",
      slug: 'antiample',
    },
    tob: {
      slug: 'tokens-of-babel',
    }
  }

bot.onText(/\/burn/, (msg) => {
  const text = _.split(msg.text, ' ');
  const tickers = _.filter(text, t => t !== '/burn');
  

  tickers.map(ticker => {
    // target price, time of last burn, time left on cycle and so forth
    bot.sendMessage(msg.chat.id, ticker);
  });

  console.log('BURN: ');
  console.log('msg: ', text);
});


bot.onText(/\/ratio/, async (msg) => {
  const CG_PARAMS = {
    market_data: true,
    tickers: false,
    community_data: false,
    developer_data: false,
    localization: false,
    sparkline: false,
  };

  const CoinGeckoClient = new CoinGecko();
  const { data: xampPrice } = await CoinGeckoClient.coins.fetch(TOKENS.xamp.slug, CG_PARAMS);
  const { data: tobPrice } = await CoinGeckoClient.coins.fetch(TOKENS.tob.slug, CG_PARAMS);

  const xampUsd = tobPrice.market_data.current_price.eth;
  const tobUsd = xampPrice.market_data.current_price.eth;
  bot.sendMessage(msg.chat.id, `XAMP/TOB: ${Math.ceil((xampUsd/tobUsd) * 100)/100}`);
});



// Just to ping!
bot.on('message', function onMessage(msg) {
  bot.sendMessage(msg, 'I am alive!');
});