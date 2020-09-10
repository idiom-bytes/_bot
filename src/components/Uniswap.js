const axios = require('axios');
const numeral = require('numeral');

class Uniswap {
    constructor(params) {
        // UNISWAP PAIRS
        this.uniPairs = params.UNI_PAIR_ADDRESSES;

        // UNISWAP DATA
        this.uniData = null;
        this.ratioData = {};
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
          }
        `;

        // TODO - Use await .then => so we can catch errors
        const {data} = await axios.post('https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2', {
            query,
        });
        this.uniData = data.data;

        const getRatio = (token0, token1) => {
          return numeral(
            Math.ceil((token0.derivedETH / token1.derivedETH) * 10000) /
              10000
          ).format("0,0.0000");
        };

        const keys = Object.keys(this.uniData);
        keys.forEach((key) => {
          const { token0, token1 } = this.uniData[key];
          if (['TOB_BOA', 'ETH_BOA'].indexOf(key) >= 0) {
            this.ratioData[key] = getRatio(token1, token0);
          } else {
            this.ratioData[key] = getRatio(token0, token1);
          }
        });

        // I want to do the same for coingecko
        // this.ratioData["ETH_XAMP"] = numeral(Math.ceil((this.uniData.ETH_XAMP.token0.derivedETH / this.uniData.ETH_XAMP.token1.derivedETH) * 100) / 100).format('0,0.00');
        // this.ratioData["ETH_TOB"] = numeral(Math.ceil((this.uniData.ETH_TOB.token0.derivedETH / this.uniData.ETH_TOB.token1.derivedETH) * 100) / 100).format('0,0.00');
        // this.ratioData["TOB_XAMP"] = numeral(Math.ceil((this.uniData.TOB_XAMP.token0.derivedETH / this.uniData.TOB_XAMP.token1.derivedETH) * 100) / 100).format('0,0.00');
        // this.ratioData["TOB_BOA"] = numeral(Math.ceil((this.uniData.TOB_BOA.token1.derivedETH / this.uniData.TOB_BOA.token0.derivedETH) * 100) / 100).format('0,0.00');
        // this.ratioData["ETH_BOA"] = numeral(Math.ceil((this.uniData.ETH_BOA.token1.derivedETH / this.uniData.ETH_BOA.token0.derivedETH) * 100) / 100).format('0,0.00');

    }
}

module.exports = Uniswap;