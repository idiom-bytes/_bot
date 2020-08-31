const TelegramBot = require('node-telegram-bot-api');
const CoinGecko = require('coingecko-api');
const _ = require('lodash');
const dotenv = require('dotenv');
const Web3 = require('web3');
const moment = require('moment');
const axios = require('axios');
const numeral = require('numeral');
dotenv.config();

const TOKENS = {
  boa: {
    address: '0xf9c36c7ad7fa0f0862589c919830268d1a2581a1',
  },
  eth: {
    slug: 'ethereum',
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

// TODO https://t.me/testxampburnbot
// TODO i should burn this key and remember prov vs dev keys lol oops
const TOKEN = process.env.TELEGRAM_TOKEN || '1285492257:AAFSa3SOQCUujBzUOqG3WQmAx9ks0j0LmiY';

const bot = new TelegramBot(TOKEN, { polling: true });

// TODO(jc): wire up uniswap for real time pricing info
bot.onText(/\/burn/, async (msg) => {
    try {
        const CoinGeckoClient = new CoinGecko();
        const network = "https://mainnet.infura.io/v3/" + process.env.INFURA_KEY;
        const web3 = new Web3(new Web3.providers.HttpProvider(network));
        const xampContract = new web3.eth.Contract(TOKENS.xamp.rebaseAbi, TOKENS.xamp.rebaseAddress);
        xampContract.methods.lastRebase().call()
            .then(async (res) => {
                const lastXampRebaseDate = moment(new Date(res * 1000));
                const {data: xampPrice} = await CoinGeckoClient.coins.fetch(TOKENS.xamp.slug, CG_PARAMS);
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

        bot.sendMessage(msg.chat.id, '            ^_^           ');

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
            }).catch(console.log)

        var tob_lastRebaseRate = -1.0;
        await tobContract.methods.lastExchangeRate().call()
            .then(res => {
                tob_lastRebaseRate = (res / 10000000000).toFixed(6);
            }).catch(console.log)

        // STEP #2
        // TOB DATE LGOIC
        // Last Rebase Date - Moment Date
        var tob_lastRebaseDate = 0
        await tobContract.methods.lastRebase().call()
            .then(async (res) => {
                tob_lastRebaseDate = moment(new Date(res * 1000));
            }).catch(console.log)

        // Time Between Rebases - In Seconds
        var tob_timeBetweenRebases = 0;
        var tob_nextRebaseDate = null;
        await tobContract.methods.timeBetweenRebases().call()
            .then(async (res) => {
                tob_timeBetweenRebases = res;
                tob_nextRebaseDate = tob_lastRebaseDate.clone();

                tob_nextRebaseDate.add(tob_timeBetweenRebases, 'seconds');
            }).catch(console.log)

        // STEP #3
        // TOB CAN REBASE LOGIC
        const tob_canRebaseDate = now.getTime() > tob_nextRebaseDate;
        const tob_canRebasePrice = tob_currentRebaseRate > tob_lastRebaseRate;

        const tob_canRebase = tob_canRebaseDate || tob_canRebasePrice;

        // STEP #4
        // TG Bot Text
        const tobText = `
            Current price of TOB is: $${tob_currentRebaseRate}.\nTarget burn price is $${tob_lastRebaseRate}.\nLast burn happened ${tob_lastRebaseDate.fromNow()}.\nNext burn time ${tob_nextRebaseDate.toNow()}.\nCan TOB rebase? ${tob_canRebase}.`;
        bot.sendMessage(msg.chat.id, tobText);
    } catch (error) {
        console.error("BOT CATCH ERROR: /burn\n",error);
    }
});

const PAIR_ADDRESS = {
  TOB_XAMP: '0x28bc0c76a5f8f8461be181c0cbddf715bc1d96af',
  TOB_BOA: '0x668cd043e137c81f811bb71e36e94ded77e4a5ca',
  ETH_BOA: '0xbd8061776584f4e790cdb282973c03a321d96e69',
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
      ETH_BOA: pair(id: "${PAIR_ADDRESS.ETH_BOA}") {
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

bot.onText(/\/ratio/, async (msg) => {
    try {
        const pairs = await fetchPairDataFromUni();
        const TOB_XAMP = pairs.TOB_XAMP;
        const tobXampRatio = numeral(Math.ceil(( TOB_XAMP.token0.derivedETH / TOB_XAMP.token1.derivedETH) * 100) / 100).format('0,0.00');

        const TOB_BOA = pairs.TOB_BOA;
        const tobBoaRatio = numeral(Math.ceil((TOB_BOA.token1.derivedETH / TOB_BOA.token0.derivedETH) * 100) / 100).format('0,0.00');
        bot.sendMessage(msg.chat.id, `RATIO for TOB/XAMP: ${tobXampRatio}\nRATIO for BOA/TOB: ${tobBoaRatio}\n FWIW Uniswap API is delayed on pricing...`);
    } catch (error) {
        console.error("BOT CATCH ERROR /ratio:\n",error);
    }
});

bot.onText(/\/donate/, async (msg) => {
    try {
        bot.sendMessage(msg.chat.id, `donate some XAMP, ETH, BOA or TOB if you like the bot, thanks: 0x50f8fBE4011E9dDF4597AAE512ccFb00387fdBD2`);
    } catch (error) {
        console.error("BOT CATCH ERROR /donate:\n",error);
    }
});

bot.onText(/\/contracts/, async (msg) => {
    try {
        bot.sendMessage(msg.chat.id, `TOB CONTRACT: ${TOKENS.tob.address}`);
        bot.sendMessage(msg.chat.id, `XAMP CONTRACT: ${TOKENS.xamp.address}`);
        bot.sendMessage(msg.chat.id, `BOA CONTRACT: ${TOKENS.boa.address}`);
    } catch (error) {
        console.error("BOT CATCH ERROR /contracts:\n",error);
    }
});

bot.onText(/\/rebase/, async (msg) => {
    try {
        bot.sendMessage(msg.chat.id, `TOB REBASE CONTRACT: ${TOKENS.tob.rebaseAddress}`);
        bot.sendMessage(msg.chat.id, `XAMP REBASE CONTRACT: ${TOKENS.xamp.rebaseAddress}`);
    } catch (error) {
        console.error("BOT CATCH ERROR /rebase:\n",error);
    }
});

bot.onText(/\/sites/, async (msg) => {
    try {
        bot.sendMessage(msg.chat.id, 'Official TOB Site: tokensofbabel.com');
        bot.sendMessage(msg.chat.id, 'TOB Site with rebase info + ability to call rebase: tobburn.online');
        bot.sendMessage(msg.chat.id, 'Official XAMP Site: antiample.org');
        bot.sendMessage(msg.chat.id, 'XAMP Site with rebase info + ability to call rebase: xampburn.com');
        bot.sendMessage(msg.chat.id, 'Official BOA Site: boa-token.webflow.io');
    } catch (error) {
        console.error("BOT CATCH ERROR /sites:\n",error);
    }
});

bot.onText(/\/help-burn-bot/, async (msg) => {
    try {
        bot.sendMessage(msg.chat.id, `Commands available: /ratio /burn /sites /contracts /rebase /whale /release-ash /donate /help-burn-bot /chart-links /marketcap /article /video. Also, code can be found here if you want to audit/contribute: gitlab.com/ssfaleads/burnbot`);
    } catch (error) {
        console.error("BOT CATCH ERROR /help-burn-bot:\n",error);
    }
});

bot.onText(/\/release-ash/, async (msg) => {
    try {
        bot.sendMessage(msg.chat.id, `have some fucking patience!`);
    } catch (error) {
        console.error("BOT CATCH ERROR /release-ash:\n",error);
    }
});

bot.onText(/\/chart-links/, async (msg) => {
    try {
        bot.sendMessage(
        msg.chat.id,
        `XAMP CHART: uniswap.vision/?ticker=UniswapV2:XAMPUSDC&interval=30 \n TOB CHART: uniswap.vision/?ticker=UniswapV2:TOBUSDC&interval=60 \n RATIO CHART (XAMP/TOB): uniswap.vision/?ticker=UniswapV2:TOBXAMP&interval=60 \n BOA CHART: chartex.pro/?symbol=UNISWAP:BOA \n RATIO CHART (TOB/BOA): uniswap.vision/?ticker=UniswapV2:TOBBOA&interval=60 `
        );
    } catch (error) {
        console.error("BOT CATCH ERROR /chart-links:\n",error);
    }
});

bot.onText(/\/whale/, async (msg) => {
    try {
        // TODO(jc): expose a whalegames endpoint to show top wallet changes in last 24hrs for xamp/tob/boa
        bot.sendMessage(msg.chat.id, `Work in progess... visit https://whalegames.co for latest xamp/tob whale info.`);
    } catch (error) {
        console.error("BOT CATCH ERROR /whale:\n",error);
    }
});

bot.onText(/\/marketcap/, async (msg) => {
    try {
        const CoinGeckoClient = new CoinGecko();
        const { data: xampPrice } = await CoinGeckoClient.coins.fetch(TOKENS.xamp.slug, CG_PARAMS);
        const { data: tobPrice } = await CoinGeckoClient.coins.fetch(TOKENS.tob.slug, CG_PARAMS);
        const { data: ethPrice } = await CoinGeckoClient.coins.fetch(TOKENS.eth.slug, CG_PARAMS);
        const xampUsd = xampPrice.market_data.current_price.usd;
        const tobUsd = tobPrice.market_data.current_price.usd;
        const ethUsd = ethPrice.market_data.current_price.usd;

        const pairs = await fetchPairDataFromUni();
        const ETH_BOA = pairs.ETH_BOA;
        const boaUsd = ETH_BOA.token1.derivedETH * ethUsd;

        // TODO(jc): calculate supply dynamically using web3
        const xampSupply = 476121713;
        const tobSupply = 1801511;
        const boaSupply = 95.09539754703138;
        bot.sendMessage(msg.chat.id, `
        BILL DRUMMOND TOKENS MARKETCAP - CALCULATED WITH CIRCULATING SUPPLY \n
        XAMP supply (est): ${numeral(xampSupply).format('0,0.00')}, price: $${numeral(xampUsd).format('0,0.0000')} \n
        TOB supply (est): ${numeral(tobSupply).format('0,0.00')}, price: $${numeral(tobUsd).format('0,0.00')} \n
        BOA supply (est): ${numeral(boaSupply).format('0,0.00')}, price: $${numeral(boaUsd).format('0,0.00')} \n \n
        XAMP marketcap - $${numeral(Math.ceil((xampSupply * xampUsd) * 100) / 100).format('0,0.00')} \n
        TOB marketcap - $${numeral(Math.ceil((tobSupply * tobUsd) * 100) / 100).format('0,0.00')} \n
        BOA marketcap - $${numeral(Math.ceil((boaSupply * boaUsd) * 100) / 100).format('0,0.00')} \n
        Supply stats last updated 8/29/2020 @ 3:45 EST. Prices might be delayed \n`);
    } catch (error) {
        console.error("BOT CATCH ERROR /marketcap:\n",error);
    }
});

const videos = [
    "https://twitter.com/CautyMu/status/1291852448110239745",
    "https://twitter.com/CautyMu/status/1297433915754287104",
    "https://twitter.com/CautyMu/status/1297351795115622402",
    "https://twitter.com/CautyMu/status/1296677337442816005",
    "https://twitter.com/CautyMu/status/1296259257117995010",
    "https://twitter.com/CautyMu/status/1295678669407416320",
    "https://twitter.com/CautyMu/status/1294967223270875136",
    "https://twitter.com/CautyMu/status/1294565407165038594",
    "https://twitter.com/CautyMu/status/1293701172000251905",
    "https://twitter.com/CautyMu/status/1293681620919042049",
    "https://twitter.com/CautyMu/status/1293380668483747840",
    "https://twitter.com/CautyMu/status/1292974024373358592",
    "https://twitter.com/CautyMu/status/1292785510876770304",
    "https://twitter.com/CautyMu/status/1292657051764547584",
    "https://twitter.com/CautyMu/status/1292403852579233792",
    "https://twitter.com/CautyMu/status/1291885796769710080",
    "https://twitter.com/CautyMu/status/1291885473049088000",
    "https://twitter.com/CautyMu/status/1291575007819120640",
    "https://twitter.com/CautyMu/status/1291545838418685952",
    "https://twitter.com/CautyMu/status/1291530112056217600"
];
bot.onText(/\/video/, async (msg) => {
    try {
        bot.sendMessage(msg.chat.id, videos[Math.floor(Math.random()*videos.length)])
    } catch (error) {
        console.error("BOT CATCH ERROR /video:\n",error);
    }
});

const articles = [
    "https://medium.com/@bizarrozuck/tokens-of-babel-an-introduction-of-adaptive-commodities-94e73d246bcf",
    "https://medium.com/@bizarrozuck/boa-the-self-cannibalizing-token-game-1ce705a3327",
    "https://medium.com/@burn_the_state/e67c6de0bbe0",
    "https://dailyhodl.com/2020/08/24/two-altcoins-built-by-mysterious-coder-are-set-to-erupt-as-bitcoin-ethereum-and-chainlink-recalibrate-predicts-top-trader/",
    "https://thebitcoindesk.com/2020/08/these-unknown-altcoins-could-skyrocket-while-bitcoin-consolidates/",
    "https://cointelegraph.com/news/ethereum-whales-uniswap-token-briefly-hit-100k-but-theres-a-catch"
];
bot.onText(/\/article/, async (msg) => {
    try {
        bot.sendMessage(msg.chat.id, articles[Math.floor(Math.random()*articles.length)])
    } catch (error) {
        console.error("BOT CATCH ERROR /article:\n",error);
    }
});

bot.onText(/\/testing/, async (msg) => {
    try {
        bot.sendMessage(msg.chat.id, 'testing');
    } catch (error) {
        console.error("BOT CATCH ERROR /testing:\n",error);
    }
});