var express = require("express");
var Web3 = require("web3");
var cors = require("cors");

// web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
web3 = new Web3(new Web3.providers.WebsocketProvider("ws://127.0.0.1:8546"));

// see more https://web3js.readthedocs.io/en/v1.5.2/web3-eth-contract.html#eth-contract
var proofContract = new web3.eth.Contract(
  [
    {
      constant: false,
      inputs: [{ name: "fileHash", type: "string" }],
      name: "get",
      outputs: [
        { name: "timestamp", type: "uint256" },
        { name: "owner", type: "string" },
      ],
      payable: false,
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { name: "owner", type: "string" },
        { name: "fileHash", type: "string" },
      ],
      name: "set",
      outputs: [],
      payable: false,
      type: "function",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: false, name: "status", type: "bool" },
        { indexed: false, name: "timestamp", type: "uint256" },
        { indexed: false, name: "owner", type: "string" },
        { indexed: false, name: "fileHash", type: "string" },
      ],
      name: "logFileAddedStatus",
      type: "event",
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
  console.log(socket.id);
  socket.on("disconnect", () => console.log("user disconnected"));
});

server.listen(8080, () => {
  console.log("Server is listening on port 8080");
});

app.use(express.static("public"));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/submit", function (req, res) {
  var fileHash = req.query.hash;
  var owner = req.query.owner;
  proofContract.methods
    .set(owner, fileHash)
    .send({
      from: "0xdffc38c03a87f4f3b0d6fc160433735ceb4665e1",
      gas: 50000,
    })
    .on("transactionHash", (transactionHash) => {
      res.send(transactionHash);
    });
});

app.get("/getInfo", function (req, res) {
  var fileHash = req.query.hash;
  console.log(typeof fileHash);
  console.log(fileHash);
  proofContract.methods
    .get(fileHash)
    .call()
    .then((result) => {
      console.log(result);
    });
});

// subcribe event
proofContract.events.logFileAddedStatus(
  { fromBlock: 0, gas: 50000 },
  (error, result) => {
    if (!error) {
      if (result.args.status == true) {
        io.send(result);
      }
    }
  }
);
