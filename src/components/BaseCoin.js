const commas = require('./functions/commas');
const web3 = require('./functions/web3')
const axios = require('axios');
const CoinGecko = require('coingecko-api');

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || 'F1H66VY5U2MYJDE8J37GCZABCF2M17Y1TX';
console.log("ETHERSCAN_API_KEY", ETHERSCAN_API_KEY);

class BaseCoin {
    constructor(params, coinGeckoClient) {
        // CONTRACT PARAMETERS
        this.slug = params.slug;
        this.ticker = params.ticker;
        this.contractDecimals = params.decimals;
        this.priceDecimals = params.priceDecimals;

        // CONTRACT ADDRESSES
        this.contract0x = params.contractAddress;
        this.contractAbi = params.contractAbi;
        this.contractWeb3 = null;

        // USE ADDRESSES TO EXTRA UP-TO-DATE BALANCE INFORMATION
        // assert type of params.addresses, dict<str,list[str]>
        this.addresses = params.addresses;

        // SUPPLY PARAMETERSS
        // assert type of params.supply, dict<str, int>
        this.supplyStart = params.supplyStart;
        this.supplyCurrent = {};

        // CONTRACT LOGIC
        this.contractData = {};

        // COINGECKO DATA
        this.cgClient = coinGeckoClient;
        this.CG_PARAMS = params.CG_PARAMS
        this.cg_price = null;
    }

    filterDefaultAddresses(key) {
        return ["contract","burn"].includes(key) === false;
    }

    async updateSupply() {
        // Get current supply from addresses
        const tokenSupplyRequest = `https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=${this.addresses["contract"]}&apikey=${ETHERSCAN_API_KEY}`;
        await axios.get(tokenSupplyRequest)
            .then(res => {
                this.supplyCurrent["total"] = res.data.result / Math.pow(10,this.contractDecimals)
            });

        if('burn' in this.addresses) {
            var burnedSupplyRequest = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${this.addresses["contract"]}&address=${this.addresses["burn"]}&tag=latest&apikey=${ETHERSCAN_API_KEY}`;
            await axios.get(burnedSupplyRequest)
                .then(res => {
                    this.supplyCurrent["burn"] = res.data.result / Math.pow(10,this.contractDecimals)
                });
        }

        for (const [dict_key, dict_val] of Object.entries(this.addresses).filter(entry => this.filterDefaultAddresses(entry[0]))) {
            var supplyRequest = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${this.contract0x}&address=${dict_val}&tag=latest&apikey=${ETHERSCAN_API_KEY}`;
            await axios.get(supplyRequest)
               .then(res => {
                   this.supplyCurrent[dict_key] = res.data.result / Math.pow(10,this.contractDecimals);
               });
        }
    }

    async updatePrice() {
        await this.cgClient.coins.fetch(this.slug, this.CG_PARAMS)
            .then(res => {
                this.cg_price = res.data.market_data.current_price;
            });
    }

    async updateRebase() {
        console.log(`${this.slug} needs to override updateRebase()`);
    }

    async init() {
        this.contractWeb3 = new web3.eth.Contract(this.contractAbi, this.contract0x);
    }

    async update() {
        await this.updateSupply();
        await this.updateRebase();
        await this.updatePrice();
    }

    getPrice(currency) {
        if(this.cg_price !== null) {
            return this.cg_price[currency];
        }
        return null
    }

    getSupplyStart() {
        console.log(`{this.slug} needs to override getSupplyStart()`);
        return null
    }

    getSupplyCurrent() {
        console.log(`{this.slug} needs to override getSupplyCurrent()`);
        return null;
    }
}

module.exports = BaseCoin;