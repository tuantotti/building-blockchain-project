var Web3 = require("web3");

web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
// console.log( web3.eth.accounts[0]);
web3.eth.sendTransaction(
  {
    from: web3.eth.accounts[0],
    to: "0xa80db023ab5072e28407292654ef8a669e96e756",
    value: "3000000000000000000",
  },
  function (error, hash) {
    if (error) {
      console.log(error);
    }
    if (hash) {
      console.log(hash);
    }
  }
);
