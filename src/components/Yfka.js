const commas = require('./functions/commas');
const BaseCoin = require('./BaseCoin');
const web3 = require('./functions/web3')
const moment = require('moment')

class YFKA extends BaseCoin {
    async updateSupply() {
        console.log("YFKA: updateSupply()");
        await super.updateSupply();

        // SUPPLY START
        this.supplyStart["circulating"] = this.supplyStart["total"];

        // SUPPLY CURRENT
        this.supplyCurrent["burn"] = this.supplyCurrent["burn"];
        this.supplyCurrent["circulating"] = this.supplyCurrent["total"] - this.supplyCurrent["burn"];

        console.log(`Start circulating Supply: `, this.supplyStart["circulating"]);
        console.log(`Current circulating Supply: `, this.supplyCurrent["circulating"]);
    }

    async updateRebase() {
    }

    async updatePrice() {
    }

    async init() {
        console.log("YFKA .init()");
        await super.init();
    }

    getSupplyStart() {
        return `${this.ticker} presale running.
        Visit https://www.burnthestate.com`;
    }

    getSupplyCurrent() {
        return `${this.ticker}
        Supply Total: ${commas(this.supplyCurrent["total"].toFixed(2))}
        Supply Burned: ${commas(this.supplyCurrent["burn"].toFixed(2))} (${((this.supplyCurrent["burn"]/this.supplyCurrent["total"])*100).toFixed(2)}%)
        Supply Circulating: ${commas(this.supplyCurrent["circulating"].toFixed(2))} (${((this.supplyCurrent["circulating"]/this.supplyCurrent["total"])*100).toFixed(2)}%)`;
    }
}

module.exports = YFKA;