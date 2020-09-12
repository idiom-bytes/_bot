const Web3 = require('web3');
const dotenv = require('dotenv');
dotenv.config();

const INFURA_API_KEY = process.env.INFURA_API_KEY || 'your_key_here';
const url = `https://mainnet.infura.io/v3/${INFURA_API_KEY}`
const websocketUrl = `wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}`
const web3 = new Web3(new Web3.providers.HttpProvider(url));
const wssWeb3 = new Web3(new Web3.providers.WebsocketProvider(websocketUrl));

console.log("INFURA_API_URL", `https://mainnet.infura.io/v3/${INFURA_API_KEY}`);
console.log("INFURA_WS_API_URL", `wss://mainnet.infura.io/v3/${INFURA_API_KEY}`);

module.exports = {web3, wssWeb3};