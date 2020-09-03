const commas = require('./functions/commas');
const BaseCoin = require('./BaseCoin');
const web3 = require('./functions/web3')
const moment = require('moment')

class Tob extends BaseCoin {
    constructor(params, coinGeckoClient) {
        super(params, coinGeckoClient);

        this.rebase0x = params.rebaseAddress;
        this.rebaseAbi = params.rebaseAbi;
        this.rebaseWeb3 = null;
    }

    async updateSupply() {
        console.log("TOB: updateSupply()");
        await super.updateSupply();

        // SUPPLY START
        this.supplyStart["vested"] = this.supplyStart["vested1"] + this.supplyStart["vested2"];
        this.supplyStart["circulating"] = this.supplyStart["total"] - this.supplyStart["burn"];

        // SUPPLY CURRENT
        // this.supplyCurrent["vested"] = obj => Object.values(this.supplyCurrent).filter(this.filterDefaultsupplyAddresses).select(value => {'vested' in value}).reduce((a, b) => a + b);
        this.supplyCurrent["vested"] = this.supplyCurrent["vested1"] + this.supplyCurrent["vested2"];
        this.supplyCurrent["circulating"] = this.supplyCurrent["total"] - this.supplyCurrent["burn"];

        console.log(`Start circulating Supply: `, this.supplyStart["circulating"]);
        console.log(`Current circulating Supply: `, this.supplyCurrent["circulating"]);
    }

    async updateRebase() {
        // TODO - We should be able to just call core contract functions
        // TODO - canRebaseOnPrice + canRebaseOnDate + canRebaes << ctc.methods

        // TOB REBASE LOGIC
        // Is contract.currentExchangeRate() > contract.lastExchangeRate() Then contract.canRebase()
        // Is Time.Now() > contract.lastRebaseDate() + contract.hoursBetweenRebases() Then contract.canRebase()

        // STEP #1
        // TOB PRICE LOGIC
        await this.rebaseWeb3.methods.currentExchangeRate().call()
            .then(res => {
                this.contractData["currentExchangeRate"] = res / Math.pow(10,this.priceDecimals);
                console.log('TOB: currentExchangeRate: ', this.contractData['currentExchangeRate']);
            })

        await this.rebaseWeb3.methods.lastExchangeRate().call()
            .then(res => {
                this.contractData["lastExchangeRate"] = res / Math.pow(10,this.priceDecimals);
                console.log('TOB: lastRebaseRate: ', this.contractData['lastExchangeRate']);
            })

        // TEST/DEBUG LOGIC TO SIMULATE REBASE PRICE
        // this.contractData["currentExchangeRate"] = 2.0
        // this.contractData["lastExchangeRate"] = 1.5

        // STEP #2
        // TOB DATE LGOIC
        await this.rebaseWeb3.methods.lastRebase().call()
            .then(async (res) => {
                // this.contractData["lastRebaseDate"] = new Date(res*1000);
                this.contractData["lastRebaseDate"]= moment(new Date(res * 1000));
                console.log('TOB: lastRebaseDate: ', this.contractData['lastRebaseDate'].format('MM/DD/YYYY HH:mm:ss'));
            })

        // Time Between Rebases - In Seconds
        await this.rebaseWeb3.methods.timeBetweenRebases().call()
            .then(async (res) => {
                this.contractData["timeBetweenRebases"] = res;
                console.log("TOB: timeBetweenRebases: ", this.contractData["timeBetweenRebases"]);

                this.contractData["nextRebaseDate"] = this.contractData["lastRebaseDate"].clone();
                this.contractData["nextRebaseDate"].add(this.contractData["timeBetweenRebases"], 'seconds')

                // TEST/DEBUG LOGIC TO SIMULATE REBASE COUNTDOWN
                // this.contractData["nextRebaseDate"] = moment(new Date())
                // this.contractData["nextRebaseDate"].add(10, 'seconds')

                // var lastRebaseDateString = this.contractData["lastRebaseDate"].format('MM/DD/YYYY HH:mm:ss');
                // var nextRebaseDateString = nextRebaseDate.format('MM/DD/YYYY HH:mm:ss');

                // this.contractData["lastRebaseDateString"] = lastRebaseDateString;
                // this.contractData["nextRebaseDateString"] = nextRebaseDateString;

                console.log("TOB: nextRebaseDate: ", this.contractData["nextRebaseDate"].format('MM/DD/YYYY HH:mm:ss'));
            })

        this.contractData["canBurn"] = this.contractData["currentExchangeRate"] > this.contractData["lastExchangeRate"];
        this.contractData["canRebase"] = (new Date().getTime() > this.contractData["nextRebaseDate"]) || this.contractData["canBurn"];

        console.log(`TOB: canBurn: `, this.contractData["canBurn"]);
        console.log(`TOB: canRebase: `, this.contractData["canRebase"]);
    }

    async init() {
        console.log("TOB .init()");
        this.rebaseWeb3 = new web3.eth.Contract(this.rebaseAbi, this.rebase0x);

        await super.init();
    }

    getSupplyStart() {
        return `${this.ticker}
        Total: ${commas(this.supplyStart["total"])}
        Burned: ${commas(this.supplyStart["burn"])} (${((this.supplyStart["burn"]/this.supplyStart["total"])*100).toFixed(2)}%)
        Vested: ${commas(this.supplyStart["vested"])} (${((this.supplyStart["vested"]/this.supplyStart["total"])*100).toFixed(2)}%)
        Circulating: ${commas(this.supplyStart["circulating"].toFixed(2))} (${((this.supplyStart["circulating"]/this.supplyStart["total"])*100).toFixed(2)}%)`;
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
        To Burn: Current Price > Target Price 
        Current Price: ${this.contractData["currentExchangeRate"].toFixed(6)}
        Target Price: ${this.contractData["lastExchangeRate"].toFixed(6)}
        Can Burn: ${this.contractData["canBurn"]}
        Last Rebase: ${this.contractData["lastRebaseDate"].fromNow()}
        Rebase will be enabled: ${this.contractData["nextRebaseDate"].fromNow()}
        Can Rebase: ${this.contractData["canRebase"]}`;
    }
}

module.exports = Tob;