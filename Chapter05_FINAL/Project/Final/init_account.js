var Web3 = require("web3");

web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
console.log(typeof web3.eth.accounts[0]);
// web3.eth.sendTransaction(
//   {
//     from: web3.eth.accounts[0],
//     to: "0x682aa520e2a15a53e27649d92687fe181ce1ed17",
//     value: "",
//   },
//   function (error, hash) {
//     if (error) {
//       console.log(error);
//     }
//     if (hash) {
//       console.log(hash);
//     }
//   }
// );
