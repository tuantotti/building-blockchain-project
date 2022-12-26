const Web3 = require("web3");
const fs = require("fs");

web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));

bytecode = fs.readFileSync("Proof_sol_Proof.bin").toString();

var proofContract = new web3.eth.Contract([
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "bool", name: "status", type: "bool" },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "owner",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "fileHash",
        type: "string",
      },
    ],
    name: "logFileAddedStatus",
    type: "event",
  },
  {
    inputs: [{ internalType: "string", name: "fileHash", type: "string" }],
    name: "get",
    outputs: [
      { internalType: "uint256", name: "timestamp", type: "uint256" },
      { internalType: "string", name: "owner", type: "string" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "owner", type: "string" },
      { internalType: "string", name: "fileHash", type: "string" },
    ],
    name: "set",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
]);

// function getAccounts(index) {
//   return web3.eth.getAccounts().then((a) => {
//     console.log(typeof a[index]);
//     console.log(a[index].toLowerCase());
//     return a[index];
//   });
// }

// getAccounts(0);

var proof = proofContract
  .deploy({ data: bytecode })
  .send({
    from: "0xdffc38c03a87f4f3b0d6fc160433735ceb4665e1",
    data: bytecode,
    gas: "4700000",
  })
  .then((newContractInstance) => {
    proofContract.options.address = newContractInstance.options.address;
  });

// console.log(proofContract);
// var event = proofContract.events.logFileAddedStatus(null, {
//   fromBlock: 0,
// });

// console.log(event);
// event.get(function (error, result) {
//   if (!error) {
//     console.log(result);
//   } else {
//     console.log(error);
//   }
// });
// event.watch(function (error, result) {
//   if (!error) {
//     console.log(result.args.status);
//   } else {
//     console.log(error);
//   }
// });
// setTimeout(function () {
//   event.stopWatching();
// }, 60000);
