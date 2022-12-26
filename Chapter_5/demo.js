var HookedWeb3Provider = require("hooked-web3-provider");
var Web3 = require("web3");
const EthereumTx = require("ethereumjs-tx").Transaction;
const EthJS = require("ethereumjs-util");

// see more: https://www.npmjs.com/package/hooked-web3-provider
var provider = new HookedWeb3Provider({
  host: "http://localhost:8545",
  transaction_signer: {
    hasAddress: (address, callback) => {
      callback(null, true);
    },
    signTransaction: (tx_params, callback) => {
      console.log(tx_params);
      var rawTx = {
        gasPrice: web3.toHex(tx_params.gasPrice),
        gasLimit: web3.toHex(tx_params.gas),
        value: web3.toHex(tx_params.value),
        from: tx_params.from,
        to: tx_params.to,
        nonce: web3.toHex(tx_params.nonce),
      };
      var privateKey = EthJS.toBuffer(
        "0xef46232b62dc064192713437da1b634bb831ba57acf46be615e0431dd10db80e",
        "hex"
      );
      var tx = new EthereumTx(rawTx);
      tx.sign(privateKey);
      callback(null, EthJS.bufferToHex(tx.serialize()));
    },
  },
});

var web3 = new Web3(provider);

web3.eth.sendTransaction(
  {
    from: "0xdffc38c03a87f4f3b0d6fc160433735ceb4665e1",
    gasPrice: "20000000000",
    gas: "21000",
    to: "0x8bb91bb5463fbf2f3be4d171c993779e0946c697",
    value: web3.toWei("0.1", "ether"),
  },
  (error, result) => {
    console.log(error, result);
  }
);
