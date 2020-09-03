const commas = require('./functions/commas');
const BaseCoin = require('./BaseCoin');
const web3 = require('./functions/web3')
const moment = require('moment')

class Xamp extends BaseCoin {
    constructor(params, coinGeckoClient) {
        super(params, coinGeckoClient);

        this.rebase0x = params.rebaseAddress;
        this.rebaseAbi = params.rebaseAbi;
        this.rebaseWeb3 = null;
    }

    async updateSupply() {
        console.log("XAMP: updateSupply()");
        await super.updateSupply();

        // SUPPLY START
        this.supplyStart["circulating"] = this.supplyStart["total"];
        // SUPPLY CURRENT
        this.supplyCurrent["circulating"] = this.supplyCurrent["total"] - this.supplyCurrent["burn"];

        console.log(`XAMP: Start circulating Supply: `, this.supplyStart["circulating"]);
        console.log(`XAMP: Current circulating Supply: `, this.supplyCurrent["circulating"]);
    }

    async updateRebase() {
        // XAMP REBASE LOGIC
        // XAMP PRICE LOGIC
        await this.rebaseWeb3.methods.currentExchangeRate().call()
            .then(res => {
                this.contractData["currentExchangeRate"] = res / Math.pow(10,this.priceDecimals);
                console.log('XAMP: currentExchangeRate: ', this.contractData['currentExchangeRate']);
            })

        await this.rebaseWeb3.methods.lastExchangeRate().call()
            .then(res => {
                this.contractData["lastExchangeRate"] = res / Math.pow(10,this.priceDecimals);
                console.log('XAMP: lastExchangeRate: ', this.contractData['lastExchangeRate']);
            })

        // TEST/DEBUG LOGIC TO SIMULATE REBASE PRICE
        // this.contractData["currentExchangeRate"] = 1.5
        // this.contractData["lastExchangeRate"] = 2.0

        // XAMP DATE LOGIC
        await this.rebaseWeb3.methods.lastRebase().call()
            .then(async (res) => {
                // this.contractData["lastRebaseDate"] = new Date(res*1000);
                this.contractData["lastRebaseDate"]= moment(new Date(res * 1000));
                console.log('XAMP: lastRebaseDate: ', this.contractData['lastRebaseDate'].format('MM/DD/YYYY HH:mm:ss'));
            })

        // Time Between Rebases - In Seconds
        await this.rebaseWeb3.methods.timeBetweenRebases().call()
            .then(async (res) => {
                this.contractData["timeBetweenRebases"] = res;
                console.log("XAMP: timeBetweenRebases: ", this.contractData["timeBetweenRebases"]);

                this.contractData["nextRebaseDate"] = this.contractData["lastRebaseDate"].clone();
                this.contractData["nextRebaseDate"].add(this.contractData["timeBetweenRebases"], 'seconds')

                // TEST/DEBUG LOGIC TO SIMULATE REBASE COUNTDOWN
                // this.contractData["nextRebaseDate"] = moment(new Date())
                // this.contractData["nextRebaseDate"].add(10, 'seconds')

                // var lastRebaseDateString = this.contractData["lastRebaseDate"].format('MM/DD/YYYY HH:mm:ss');
                // var nextRebaseDateString = nextRebaseDate.format('MM/DD/YYYY HH:mm:ss');

                // this.contractData["lastRebaseDateString"] = lastRebaseDateString;
                // this.contractData["nextRebaseDateString"] = nextRebaseDateString;
                console.log("XAMP: nextRebaseDate: ", this.contractData["nextRebaseDate"].format('MM/DD/YYYY HH:mm:ss'));
            })

        this.contractData["canBurn"] = this.contractData['currentExchangeRate'] < this.contractData['lastExchangeRate'];
        this.contractData["canRebase"] = new Date().getTime() > this.contractData["nextRebaseDate"];

        console.log(`XAMP: canBurn: `, this.contractData["canBurn"]);
        console.log(`XAMP: canRebase: `, this.contractData["canRebase"]);
    }

    async init() {
        console.log("XAMP: init()");
        this.rebaseWeb3 = new web3.eth.Contract(this.rebaseAbi, this.rebase0x);

        await super.init();
    }

    getSupplyStart() {
        return `${this.ticker}
        Total: ${commas(this.supplyStart["total"])}
        Vested: ${commas(this.supplyStart["vested"])}  (${((this.supplyStart["vested"]/this.supplyStart["total"])*100).toFixed(2)}%)
        Circulating: ${commas(this.supplyStart["circulating"])} (${((this.supplyStart["circulating"]/this.supplyStart["total"])*100).toFixed(2)}%)`;
    }

    getSupplyCurrent() {
        return `${this.ticker}
        Supply Total: ${commas(this.supplyCurrent["total"].toFixed(2))}
        Supply Burned: ${commas(this.supplyCurrent["burn"].toFixed(2))} (${((this.supplyCurrent["burn"]/this.supplyCurrent["total"])*100).toFixed(2)}%)
        Supply Vested: ${commas(this.supplyCurrent["vested"].toFixed(2))} (${((this.supplyCurrent["vested"]/this.supplyCurrent["total"])*100).toFixed(2)}%)
        Supply Circulating: ${commas(this.supplyCurrent["circulating"].toFixed(2))} (${((this.supplyCurrent["circulating"]/this.supplyCurrent["total"])*100).toFixed(2)}%)`;
    }

    getRebase() {
        return `${this.ticker}
        To Burn: Current Price < Last Price 
        Current Price: ${this.contractData["currentExchangeRate"].toFixed(6)}
        Last Price: ${this.contractData["lastExchangeRate"].toFixed(6)}
        Can Burn: ${this.contractData["canBurn"]}
        Last Rebase: ${this.contractData["lastRebaseDate"].fromNow()}
        Rebase will be enabled: ${moment(this.contractData["nextRebaseDate"]).fromNow()}        
        Can Rebase: ${this.contractData["canRebase"]}`;
    }
}

module.exports = Xamp;