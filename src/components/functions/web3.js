const Web3 = require('web3');
const dotenv = require('dotenv');
dotenv.config();

const INFURA_API_KEY = process.env.INFURA_API_KEY || '02b71bfb96f94097a2df9ae5566a2f20';
const url = `https://mainnet.infura.io/v3/${INFURA_API_KEY}`
const web3 = new Web3(new Web3.providers.HttpProvider(url));

console.log("INFURA_API_URL", `https://mainnet.infura.io/v3/${INFURA_API_KEY}`);
console.log("INFURA_API_KEY", INFURA_API_KEY);

module.exports = web3;