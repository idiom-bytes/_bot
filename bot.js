require('graphql-import-node/register');
const TelegramBot = require('node-telegram-bot-api');
const CoinGecko = require('coingecko-api');
const _ = require('lodash');
const dotenv = require('dotenv');
const Web3 = require('web3');
const moment = require('moment');
const axios = require('axios');
const numeral = require('numeral');
const { graphql, print, buildSchema } = require('graphql');
const schema = require('./vendor/uniswap-v2/schema.graphql');
dotenv.config();

// TODO https://t.me/testxampburnbot
// TODO i should burn this key and remember prov vs dev keys lol oops
const TOKEN = process.env.TELEGRAM_TOKEN || '1285492257:AAFSa3SOQCUujBzUOqG3WQmAx9ks0j0LmiY';

const bot = new TelegramBot(TOKEN, { polling: true });

const TOKENS = {
  boa: {
    address: '0xf9c36c7ad7fa0f0862589c919830268d1a2581a1',
  },
  'xamp': {
    address: "0xf911a7ec46a2c6fa49193212fe4a2a9b95851c27",
    slug: 'antiample',
    abi: [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "epoch", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "totalSupply", "type": "uint256" }], "name": "LogRebase", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [], "name": "_owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner_", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "who", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "epoch", "type": "uint256" }, { "internalType": "uint256", "name": "supplyDelta", "type": "uint256" }], "name": "rebase", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }],
    rebaseAddress: '0x8cEB211A7567Cf399e1eE01E6974bf4a13b64C04',
    rebaseAbi: [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "oldPrice", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "newPrice", "type": "uint256" }], "name": "RebaseFail", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "oldPrice", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "newPrice", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "delta", "type": "uint256" }], "name": "RebaseSuccess", "type": "event" }, { "inputs": [], "name": "_owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "_rebase", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_a", "type": "address" }], "name": "canOperateRebase", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_t", "type": "uint256" }], "name": "changePeriod", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_pool", "type": "address" }], "name": "changePool", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_token", "type": "address" }], "name": "changeToken", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "currentExchangeRate", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "guarded", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "lastExchangeRate", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "lastRebase", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "nextSupplyDelta", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "pool", "outputs": [{ "internalType": "contract IUniswapV2Pair", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "rebase", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "refresh", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "exchangeRate", "type": "uint256" }], "name": "shouldRebase", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "timeBetweenRebases", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "token", "outputs": [{ "internalType": "contract IRebaseableERC20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "tokenDecimals", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferTokenOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "unguard", "outputs": [], "stateMutability": "nonpayable", "type": "function" }],
  },
  tob: {
    address: '0x7777770f8a6632ff043c8833310e245eba9209e6',
    abi: [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "epoch", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "totalSupply", "type": "uint256" }], "name": "LogRebase", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [], "name": "_owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner_", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "who", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "epoch", "type": "uint256" }, { "internalType": "uint256", "name": "supplyDelta", "type": "uint256" }], "name": "rebase", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }],
    // V0.1
    // rebaseAddress: '0x8ceb211a7567cf399e1ee01e6974bf4a13b64c04',
    // V0.2
    // rebaseAddress: '0x8bfd055a49a162b595530a9aaa30e9b736f5b619',
    // V0.3 ?
    rebaseAddress: '0x68d95dfcd2916cf76a72d1dee5b7bcecf14adb44',
    rebaseAbi: [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "oldPrice", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "newPrice", "type": "uint256" }], "name": "RebaseFail", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "oldPrice", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "newPrice", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "delta", "type": "uint256" }], "name": "RebaseSuccess", "type": "event" }, { "inputs": [], "name": "_owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "_rebase", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_a", "type": "address" }], "name": "canOperateRebase", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_t", "type": "uint256" }], "name": "changePeriod", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_pool", "type": "address" }], "name": "changePool", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_token", "type": "address" }], "name": "changeToken", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "currentExchangeRate", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "guarded", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "lastExchangeRate", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "lastRebase", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "nextSupplyDelta", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "pool", "outputs": [{ "internalType": "contract IUniswapV2Pair", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "rebase", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "refresh", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "exchangeRate", "type": "uint256" }], "name": "shouldRebase", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "timeBetweenRebases", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "token", "outputs": [{ "internalType": "contract IRebaseableERC20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "tokenDecimals", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferTokenOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "unguard", "outputs": [], "stateMutability": "nonpayable", "type": "function" }],
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

// TODO(jc): wire up uniswap for real time pricing info
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

      // TODO - XAMP Rebase timer is still off -- Reported by @knorry
      // TODO use momentjs to do this properly. also figure out if this is correct + next rebase time
      const canRebase = new Date(new Date(res * 1000).getTime() + 60 * 60 * 12 * 1000) > now.getTime();
      const tillNextRebase = new Date(new Date(res * 1000).getTime() + 60 * 60 * 12 * 1000);

      // TODO(jc): are these TODOs still relevant?
      // TODO BURN TARGET: And it's in the contract data as 'lastExchangeRate'
      // if currentExchangeRate < lastExchangeRate on XAMP, burn
      // Vice versa for TOB
      const nextRebaseString = canRebase ? 'Eligble for rebase!' : `Rebase will be enabled ${moment(tillNextRebase).toNow()}`;
      xampContract.methods.lastExchangeRate().call()
        .then(res => {
          const lastRebaseRate = (res / 10000000000).toFixed(6);
          // TODO(jc): are these TODOs still relevant?
          // TODO make sure this info is correct
          const xampText = `
          Current price of XAMP is: $${xampUsd}.\nLast rebase rate was $${lastRebaseRate}.\nLast burn happened ${lastXampRebaseDate.fromNow()}.\n${nextRebaseString}`;
          bot.sendMessage(msg.chat.id, xampText);
        })

    })
    .catch(err => {
      console.log(err);
    })

  bot.sendMessage(msg.chat.id, '                           ');

  const tobContract = new web3.eth.Contract(TOKENS.tob.rebaseAbi, TOKENS.tob.rebaseAddress);

  // TOB TOB TOB
  // Today's Date
  const now = new Date();

  // STEP #1
  // TOB PRICE LOGIC
  // Price in USD
  var tob_currentRebaseRate = -1.0;
   await tobContract.methods.currentExchangeRate().call()
    .then(res => {
      tob_currentRebaseRate = (res / 10000000000).toFixed(6);
      console.log('TOB-currentRebaseRate: ', tob_currentRebaseRate);
    })

  var tob_lastRebaseRate = -1.0;
  await tobContract.methods.lastExchangeRate().call()
    .then(res => {
      tob_lastRebaseRate = (res / 10000000000).toFixed(6);
      console.log('TOB-lastRebaseRate: ', tob_lastRebaseRate);
    })

  // STEP #2
  // TOB DATE LGOIC
  // Last Rebase Date - Moment Date
  var tob_lastRebaseDate = 0
  await tobContract.methods.lastRebase().call()
    .then(async (res) => {
      tob_lastRebaseDate = moment(new Date(res * 1000));
      console.log('TOB-lastRebaseDate: ', tob_lastRebaseDate);
    })

  // Time Between Rebases - In Seconds
  var tob_timeBetweenRebases = 0;
  var tob_nextRebaseDate = null;
  await tobContract.methods.timeBetweenRebases().call()
    .then(async (res) => {
      tob_timeBetweenRebases = res;
      tob_nextRebaseDate = tob_lastRebaseDate.clone();

      console.log('TOB-timeBetweenRebase: ', tob_timeBetweenRebases);
      console.log('TOB-nextRebaseDate: ', tob_nextRebaseDate);

      tob_nextRebaseDate.add(tob_timeBetweenRebases, 'seconds');
    })

  // STEP #3
  // TOB CAN REBASE LOGIC
  const tob_canRebaseDate = now.getTime() > tob_nextRebaseDate;
  const tob_canRebasePrice = tob_currentRebaseRate > tob_lastRebaseRate;
  console.log('TOB-canRebaseDate: ', tob_canRebaseDate);
  console.log('TOB-canRebasePrice: ', tob_canRebasePrice);

  const tob_canRebase = tob_canRebaseDate || tob_canRebasePrice;
  console.log('TOB-canRebase: ', tob_canRebase);

  // STEP #4
  // TG Bot Text
  const tobText = `
        Current price of TOB is: $${tob_currentRebaseRate}.\nTarget burn price is $${tob_lastRebaseRate}.\nLast burn happened ${tob_lastRebaseDate.fromNow()}.\nNext burn time ${tob_nextRebaseDate.toNow()}.\nCan TOB rebase? ${tob_canRebase}.`;
  bot.sendMessage(msg.chat.id, tobText);
});

bot.onText(/\/ratio/, async (msg) => {
  console.log('testing auto deploy works...');
  console.log('RATIO CALLED: ', msg);
  // TODO(jc): wire up uniswap pricing info to get real time ratio
  // TODO(jc): add BOA/TOB ratio
  // TODO fetch directly from uniswap so it has real time ratio pricing. coingecko seems delayed!!!!!
  const CoinGeckoClient = new CoinGecko();
  const { data: xampPrice } = await CoinGeckoClient.coins.fetch(TOKENS.xamp.slug, CG_PARAMS);
  const { data: tobPrice } = await CoinGeckoClient.coins.fetch(TOKENS.tob.slug, CG_PARAMS);

  bot.sendMessage(msg.chat.id, `Ratio is based from Coingecko market data.. so it might be a little delayed.`);
  const xampUsd = xampPrice.market_data.current_price.usd;
  const tobUsd = tobPrice.market_data.current_price.usd;
  bot.sendMessage(msg.chat.id, `XAMP/TOB USD: ${Math.ceil((tobUsd / xampUsd) * 100) / 100}`);
  const xampETH = xampPrice.market_data.current_price.eth;
  const tobETH = tobPrice.market_data.current_price.eth;
  bot.sendMessage(msg.chat.id, `XAMP/TOB ETH: ${Math.ceil((tobETH / xampETH) * 100) / 100}`);
});

bot.onText(/\/donate/, async (msg) => {
  bot.sendMessage(msg.chat.id, `donate some XAMP, ETH, BOA or TOB if you like the bot, thanks: 0x50f8fBE4011E9dDF4597AAE512ccFb00387fdBD2`);
});

bot.onText(/\/contracts/, async (msg) => {
  bot.sendMessage(msg.chat.id, `TOB CONTRACT: ${TOKENS.tob.address}`);
  bot.sendMessage(msg.chat.id, `XAMP CONTRACT: ${TOKENS.xamp.address}`);
  bot.sendMessage(msg.chat.id, `BOA CONTRACT: ${TOKENS.boa.address}`);
});

bot.onText(/\/rebase/, async (msg) => {
  bot.sendMessage(msg.chat.id, `TOB REBASE CONTRACT: ${TOKENS.tob.rebaseAddress}`);
  bot.sendMessage(msg.chat.id, `XAMP REBASE CONTRACT: ${TOKENS.xamp.rebaseAddress}`);
});

bot.onText(/\/sites/, async (msg) => {
  bot.sendMessage(msg.chat.id, 'Official TOB Site: tokensofbabel.com');
  bot.sendMessage(msg.chat.id, 'TOB Site with rebase info + ability to call rebase: tobburn.online');
  bot.sendMessage(msg.chat.id, 'Official XAMP Site: antiample.org');
  bot.sendMessage(msg.chat.id, 'XAMP Site with rebase info + ability to call rebase: xampburn.com');
  bot.sendMessage(msg.chat.id, 'Official BOA Site: boa-token.webflow.io');

});

bot.onText(/\/help-burn-bot/, async (msg) => {
  bot.sendMessage(msg.chat.id, `Commands available: /ratio /burn /sites /contracts /rebase /whale /release-ash /donate /help-burn-bot /chart-links /marketcap. Also, code can be found here if you want to audit/contribute: gitlab.com/ssfaleads/burnbot`);
});

bot.onText(/\/release-ash/, async (msg) => {
  bot.sendMessage(msg.chat.id, `have some fucking patience!`);
});

bot.onText(/\/chart-links/, async (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `XAMP CHART: uniswap.vision/?ticker=UniswapV2:XAMPUSDC&interval=30 \n TOB CHART: uniswap.vision/?ticker=UniswapV2:TOBUSDC&interval=60 \n RATIO CHART (XAMP/TOB): uniswap.vision/?ticker=UniswapV2:TOBXAMP&interval=60 \n BOA CHART: chartex.pro/?symbol=UNISWAP:BOA \n RATIO CHART (TOB/BOA): uniswap.vision/?ticker=UniswapV2:TOBBOA&interval=60 `
  );
});

bot.onText(/\/whale/, async (msg) => {
  // TODO(jc): expose a whalegames endpoint to show top wallet changes in last 24hrs for xamp/tob/boa
  bot.sendMessage(msg.chat.id, `Work in progess... visit https://whalegames.co for latest xamp/tob whale info.`);
});

bot.onText(/\/marketcap/, async (msg) => {
  const CoinGeckoClient = new CoinGecko();
  const { data: xampPrice } = await CoinGeckoClient.coins.fetch(TOKENS.xamp.slug, CG_PARAMS);
  const { data: tobPrice } = await CoinGeckoClient.coins.fetch(TOKENS.tob.slug, CG_PARAMS);
  const xampUsd = xampPrice.market_data.current_price.usd;
  const tobUsd = tobPrice.market_data.current_price.usd;

  // TODO(jc): use uniswap api to get BOA price in real time
  // TODO(jc): calculate supply dynamically using web3
  const xampSupply = 476121713;
  const tobSupply = 1801511;
  bot.sendMessage(msg.chat.id, `
    BILL DRUMMOND TOKENS MARKETCAP \n
CALCULATED WITH CIRCULATING SUPPLY \n
XAMP supply (est): ${xampSupply}, price: $${xampUsd} \n
TOB supply (est): ${tobSupply}, price: $${tobUsd} \n \n
XAMP marketcap - ${Math.ceil((xampSupply * xampUsd) * 100) / 100} \n
TOB marketcap - ${Math.ceil((tobSupply * tobUsd) * 100) / 100} \n \n
BOA price isn't available through coingecko yet (GET IT LISTED!) \n
Supply stats last updated 8/26/2020 @ 10:40 EST. Prices might be delayed \n`);
});


const PAIR_ADDRESS = {
  TOB_XAMP: '0x28bc0c76a5f8f8461be181c0cbddf715bc1d96af',
  TOB_BOA: '0x668cd043e137c81f811bb71e36e94ded77e4a5ca',
};

const fetchPairDataFromUni = async () => {
  const query = `{
      TOB_XAMP: pair(id: "${PAIR_ADDRESS.TOB_XAMP}") {
        id
        token0{
          id
          symbol
          derivedETH
        }
        token1{
          id
          symbol
          derivedETH
        }
      }
      TOB_BOA: pair(id: "${PAIR_ADDRESS.TOB_BOA}") {
        id
        token0{
          id
          symbol
          derivedETH
        }
        token1{
          id
          symbol
          derivedETH
        }
      }
      }
    `;
  const {data} = await axios.post('https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2', {
    query,
  });
  return data.data;
}

bot.onText(/\/testing/, async (msg) => {
  const pairs = await fetchPairDataFromUni();
  console.log('pairs: ', pairs);
  const TOB_XAMP = pairs.TOB_XAMP;
  const tobXampRatio = numeral(Math.ceil(( TOB_XAMP.token0.derivedETH / TOB_XAMP.token1.derivedETH) * 100) / 100).format('0,0.00');

  const TOB_BOA = pairs.TOB_BOA;
  const tobBoaRatio = numeral(Math.ceil((TOB_BOA.token1.derivedETH / TOB_BOA.token0.derivedETH) * 100) / 100).format('0,0.00');
  bot.sendMessage(msg.chat.id, `RATIO for TOB/XAMP: ${tobXampRatio}\nRATIO for BOA/TOB: ${tobBoaRatio}`);
});