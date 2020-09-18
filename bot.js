const TelegramBot = require('node-telegram-bot-api');
const CoinGecko = require('coingecko-api');
const _ = require('lodash');
const numeral = require('numeral');
const moment = require('moment');

// EMOJIS UNICODE TABLE - Get the Javascript escape
// https://charbase.com/1f525-unicode-fire

const Uniswap = require('./src/components/Uniswap')
const Tob = require('./src/components/Tob')
const Xamp = require('./src/components/Xamp')
const Boa = require('./src/components/Boa')
const YFKA = require('./src/components/Yfka')
const Eth = require('./src/components/Eth')

const dotenv = require('dotenv');
dotenv.config();

const TOKEN = process.env.TELEGRAM_TOKEN || "your_api_key_here";
const bot = new TelegramBot(TOKEN, {polling: true});
const cgClient = new CoinGecko();

const CONFIG_PARAMS = {
    eth: {
        slug: 'ethereum',
        ticker: 'ETH'
    },
    xamp: {
        slug: 'antiample',
        ticker: 'XAMP',
        decimals: 9,
        priceDecimals: 10,
        contractAddress: "0xf911a7ec46a2c6fa49193212fe4a2a9b95851c27",
        contractAbi: [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"epoch","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalSupply","type":"uint256"}],"name":"LogRebase","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"_owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner_","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"who","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"epoch","type":"uint256"},{"internalType":"uint256","name":"supplyDelta","type":"uint256"}],"name":"rebase","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}],
        contractBitly: "https://bit.ly/2ESi6SK",
        rebaseAddress: '0x8cEB211A7567Cf399e1eE01E6974bf4a13b64C04',
        rebaseAbi: [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"oldPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newPrice","type":"uint256"}],"name":"RebaseFail","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"oldPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"delta","type":"uint256"}],"name":"RebaseSuccess","type":"event"},{"inputs":[],"name":"_owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_rebase","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_a","type":"address"}],"name":"canOperateRebase","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_t","type":"uint256"}],"name":"changePeriod","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_pool","type":"address"}],"name":"changePool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"}],"name":"changeToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"currentExchangeRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"guarded","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastExchangeRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastRebase","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nextSupplyDelta","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pool","outputs":[{"internalType":"contract IUniswapV2Pair","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rebase","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"refresh","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"exchangeRate","type":"uint256"}],"name":"shouldRebase","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"timeBetweenRebases","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"contract IRebaseableERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenDecimals","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferTokenOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unguard","outputs":[],"stateMutability":"nonpayable","type":"function"}],
        rebaseBitly: "https://bit.ly/3lJbPcO",
        supplyStart:{
            'total': 1000000000,
            'vested': 80000000
        },
        addresses: {
            'contract': '0xf911a7ec46a2c6fa49193212fe4a2a9b95851c27',
            'burn': '0x0000000000000000000000000000000000000001',
            'vested': "0x37EE8C0695b3dd657a3640d62f2AE0a8bD8Fe3cF"
        }
    },
    tob: {
        slug: 'tokens-of-babel',
        ticker: 'TOB',
        decimals: 18,
        priceDecimals: 10,
        contractAddress: '0x7777770f8a6632ff043c8833310e245eba9209e6',
        contractAbi: [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"epoch","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalSupply","type":"uint256"}],"name":"LogRebase","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"_owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner_","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"who","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"epoch","type":"uint256"},{"internalType":"uint256","name":"supplyDelta","type":"uint256"}],"name":"rebase","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}],
        contractBitly: "https://bit.ly/2YWbZnA",
        rebaseAddress: '0x68D95Dfcd2916cf76a72d1dEe5b7BcEcf14aDb44',
        rebaseAbi: [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"oldPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newPrice","type":"uint256"}],"name":"RebaseFail","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"oldPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"delta","type":"uint256"}],"name":"RebaseSuccess","type":"event"},{"inputs":[],"name":"_owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_rebase","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_a","type":"address"}],"name":"canOperateRebase","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_t","type":"uint256"}],"name":"changePeriod","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_pool","type":"address"}],"name":"changePool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"}],"name":"changeToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"currentExchangeRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"guarded","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastExchangeRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastRebase","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nextSupplyDelta","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pool","outputs":[{"internalType":"contract IUniswapV2Pair","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rebase","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"refresh","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"exchangeRate","type":"uint256"}],"name":"shouldRebase","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"timeBetweenRebases","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"contract IRebaseableERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenDecimals","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferTokenOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unguard","outputs":[],"stateMutability":"nonpayable","type":"function"}],
        rebaseBitly: "https://bit.ly/3bhcGN8",
        supplyStart:{
            'total': 4012101,
            'burn': 2000000,
            'vested1': 541633.64,
            'vested2': 60181.52
        },
        addresses: {
            'contract': "0x7777770f8a6632ff043c8833310e245eba9209e6",
            'burn': "0x0000000000000000000000000000000000000001",
            'vested1': "0xA44CC80840F205Fb2Bf001765c012476766faE13",
            'vested2': "0x3474eA3E41372EfECBdC1B41A3c92df293370aa8"
        },
        websites: {
            official: 'https://tokensofbabel.com/',
            burn: 'https://tobburn.com/'
        }
    },
    boa: {
        slug: 'boa',
        ticker: 'BOA',
        decimals: 18,
        priceDecimals: 10,
        contractAddress: "0xf9c36c7ad7fa0f0862589c919830268d1a2581a1",
        contractAbi: [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"_owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_addr","type":"address"}],"name":"addToWhitelist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"is_profitable","outputs":[{"internalType":"bool","name":"_profitable","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"numberRedeemed","outputs":[{"internalType":"uint256","name":"profit","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"redeem","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_addr","type":"address"}],"name":"removeFromWhitelist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalPooled","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"whitelist","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}],
        contractBitly: "https://bit.ly/2DlC9Zr",
        rebaseAddress: null,
        rebaseAbi: null,

        // TODO: Add vesting distribution to calculations
        supplyStart:{
            'total': 100,
            'taxPool': 50,
            'circulating': 50
        },
        addresses: {
            'contract': '0xf9c36c7ad7fa0f0862589c919830268d1a2581a1',
            'burn': '0x0000000000000000000000000000000000000000',
            'creator': "0xe41e5fa65d197afa059edce5225c1da2a01a361c"
        }
    },
    yfka: {
        slug: 'yfka',
        ticker: 'YFKA',
        decimals: 18,
        priceDecimals: 10,
        contractAddress: "0x4086692d53262b2be0b13909d804f0491ff6ec3e",
        contractAbi: [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"_owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"balance","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"boaContract","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"boaRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"calculateRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_addr","type":"address"},{"internalType":"address","name":"newAddress","type":"address"}],"name":"changeContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_addr","type":"address"},{"internalType":"uint256","name":"newRate","type":"uint256"}],"name":"changeRate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"endPresale","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"presaleRunning","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"purchaseWithBOA","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"purchaseWithTOB","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"purchaseWithXAMP","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_boaContract","type":"address"},{"internalType":"uint256","name":"_boaRate","type":"uint256"},{"internalType":"address","name":"_xampContract","type":"address"},{"internalType":"uint256","name":"_xampRate","type":"uint256"},{"internalType":"address","name":"_tobContract","type":"address"},{"internalType":"uint256","name":"_tobRate","type":"uint256"}],"name":"setUp","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tobContract","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tobRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"tuning","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"turnOffTuning","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"xampContract","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"xampRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}],
        contractBitly: "https://bit.ly/3hdkbWQ",

        supplyStart:{
            'total': 0
        },
        addresses: {
            'contract': '0x4086692d53262b2be0b13909d804f0491ff6ec3e',
            'creator': '0xe41e5fa65d197afa059edce5225c1da2a01a361c'
        }
    },
    charts:
        `Uniswap.Vision & Chartex:
        XAMP/USD CHART: https://bit.ly/3lC1box
        XAMP/ETH CHART: https://bit.ly/34QC0IO
        TOB/USD CHART: https://bit.ly/34Uy0XG
        TOB/ETH CHART: https://bit.ly/2QKzonF
        BOA/USD CHART: https://bit.ly/32QdIf8
        RATIO TOB/XAMP: https://bit.ly/3gQOhiK
        RATIO TOB/BOA: https://bit.ly/3hRR3W6`,
    whalegames:
        `B.T.S. Leaderboard:
        https://whalegames.co
        Study top Xamp/Tob whale activity.`,
    websites:
        `Official Sites
        XAMP Official: https://antiample.org/
        TOB Official: https://tokensofbabel.com/
        BOA Official: https://boacoin.cash/
        YFKA Official: https://burnthestate.com/

Community Sites
        TOB Burn: https://tobburn.com/
        XAMP Burn: https://www.xampburn.com/
        Whale Games: http://whalegames.co/`,
    donate:
        `We welcome donations of XAMP, TOB, BOA, YFKA, or ETH.
        > Our goal is to build, not to spend.
        > All donations used to further development.
        > Community Devs: @jaycee @idiom @geezy

Tip Jar: 0x50f8fBE4011E9dDF4597AAE512ccFb00387fdBD2
Tip Link: https://bit.ly/2QPUjWk`,
    motd:
        `Message of the Week:

YFKA (ASH):
    - "Yield Farming Known as Ash."
    - YFKA is out. Presale is running.
    - https://burnthestate.com

Airdrop:
    - The team has triggered the snapshot.
    - You should receive your TOB soon.

Farming Diagram:
    - https://twitter.com/idiom_bytes/status/1300893617083396097

Farming-to-Market Positioning:
    Deconstruction & Strategy
    TG: @eli
    https://docs.google.com/document/d/1DgrLf9nYXCbL1-b1xIbjl_bh4W2Da1GdIO7lFzzbwWs/edit?usp=sharing\

@jayceee @idiom @geezy for updates.
Tip Jar: 0x50f8fBE4011E9dDF4597AAE512ccFb00387fdBD2
Tip Link: https://bit.ly/2QPUjWk`,
    articles: { // Implemented it this way so we can
        "Papers" : "",
        "YFKA/ASH Paper: ": "https://bit.ly/31IQwjG", //https://medium.com/@burn_the_state/e67c6de0bbe0"
        "TOB Paper: ": "https://bit.ly/2ER9vzO", //https://medium.com/@bizarrozuck/tokens-of-babel-an-introduction-of-adaptive-commodities-94e73d246bcf
        "BOA Paper: ": "https://bit.ly/3gJDBSX", //https://medium.com/@bizarrozuck/boa-the-self-cannibalizing-token-game-1ce705a3327
        "\nArticles" : "",
        "Josh Rager: ": "https://bit.ly/2YSwLnZ", //https://dailyhodl.com/2020/08/30/after-riding-yfi-108000-tidal-wave-bitcoin-analyst-josh-rager-bullish-on-five-crypto-assets/",
        "Mysterious Coder: https: ": "https://bit.ly/31LZAEo", //https://dailyhodl.com/2020/08/24/two-altcoins-built-by-mysterious-coder-are-set-to-erupt-as-bitcoin-ethereum-and-chainlink-recalibrate-predicts-top-trader/",
        "Unknown Alts could Rocket: ": "https://bit.ly/3hLraHN", //https://thebitcoindesk.com/2020/08/these-unknown-altcoins-could-skyrocket-while-bitcoin-consolidates/",
        "Boa hits $100k: ": "https://bit.ly/3gL18TI" //https://cointelegraph.com/news/ethereum-whales-uniswap-token-briefly-hit-100k-but-theres-a-catch`
    },
    videos: [
        "https://twitter.com/CautyMu/status/1301301435930349575",
        "https://twitter.com/CautyMu/status/1300670663825354754",
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
    ],
    github:
        `Audit & contribute to the bot here:

gitlab.com/ssfaleads/burnbot`,
    CG_PARAMS: {
        market_data: true,
        tickers: false,
        community_data: false,
        developer_data: false,
        localization: false,
        sparkline: false,
    },
    UNI_PAIR_ADDRESSES : {
        ETH_XAMP: '0x6c35c40447e8011a63ab05f088fa7cd914d66904',
        ETH_TOB: '0x7844c04b043b51dc45bdf59ee2de53e7686865ff',
        ETH_BOA: '0xbd8061776584f4e790cdb282973c03a321d96e69',
        ETH_YFKA: '0xc0cfb99342860725806f085046d0233fec876cd7',
        TOB_XAMP: '0x28bc0c76a5f8f8461be181c0cbddf715bc1d96af',
        TOB_BOA: '0x668cd043e137c81f811bb71e36e94ded77e4a5ca',
        XAMP_YFKA: '0xaea4d6809375bb973c8036d53db9e90970942738',
        TOB_YFKA: '0x34d0448a79f853d6e1f7ac117368c87bb7beea6b',
        BOA_YFKA: '0x5ecf87ff558f73d097eddfee35abde626c7aeab7',
    },
    UNI_TOKEN_ADDRESSES: {
        XAMP: '0xf911a7ec46a2c6fa49193212fe4a2a9b95851c27',
        TOB: '0x7777770f8a6632ff043c8833310e245eba9209e6',
        BOA: '0xf9c36c7ad7fa0f0862589c919830268d1a2581a1',
        YFKA: '0x4086692d53262b2be0b13909d804f0491ff6ec3e',
    },
    YAFK_PRESALE: {
        XAMP_YFKA: 0.0000231478550724638,
        TOB_YFKA: 0.00582608695652174,
        BOA_YFKA: 99.8550724637681
    }
}



// BOT BACKGROUND FUNCTIONALITY
var uniswap = new Uniswap(CONFIG_PARAMS);
var coin_eth = new Eth(CONFIG_PARAMS.eth, cgClient); //  uniswap.pairData these classes only take in 2 params
var coin_xamp = new Xamp(CONFIG_PARAMS.xamp, cgClient); //  uniswap.pairData these classes only take in 2 params
var coin_tob = new Tob(CONFIG_PARAMS.tob, cgClient); //  uniswap.pairData these classes only take in 2 params
var coin_boa = new Boa(CONFIG_PARAMS.boa, cgClient); //  uniswap.pairData these classes only take in 2 params
var coin_yfka = new YFKA(CONFIG_PARAMS.yfka, cgClient); //  uniswap.pairData these classes only take in 2 params

coin_eth.init();
coin_xamp.init();
coin_tob.init();
coin_boa.init();
coin_yfka.init();

// TODO: Interval-based Update
var lastUpdate = null;
const updateInternals = async () => {
    if( lastUpdate === null || moment().diff(lastUpdate, 'seconds') > 10 ) {
        await uniswap.fetchPairDataFromUni();
        await coin_eth.update();
        await coin_xamp.update();
        await coin_tob.update();
        await coin_boa.update();
        await coin_yfka.update();
        lastUpdate = moment();
    }
}

updateInternals();

const initializeListeners = require('./rebaseListener.js');
initializeListeners(bot);

// TG BOT ENTRYPOINTS
bot.onText(/\/help/, async (msg) => {
    try {
        bot.sendMessage(
          msg.chat.id,
          `Commands available:
    /help - You are here.
    /burn /rebase - Get coin Rebase info.
    /websites - Get important websites.
    /marketcap - Get coin marketcap data.
    /supply - Get detailed supply data.
    /launch - Get detailed supply start data.
    /ratio - Get coin trade ratios.
    /whale - Access B.T.S. leaderboard.
    /charts - Get link to charts.
    /articles - Get all articles.
    /contracts - Get contract addresses.
    /uniConfig - Get Uniswap BTS configuration
    /motd /latest /release - Message of the Week.
    /video - Get a random B.T.S. video.
    /github - Audit/contribute to bot.
    /donate - Support the community
    
    Community Devs: @idiom @geezy @jaycee
    Tip Jar: 0x50f8fBE4011E9dDF4597AAE512ccFb00387fdBD2
    Tip Link: https://bit.ly/2QPUjWk`
        );
        console.log("Telegram chat id is:", msg.chat.id)
    } catch (error) {
        console.error("BOT CATCH ERROR /help:\n",error);
    }
});

bot.onText(/\/supply/, async (msg) => {
    try {
        await updateInternals();
        bot.sendMessage(msg.chat.id, coin_xamp.getSupplyCurrent() + '\n' + coin_tob.getSupplyCurrent() + '\n' + coin_boa.getSupplyCurrent() + '\n' + coin_yfka.getSupplyCurrent());
    } catch (error) {
        console.error("BOT CATCH ERROR /supply:\n",error);
    }
});

bot.onText(/\/launch/, async (msg) => {
    try {
        bot.sendMessage(msg.chat.id, coin_xamp.getSupplyStart() + '\n' + coin_tob.getSupplyStart() + '\n' + coin_boa.getSupplyStart() + '\n' + coin_yfka.getSupplyStart());
    } catch (error) {
        console.error("BOT CATCH ERROR /launch:\n",error);
    }
});

bot.onText(/\/marketcap/, async (msg) => {
    try {
        await updateInternals();

        const totalBTSMarketCap =
            (coin_xamp.supplyCurrent['circulating'] * uniswap.tokenUsd['XAMP']) +
            (coin_tob.supplyCurrent["circulating"] * uniswap.tokenUsd['TOB']) +
            (coin_boa.supplyCurrent["circulating"] * uniswap.tokenUsd['BOA']) +
            (coin_yfka.supplyCurrent["circulating"] * uniswap.tokenUsd['YFKA']);
        const totalMarketCapString = numeral(totalBTSMarketCap).format("0,0.00");

        bot.sendMessage(
            msg.chat.id,
            `Burn The State
MCAP = CIRCULATING SUPPLY * UNISWAP PRICE
----------------------------------
XAMP Supply: ${numeral(coin_xamp.supplyCurrent["circulating"]).format("0,0.00")} | Price: $${numeral(uniswap.tokenUsd['XAMP']).format("0,0.0000")}
XAMP MCap $${numeral(coin_xamp.supplyCurrent["circulating"] * uniswap.tokenUsd['XAMP']).format("0,0.00")}

TOB Supply: ${numeral(coin_tob.supplyCurrent["circulating"]).format("0,0.00")} | Price: $${numeral(uniswap.tokenUsd['TOB']).format("0,0.00")}
TOB MCap: $${numeral(coin_tob.supplyCurrent["circulating"] * uniswap.tokenUsd['TOB']).format("0,0.00")}

BOA Supply: ${numeral(coin_boa.supplyCurrent["circulating"]).format("0,0.00")} | Price: $${numeral(uniswap.tokenUsd['BOA']).format("0,0.00")}
BOA MCap: $${numeral(coin_boa.supplyCurrent["circulating"] * uniswap.tokenUsd['BOA']).format("0,0.00")}

YFKA Supply: ${numeral(coin_yfka.supplyCurrent["circulating"]).format("0,0.00")} | Price: $${numeral(uniswap.tokenUsd['YFKA']).format("0,0.00")}
YFKA MCap: $${numeral(coin_yfka.supplyCurrent["circulating"] * uniswap.tokenUsd['YFKA']).format("0,0.00")}

Total BTS MCap: $${totalMarketCapString}
Warning: Prices data might be delayed`
        );
    } catch (error) {
        console.error("BOT CATCH ERROR /marketcap:\n",error);
    }
});

bot.onText(/\/burn/, async (msg) => {
    try {
        await updateInternals();
        bot.sendMessage(msg.chat.id, coin_xamp.getRebase() + '\n' + coin_tob.getRebase() + '\n' + coin_boa.getRebase());
    } catch (error) {
        console.error("BOT CATCH ERROR /burn:\n",error);
    }
});

bot.onText(/\/rebase/, async (msg) => {
    try {
        await updateInternals();
        bot.sendMessage(msg.chat.id, coin_xamp.getRebase() + '\n' + coin_tob.getRebase() + '\n' + coin_boa.getRebase());
    } catch (error) {
        console.error("BOT CATCH ERROR /rebase:\n",error);
    }
});

function getArbOppMsg(ticker, roi) {
    const canArbitrage = roi < 0.00 ? "\u2705" : "\u274c";
    if (roi < 0.00) {
        return `${canArbitrage} Can Arbitrage. Buy on Presale.\nSell on Uniswap. Profit. [+${roi.toFixed(2)}%]`
    } else {
        return `${canArbitrage} No arbitrage.\nUniswap is cheaper than presale. [-${roi.toFixed(2)}%]`
    }
}

// TODO - Implement CoinGecko ratio calculation w/ latest code base
bot.onText(/\/ratio/, async (msg) => {
    try {
        await updateInternals();
        const keys = Object.keys(uniswap.ratioData);

        xamp_yfka_roi = ((uniswap.ratioData['XAMP_YFKA'] - CONFIG_PARAMS.YAFK_PRESALE.XAMP_YFKA) / CONFIG_PARAMS.YAFK_PRESALE.XAMP_YFKA) * 100.0;
        tob_yfka_roi = ((uniswap.ratioData['TOB_YFKA'] - CONFIG_PARAMS.YAFK_PRESALE.TOB_YFKA) / CONFIG_PARAMS.YAFK_PRESALE.TOB_YFKA) * 100.0;
        boa_yfka_roi = ((uniswap.ratioData['BOA_YFKA'] - CONFIG_PARAMS.YAFK_PRESALE.BOA_YFKA) / CONFIG_PARAMS.YAFK_PRESALE.BOA_YFKA) * 100.0;

        xampArb = getArbOppMsg(CONFIG_PARAMS.xamp.ticker, xamp_yfka_roi);
        tobArb = getArbOppMsg(CONFIG_PARAMS.tob.ticker, tob_yfka_roi);
        boaArb = getArbOppMsg(CONFIG_PARAMS.boa.ticker, boa_yfka_roi);

        bot.sendMessage(msg.chat.id,
        `Uniswap B.T.S. Ratios
      
--- ETH (to) BTS ---
ETH_XAMP Ratio: ${numeral(uniswap.ratioData['ETH_XAMP']).format('0,0.0000')}
ETH_TOB Ratio: ${numeral(uniswap.ratioData['ETH_TOB']).format('0,0.0000')}
ETH_BOA Ratio: ${numeral(uniswap.ratioData['ETH_BOA']).format('0,0.000000000')}
ETH_YFKA Ratio: ${numeral(uniswap.ratioData['ETH_YFKA']).format('0,0.0000')}

--- TOB (to) ---
TOB_XAMP Ratio: ${numeral(uniswap.ratioData['TOB_XAMP']).format('0,0.0000')}

--- BOA (to) ---
BOA_TOB Ratio: ${numeral(uniswap.ratioData['TOB_BOA']).format('0,0.0000')}

--- BTS (to) YFKA ---
XAMP_YFKA Ratio: ${numeral(uniswap.ratioData['XAMP_YFKA']).format('0,0.000000000')} 
Presale: ${CONFIG_PARAMS.YAFK_PRESALE.XAMP_YFKA.toFixed(9)} 
${xampArb}

TOB_YFKA Ratio: ${numeral(uniswap.ratioData['TOB_YFKA']).format('0,0.000000')}
Presale: ${CONFIG_PARAMS.YAFK_PRESALE.TOB_YFKA.toFixed(9)} 
${tobArb}

BOA_YFKA Ratio: ${numeral(uniswap.ratioData['BOA_YFKA']).format('0,0.000000')}
Presale: ${CONFIG_PARAMS.YAFK_PRESALE.BOA_YFKA.toFixed(6)}
${boaArb}

--- PRICE USD ---
ETH UNI: $${numeral(uniswap.ethUsd).format('0,0.00')} CG: $${numeral(coin_eth.getPrice("usd")).format('0,0.00')}
XAMP UNI: $${numeral(uniswap.tokenUsd['XAMP']).format('0.000000')} CG: $${numeral(coin_xamp.getPrice("usd")).format('0,0.000000')}
TOB UNI: $${numeral(uniswap.tokenUsd['TOB']).format('0,0.00')} CG: $${numeral(coin_tob.getPrice("usd")).format('0,0.00')}
BOA UNI: $${numeral(uniswap.tokenUsd['BOA']).format('0,0.00')} CG: $${numeral(coin_boa.getPrice("usd")).format('0,0.00')}
YFKA UNI: $${numeral(uniswap.tokenUsd['YFKA']).format('0,0.00')}

Warning: Prices data might be delayed`
        );
    } catch (error) {
        console.error("BOT CATCH ERROR /ratio:\n",error);
    }
});

bot.onText(/\/chart/, async (msg) => {
    try {
        bot.sendMessage(msg.chat.id, CONFIG_PARAMS.charts);
    } catch (error) {
        console.error("BOT CATCH ERROR /chart:\n",error);
    }
});

bot.onText(/\/whale/, async (msg) => {
    try {
        // TODO(jc): expose a whalegames endpoint to show top wallet changes in last 24hrs for xamp/tob/boa
        bot.sendMessage(msg.chat.id, CONFIG_PARAMS.whalegames);
    } catch (error) {
        console.error("BOT CATCH ERROR /whale:\n",error);
    }
});

bot.onText(/\/websites/, async (msg) => {
    try {
        bot.sendMessage(msg.chat.id, CONFIG_PARAMS.websites);
    } catch (error) {
        console.error("BOT CATCH ERROR /websites:\n",error);
    }
});

bot.onText(/\/contracts/, async (msg) => {
    try {
        bot.sendMessage(msg.chat.id,
            `TOB Contract: ${CONFIG_PARAMS.tob.contractBitly}
TOB Rebase Contract: ${CONFIG_PARAMS.tob.rebaseBitly}
XAMP Contract: ${CONFIG_PARAMS.xamp.contractBitly}
XAMP Rebase Contract: ${CONFIG_PARAMS.xamp.rebaseBitly}
BOA Contract: ${CONFIG_PARAMS.boa.contractBitly}
YFKA Contract: ${CONFIG_PARAMS.yfka.contractBitly}`
        );
    } catch (error) {
        console.error("BOT CATCH ERROR /contracts:\n",error);
    }
});

bot.onText(/\/uniConfig/, async (msg) => {
    try {
        output_data = `UNISWAP TOKEN LIST
https://tokenlists.org/token-list?url=burnthestate.eth
        
UNISWAP PAIR ADDRESSES
----------------------------\n`;
        Object.keys(CONFIG_PARAMS['UNI_PAIR_ADDRESSES']).map((key) => output_data +=`${key}: ${CONFIG_PARAMS.UNI_PAIR_ADDRESSES[key]}\n`)

        output_data += `\n\nUNISWAP TOKEN ADDRESSES
----------------------------\n`;
        Object.keys(CONFIG_PARAMS['UNI_TOKEN_ADDRESSES']).map((key) => output_data +=`${key}: ${CONFIG_PARAMS.UNI_TOKEN_ADDRESSES[key]}\n`)
        bot.sendMessage(msg.chat.id, output_data);
    } catch (error) {
        console.error("BOT CATCH ERROR /contracts:\n",error);
    }
});

bot.onText(/\/donate/, async (msg) => {
    try {
        bot.sendMessage(msg.chat.id, CONFIG_PARAMS.donate);
    } catch (error) {
        console.error("BOT CATCH ERROR /donate:\n",error);
    }
});

bot.onText(/\/motd/, async (msg) => {
    try {
        bot.sendMessage(msg.chat.id, CONFIG_PARAMS.motd);
    } catch (error) {
        console.error("BOT CATCH ERROR /motd:\n",error);
    }
});

bot.onText(/\/latest/, async (msg) => {
    try {
        bot.sendMessage(msg.chat.id, CONFIG_PARAMS.motd);
    } catch (error) {
        console.error("BOT CATCH ERROR /latest:\n",error);
    }
});

bot.onText(/\/release/, async (msg) => {
    try {
        bot.sendMessage(msg.chat.id, CONFIG_PARAMS.motd);
    } catch (error) {
        console.error("BOT CATCH ERROR /release:\n",error);
    }
});

bot.onText(/\/articles/, async (msg) => {
    try {
        var reply = ""
        for (const [dict_key, dict_val] of Object.entries(CONFIG_PARAMS.articles)) {
            reply += dict_key + dict_val + "\n"
        }
        bot.sendMessage(msg.chat.id, reply);
    } catch (error) {
        console.error("BOT CATCH ERROR /articles:\n",error);
    }
});

bot.onText(/\/video/, async (msg) => {
    try {
        bot.sendMessage(msg.chat.id, CONFIG_PARAMS.videos[Math.floor(Math.random()*CONFIG_PARAMS.videos.length)])
    } catch (error) {
        console.error("BOT CATCH ERROR /video:\n",error);
    }
});

bot.onText(/\/github/, async (msg) => {
    try {
        bot.sendMessage(msg.chat.id, CONFIG_PARAMS.github);
    } catch (error) {
        console.error("BOT CATCH ERROR /github:\n",error);
    }
});

// Just to ping!
bot.onText(/\/testing/, async (msg) => {
    try {
        bot.sendMessage(msg.chat.id, 'testing');
    } catch (error) {
        console.error("BOT CATCH ERROR /testing:\n",error);
    }
});