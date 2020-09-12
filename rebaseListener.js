const dotenv = require('dotenv');
dotenv.config(".env");

const commas = require('./commas');
const {wssWeb3} = require('./src/components/functions/web3');
const http = require('http');

// CONTRACT DETAILS
xampDecimals = 9;
xamp0x = "0x8cEB211A7567Cf399e1eE01E6974bf4a13b64C04";
xampAbi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"oldPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newPrice","type":"uint256"}],"name":"RebaseFail","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"oldPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"delta","type":"uint256"}],"name":"RebaseSuccess","type":"event"},{"inputs":[],"name":"_owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_rebase","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_a","type":"address"}],"name":"canOperateRebase","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_t","type":"uint256"}],"name":"changePeriod","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_pool","type":"address"}],"name":"changePool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"}],"name":"changeToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"currentExchangeRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"guarded","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastExchangeRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastRebase","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nextSupplyDelta","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pool","outputs":[{"internalType":"contract IUniswapV2Pair","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rebase","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"refresh","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"exchangeRate","type":"uint256"}],"name":"shouldRebase","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"timeBetweenRebases","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"contract IRebaseableERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenDecimals","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferTokenOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unguard","outputs":[],"stateMutability":"nonpayable","type":"function"}];
xampWeb3 = new wssWeb3.eth.Contract(xampAbi, xamp0x);

tobDecimals = 18;
tob0x = "0x68D95Dfcd2916cf76a72d1dEe5b7BcEcf14aDb44";
tobAbi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"oldPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newPrice","type":"uint256"}],"name":"RebaseFail","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"oldPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"delta","type":"uint256"}],"name":"RebaseSuccess","type":"event"},{"inputs":[],"name":"_owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_rebase","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_a","type":"address"}],"name":"canOperateRebase","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_t","type":"uint256"}],"name":"changePeriod","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_pool","type":"address"}],"name":"changePool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"}],"name":"changeToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"currentExchangeRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"guarded","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastExchangeRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastRebase","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nextSupplyDelta","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pool","outputs":[{"internalType":"contract IUniswapV2Pair","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rebase","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"refresh","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"exchangeRate","type":"uint256"}],"name":"shouldRebase","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"timeBetweenRebases","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"contract IRebaseableERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenDecimals","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferTokenOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unguard","outputs":[],"stateMutability":"nonpayable","type":"function"}];
tobWeb3 = new wssWeb3.eth.Contract(tobAbi, tob0x);

const PRICE_DECIMALS = 10;
var tgBotInstance = null;

function emitBotMessage(body) {
    try {
        tgBotInstance.sendMessage(process.env.TELEGRAM_CHAT_ID, body);
        if(process.env.DEPLOY === 'PROD') {
            tgBotInstance.sendMessage("-1001166269042", body);
        }
    } catch (error) {
        console.error("BOT CATCH ERROR /supply:\n",error);
    }
}

function buildEmailBody(contractEvent, oldPrice, newPrice, delta, ticker) {
    txHash = "No TX issued."
    broadcastHeader = "RebaseFail \ud83d\udd34"
    coinsBurned = 0
    if(delta) {
        broadcastHeader = "RebaseSuccess \ud83d\udd25\ud83d\udd25\ud83d\udd25"
        coinsBurned = commas(delta.toFixed(2))
    }

    if(contractEvent.transactionHash) {txHash = contractEvent.transactionHash}

    emailBody = `$${ticker} ${broadcastHeader}
New Price: $${newPrice/Math.pow(10, PRICE_DECIMALS)}
Old Price: $${oldPrice/Math.pow(10, PRICE_DECIMALS)}

Coins Burned: ${coinsBurned}

TX Hash: ${txHash}`;
    return emailBody
}

// XAMP XAMP XAMP
function xampRebaseSuccessListener(err, contractEvent) {
    if (err) {
        console.error('XAMP @ RebaseSuccess listener error: ', err);
        return;
    }

    var {oldPrice, newPrice, delta} = contractEvent.returnValues;
    delta = delta/Math.pow(10, xampDecimals)
    emitBotMessage(buildEmailBody(contractEvent, oldPrice, newPrice, delta, "XAMP"));
}

function xampRebaseFailListener(err, contractEvent) {
    if (err) {
        console.error('XAMP @ RebaseFail listener error: ', err);
        return;
    }

    var {oldPrice, newPrice} = contractEvent.returnValues;
    emitBotMessage(buildEmailBody(contractEvent, oldPrice, newPrice, null, "XAMP"));
}

function xampListenToRebaseSuccess(fromBlockNumber, rebaseSuccessListener) {
    console.log('ListenTo: XAMP @ RebaseSuccess');
    xampWeb3.events.RebaseSuccess({
        fromBlock: (fromBlockNumber || 0),
    }, rebaseSuccessListener)
}

function xampListenToRebaseFail(fromBlockNumber, rebaseFailListener) {
    console.log('ListenTo: XAMP @ RebaseFail');
    xampWeb3.events.RebaseFail({
        fromBlock: (fromBlockNumber || 0),
    }, rebaseFailListener)
}


// TOB TOB TOB
function tobRebaseSuccessListener(err, contractEvent) {
    if (err) {
        console.error('TOB @ RebaseSuccess listener error: ', err);
        return;
    }

    var {oldPrice, newPrice, delta} = contractEvent.returnValues;
    delta = delta/Math.pow(10, tobDecimals)
    emitBotMessage(buildEmailBody(contractEvent, oldPrice, newPrice, delta, "TOB"));
}

function tobRebaseFailListener(err, contractEvent) {
    if (err) {
        console.error('TOB @ RebaseFail listener error: ', err);
        return;
    }

    var {oldPrice, newPrice} = contractEvent.returnValues;
    emitBotMessage(buildEmailBody(contractEvent, oldPrice, newPrice, null, "TOB"));
}

function tobListenToRebaseSuccess(fromBlockNumber, rebaseSuccessListener) {
    console.log('ListenTo: TOB @ RebaseSuccess');
    tobWeb3.events.RebaseSuccess({
        fromBlock: (fromBlockNumber || 0),
    }, rebaseSuccessListener)
}

function tobListenToRebaseFail(fromBlockNumber, rebaseFailListener) {
    console.log('ListenTo: TOB @ RebaseFail');
    tobWeb3.events.RebaseFail({
        fromBlock: (fromBlockNumber || 0),
    }, rebaseFailListener)
}

// APP FUNCTIONALITY
initializeListeners = async (bot) => {
    tgBotInstance = bot;
    const blockNumber = await wssWeb3.eth.getBlockNumber();

    xampListenToRebaseSuccess(blockNumber, xampRebaseSuccessListener);
    xampListenToRebaseFail(blockNumber, xampRebaseFailListener);

    tobListenToRebaseSuccess(blockNumber, tobRebaseSuccessListener);
    tobListenToRebaseFail(blockNumber, tobRebaseFailListener);
}

module.exports = initializeListeners;