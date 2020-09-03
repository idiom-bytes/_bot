const commas = require('./functions/commas');
const BaseCoin = require('./BaseCoin');

class Boa extends BaseCoin {
    constructor(params, coinGeckoClient) {
        super(params, coinGeckoClient);
    }

    async updateSupply() {
        console.log("BOA: updateSupply()");
        await super.updateSupply();

        // TODO - Having challenges communicating with BOA ctc.methods.
        // https://etherscan.io/address/0xf9c36c7ad7fa0f0862589c919830268d1a2581a1#code
        // await this.contractWeb3.methods.is_profitable().call()
        await this.contractWeb3.methods.totalPooled().call()
            .then(res => {
                this.supplyCurrent["taxPool"] = res / Math.pow(10,this.contractDecimals)
            })
            .catch(err => console.log(err));
        console.log('BOA Supply: taxPool: ', this.supplyCurrent['taxPool']);

        await this.contractWeb3.methods.totalSupply().call()
            .then(res => {
                this.supplyCurrent["total"] = res / Math.pow(10,this.contractDecimals)
            })
            .catch(err => console.log(err));
        console.log('BOA Supply: total: ', this.supplyCurrent["total"]);

        // SUPPLY START
        this.supplyStart["circulating"] = this.supplyStart["total"];
        // SUPPLY CURRENT
        this.supplyCurrent["remainder"] = this.supplyCurrent["total"] - this.supplyCurrent["taxPool"];
        this.supplyCurrent["circulating"] = this.supplyCurrent["total"];

        console.log(`BOA: Start Supply circulating: `, this.supplyStart["circulating"]);
        console.log(`BOA: Current Supply circulating: `, this.supplyCurrent["circulating"]);
    }

    async updateRebase() {
        // BOA does not have a Rebase contract, it's functionality is built into the core contract.
        await this.contractWeb3.methods.is_profitable().call()
            .then(res => {
                this.contractData["isProfitable"] = res;
            })
            .catch(err => console.log(err));

        this.contractData["canRebase"] = this.contractData["isProfitable"] === true;

        console.log(`BOA: isProfitable: `, this.contractData["isProfitable"]);
        console.log(`BOA: canRebase: `, this.contractData["canRebase"]);
    }

    async init() {
        console.log("BOA: init()");
        await super.init();
    }

    getSupplyStart() {
        return `${this.ticker}
        Total Supply: ${commas(this.supplyStart["total"])}
        Tax Pool Supply: ${commas(this.supplyStart["taxPool"])}  (${((this.supplyStart["taxPool"]/this.supplyStart["total"])*100).toFixed(2)}%)
        Circulating Supply: ${commas(this.supplyStart["circulating"])}  (${((this.supplyStart["circulating"]/this.supplyStart["total"])*100).toFixed(2)}%)`;
    }

    getSupplyCurrent() {
        return `${this.ticker}
        Total Supply: ${commas((this.supplyCurrent["total"]).toFixed(2))}
        Tax Pool Supply: ${commas((this.supplyCurrent["taxPool"]).toFixed(2))} (${((this.supplyCurrent["taxPool"]/this.supplyCurrent["total"])*100).toFixed(2)}%)
        Circulating Supply: ${commas((this.supplyCurrent["circulating"]).toFixed(2))} (${((this.supplyCurrent["circulating"]/this.supplyCurrent["total"])*100).toFixed(2)}%)`;
    }

    getRebase() {
        return `${this.ticker}
        To Burn: Tax Pool > (Circulating - Tax Pool)
        Tax Pool Supply: ${this.supplyCurrent["taxPool"].toFixed(6)}
        Circulating Supply: ${this.supplyCurrent["circulating"].toFixed(6)}
        Remaining Supply: ${this.supplyCurrent["remainder"].toFixed(6)}
        _contract.IsProfitable(): ${this.contractData["isProfitable"]}
        _contract.CanRebase(): ${this.contractData["canRebase"]}`;
    }
}

module.exports = Boa;