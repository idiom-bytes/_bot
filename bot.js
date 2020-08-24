const TelegramBot = require('node-telegram-bot-api');
const CoinGecko = require('coingecko-api');
const _ = require('lodash');
const dotenv = require('dotenv');
const Web3 = require('web3');
const moment = require('moment')
dotenv.config();

const TOKEN = process.env.TELEGRAM_TOKEN || 'your-api-key-here';

const bot = new TelegramBot(TOKEN, {polling: true});

const TOKENS = {
    'xamp': {
      address: "0xf911a7ec46a2c6fa49193212fe4a2a9b95851c27",
      slug: 'antiample',
      abi: [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"epoch","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalSupply","type":"uint256"}],"name":"LogRebase","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"_owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner_","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"who","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"epoch","type":"uint256"},{"internalType":"uint256","name":"supplyDelta","type":"uint256"}],"name":"rebase","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}],
      rebaseAddress: '0x8cEB211A7567Cf399e1eE01E6974bf4a13b64C04',
      rebaseAbi: [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"oldPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newPrice","type":"uint256"}],"name":"RebaseFail","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"oldPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"delta","type":"uint256"}],"name":"RebaseSuccess","type":"event"},{"inputs":[],"name":"_owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_rebase","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_a","type":"address"}],"name":"canOperateRebase","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_t","type":"uint256"}],"name":"changePeriod","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_pool","type":"address"}],"name":"changePool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"}],"name":"changeToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"currentExchangeRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"guarded","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastExchangeRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastRebase","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nextSupplyDelta","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pool","outputs":[{"internalType":"contract IUniswapV2Pair","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rebase","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"refresh","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"exchangeRate","type":"uint256"}],"name":"shouldRebase","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"timeBetweenRebases","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"contract IRebaseableERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenDecimals","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferTokenOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unguard","outputs":[],"stateMutability":"nonpayable","type":"function"}],
    },
    tob: {
      address: '0x7777770f8a6632ff043c8833310e245eba9209e6',
      abi: [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"epoch","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalSupply","type":"uint256"}],"name":"LogRebase","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"_owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner_","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"who","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"epoch","type":"uint256"},{"internalType":"uint256","name":"supplyDelta","type":"uint256"}],"name":"rebase","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}],
      rebaseAddress: '0x8ceb211a7567cf399e1ee01e6974bf4a13b64c04',
      rebaseAbi: [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"oldPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newPrice","type":"uint256"}],"name":"RebaseFail","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"oldPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"delta","type":"uint256"}],"name":"RebaseSuccess","type":"event"},{"inputs":[],"name":"_owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_rebase","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_a","type":"address"}],"name":"canOperateRebase","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_t","type":"uint256"}],"name":"changePeriod","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_pool","type":"address"}],"name":"changePool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"}],"name":"changeToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"currentExchangeRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"guarded","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastExchangeRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastRebase","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nextSupplyDelta","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pool","outputs":[{"internalType":"contract IUniswapV2Pair","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rebase","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"refresh","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"exchangeRate","type":"uint256"}],"name":"shouldRebase","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"timeBetweenRebases","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"contract IRebaseableERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenDecimals","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferTokenOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unguard","outputs":[],"stateMutability":"nonpayable","type":"function"}],
      slug: 'tokens-of-babel',
    }
  }
  const CG_PARAMS = {
    market_data: true,
    tickers: false,
    community_data: false,
    developer_data: false,
    localization: false,
    sparkline: false,
  };

// https://www.shawntabrizi.com/ethereum/making-web3-js-work-asynchronously-javascript-promises-await/ maybe use async
bot.onText(/\/burn/, async (msg) => {
  const CoinGeckoClient = new CoinGecko();
  const network = "https://mainnet.infura.io/v3/" + process.env.INFURA_KEY;
  console.log(network);
  const web3 = new Web3(new Web3.providers.HttpProvider(network));
  const xampContract = new web3.eth.Contract(TOKENS.xamp.rebaseAbi, TOKENS.xamp.rebaseAddress);
  xampContract.methods.lastRebase().call()
    .then(async (res) => {
      console.log('res: ', res);
      const lastXampRebaseDate = moment(new Date(res * 1000));
      console.log('lastXampRebaseDate:', lastXampRebaseDate);
      const { data: xampPrice } = await CoinGeckoClient.coins.fetch(TOKENS.xamp.slug, CG_PARAMS);
      const xampUsd = xampPrice.market_data.current_price.usd;
      const now = new Date();
      // TODO use momentjs to do this properly. also figure out if this is correct + next rebase time
      const canRebase = new Date(new Date(res * 1000).getTime() + 60 * 60 * 12 * 1000) > now.getTime();
      const tillNextRebase = new Date(new Date(res * 1000).getTime() + 60 * 60 * 12 * 1000);
      // TODO BURN TARGET: And it's in the contract data as 'lastExchangeRate'
      // if currentExchangeRate < lastExchangeRate on XAMP, burn
      // Vice versa for TOB
      const nextRebaseString = canRebase ? 'Eligble for rebase!' : `Rebase will be enabled ${moment(tillNextRebase).toNow()}`;
      xampContract.methods.lastExchangeRate().call()
      .then(res => {
        const lastRebaseRate = (res/10000000000).toFixed(6);
        // TODO make sure this info is correct. add burn target price
        const xampText = `Current price of XAMP is: *$${xampUsd}*. Last rebase rate was *${lastRebaseRate}*. Last burn happened ${lastXampRebaseDate.fromNow()}. ${nextRebaseString}`;
        bot.sendMessage(msg.chat.id, xampText);
      })

    })
    .catch(err => {
      console.log(err);
    })

    bot.sendMessage(msg.chat.id, '                           ');

    const tobContract = new web3.eth.Contract(TOKENS.tob.rebaseAbi, TOKENS.tob.rebaseAddress);
    tobContract.methods.lastRebase().call()
    .then(async (res) => {
      console.log('res: ', res);
      const lastTobRebaseDate = moment(new Date(res * 1000));
      console.log('lastTobRebaseDate:', lastTobRebaseDate);
      const { data: tobPrice } = await CoinGeckoClient.coins.fetch(TOKENS.tob.slug, CG_PARAMS);
      const tobUsd = tobPrice.market_data.current_price.usd;
      const now = new Date();
      // TODO use momentjs to do this properly. also figure out if this is correct + next rebase time
      const canRebase = new Date(new Date(res * 1000).getTime() + 60 * 60 * 24 * 1000) > now.getTime();
      const tillNextRebase = new Date(new Date(res * 1000).getTime() + 60 * 60 * 24 * 1000);
      // TODO BURN TARGET: And it's in the contract data as 'lastExchangeRate'
      // if currentExchangeRate < lastExchangeRate on XAMP, burn
      // Vice versa for TOB
      const nextRebaseString = canRebase ? 'Eligble for rebase!' : `Rebase will be enabled ${moment(tillNextRebase).toNow()}`;
      xampContract.methods.lastExchangeRate().call()
      .then(res => {
        const lastRebaseRate = (res/10000000000).toFixed(6);
        // TODO BURN TARGET: And it's in the contract data as 'lastExchangeRate'
        // TODO make sure this info is correct. add burn target price
        const tobText = `Current price of TOB is: *$${tobUsd}*. Last rebase rate was *${lastRebaseRate}*. Last burn happened ${lastTobRebaseDate.fromNow()}. ${nextRebaseString}`;
        bot.sendMessage(msg.chat.id, tobText);
      })

    })
    .catch(err => {
      console.log(err);
    })
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
  // TODO fetch directly from uniswap so it has real time ratio pricing. coingecko seems delayed
  const CoinGeckoClient = new CoinGecko();
  const { data: xampPrice } = await CoinGeckoClient.coins.fetch(TOKENS.xamp.slug, CG_PARAMS);
  const { data: tobPrice } = await CoinGeckoClient.coins.fetch(TOKENS.tob.slug, CG_PARAMS);

  const xampUsd = tobPrice.market_data.current_price.usd;
  const tobUsd = xampPrice.market_data.current_price.usd;
  bot.sendMessage(msg.chat.id, `XAMP/TOB USD: ${Math.ceil((xampUsd/tobUsd) * 100)/100}`);
  const xampETH = tobPrice.market_data.current_price.eth;
  const tobETH = xampPrice.market_data.current_price.eth;
  bot.sendMessage(msg.chat.id, `XAMP/TOB ETH: ${Math.ceil((xampETH / tobETH) * 100) / 100}`);
});

bot.onText(/\/donate/, async (msg) => {
  bot.sendMessage(msg.chat.id, `donate some XAMP, ETH or TOB if you like the bot, thanks: 0x3E597Ec4a398e0a75b288CeE9Fb65f9405bd7141`);
});

bot.onText(/\/contracts/, async (msg) => {
  bot.sendMessage(msg.chat.id, `TOB CONTRACT: ${TOKENS.tob.address}`);
  bot.sendMessage(msg.chat.id, `XAMP CONTRACT: ${TOKENS.xamp.address}`);
});

bot.onText(/\/rebase/, async (msg) => {
  bot.sendMessage(msg.chat.id, `TOB REBASE CONTRACT: ${TOKENS.tob.rebaseAddress}`);
  bot.sendMessage(msg.chat.id, `XAMP REBASE CONTRACT: ${TOKENS.xamp.rebaseAddress}`);
});

bot.onText(/\/sites/, async (msg) => {
  bot.sendMessage(msg.chat.id, `TOB REBASE CONTRACT: ${TOKENS.tob.rebaseAddress}`);
  bot.sendMessage(msg.chat.id, `XAMP REBASE CONTRACT: ${TOKENS.xamp.rebaseAddress}`);
});

bot.onText(/\/help-burn-bot/, async (msg) => {
  bot.sendMessage(msg.chat.id, `Commands available: /ratio /burn /sites /contracts /rebase /donate`);
});

bot.onText(/\/whale/, async (msg) => {
  // TODO whale af
});



// Just to ping!
bot.on('message', function onMessage(msg) {
  bot.sendMessage(msg, 'I am alive!');
});