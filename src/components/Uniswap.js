const axios = require('axios');
const numeral = require('numeral');

class Uniswap {
    constructor(params) {
        // UNISWAP PAIRS
        this.uniPairs = params.UNI_PAIR_ADDRESSES;
        this.uniTokens = params.UNI_TOKEN_ADDRESSES;

        // UNISWAP DATA
        this.uniData = null;
        this.ratioData = {};

        // Collect tokenDerivedEth
        this.derivedEth = {};
        this.tokenUsd = {};
        this.ethUsd = null;
    }

    async fetchPairDataFromUni() {
        const query = `{
          ETH_XAMP: pair(id: "${this.uniPairs.ETH_XAMP}") {
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
          ETH_TOB: pair(id: "${this.uniPairs.ETH_TOB}") {
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
          ETH_BOA: pair(id: "${this.uniPairs.ETH_BOA}") {
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
          TOB_XAMP: pair(id: "${this.uniPairs.TOB_XAMP}") {
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
          TOB_BOA: pair(id: "${this.uniPairs.TOB_BOA}") {
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
          ETH_YFKA: pair(id: "${this.uniPairs.ETH_YFKA}") {
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
          XAMP_YFKA: pair(id: "${this.uniPairs.XAMP_YFKA}") {
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
          TOB_YFKA: pair(id: "${this.uniPairs.TOB_YFKA}") {
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
          BOA_YFKA: pair(id: "${this.uniPairs.BOA_YFKA}") {
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
          XAMP: token(id: "${this.uniTokens.XAMP}") {
            derivedETH
          }
          TOB: token(id: "${this.uniTokens.TOB}") {
            derivedETH
          }
          BOA: token(id: "${this.uniTokens.BOA}") {
            derivedETH
          }
          YFKA: token(id: "${this.uniTokens.YFKA}") {
            derivedETH
          }
          ETH: bundle(id: "1") {
            ethPrice
          }
          }
        `;

        // TODO - Use await .then => so we can catch errors
        const {data} = await axios.post('https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2', {
            query,
        });
        this.uniData = data.data;

        const getRatio = (token0, token1) => {
          return (token0.derivedETH / token1.derivedETH);
        };

        const keys = Object.keys(this.uniData);
        keys.forEach((key) => {
            if(key in this.uniPairs) {
                const {token0, token1} = this.uniData[key];
                if (['ETH_TOB', 'ETH_YFKA', 'TOB_BOA', 'TOB_YFKA', 'BOA_YFKA'].indexOf(key) >= 0) {
                    this.ratioData[key] = getRatio(token1, token0);
                } else if (['XAMP_YFKA'].indexOf(key) >= 0) {
                    this.ratioData[key] = 1.0 / getRatio(token0, token1);
                } else {
                    this.ratioData[key] = getRatio(token0, token1);
                }
            } else if(key in this.uniTokens) {
                this.derivedEth[key] = this.uniData[key].derivedETH;
            } else if(key === 'ETH') {
                this.ethUsd = this.uniData[key].ethPrice;
            }
        });

        const tokens = Object.keys(this.uniTokens);
        tokens.forEach((token) => {
            this.tokenUsd[token] = this.derivedEth[token] * this.ethUsd;
        });

        console.log("BOA_YFKA:", this.ratioData['BOA_YFKA']);
        console.log("ethUsd:", this.ethUsd);
    }
}

module.exports = Uniswap;