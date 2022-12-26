var express = require("express");
var Web3 = require("web3");
var cors = require("cors");

// web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
web3 = new Web3(new Web3.providers.WebsocketProvider("ws://127.0.0.1:8546"));

// see more https://web3js.readthedocs.io/en/v1.5.2/web3-eth-contract.html#eth-contract
var proofContract = new web3.eth.Contract(
  [
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
  ],
  "0x4A69A347A236665146E924A8a8Ab995402Be5280" // address of the smart contract
); // create contract INSTANCE with all its methods and events defined in its json interface (in this case, i use ABI)

var app = express();
app.use(
  cors({
    origin: "*",
  })
);
var server = require("http").createServer(app);
var io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");
});

server.listen(8080, () => {
  console.log("Server is listening on port 8080");
});

app.use(express.static("public"));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/html/index.html");
});

app.get("/submit", function (req, res) {
  var fileHash = req.query.hash;
  var owner = req.query.owner;
  proofContract.methods
    .set(owner, fileHash)
    .send({
      from: "0xdffc38c03a87f4f3b0d6fc160433735ceb4665e1",
    })
    .on("transactionHash", function (transactionHash) {
      res.send(transactionHash);
    });
});

app.get("/getInfo", function (req, res) {
  var fileHash = req.query.hash;
  proofContract.methods
    .get(fileHash)
    .call()
    .then((result) => {
      console.log(result);
      res.send(result);
    });
});

// subcribe event
proofContract.events.logFileAddedStatus({ fromBlock: 0 }, (error, event) => {
  if (error) {
    console.log(error);
  }

  console.log("hihi" + event);
});
// .on("connected", function (subscriptionId) {
//   console.log(subscriptionId);
// })
// .on("data", function (event) {
//   console.log(event); // same results as the optional callback above
// })
// .on("changed", function (event) {
//   console.log(event); // remove event from local database
// })
// .on("error", function (error, receipt) {
//   console.log(receipt); // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
// });

// proofContract.getPastEvents(
//   "logFileAddedStatus",
//   { fromBlock: 0 },
//   (error, event) => {
//     if (error) {
//       console.log(error);
//     }

//     if (event) {
//       console.log(event);
//     }
//   }
// );
