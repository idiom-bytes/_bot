const commas = require('./functions/commas');
const BaseCoin = require('./BaseCoin');
const web3 = require('./functions/web3')
const moment = require('moment')

class Eth extends BaseCoin {
    async updateSupply() {
    }

    async updateRebase() {
    }

    async init() {
        console.log("Eth .init()");
    }

    getSupplyStart() {
        return "";
    }

    getSupplyCurrent() {
        return "";
    }
}

module.exports = Eth;