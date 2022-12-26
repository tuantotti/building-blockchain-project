// const lightwallet = require("lightwallet")(
//   "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsaWdodHdhbGxldCIsImp0aSI6ImFkbWluLnNvbWVwcm9qZWN0QGdtYWlsLmNvbSJ9.kGVJqoUQzXJSm2FypkSr6on8547bQ68I-Lu4N16ZlKk"
// );
// const Web3 = require("web3");
// const HookedWeb3Provider = require("hooked-web3-provider");

function generate_seed() {
  var new_seed = lightwallet.keystore.generateRandomSeed();
  document.getElementById("seed").value = new_seed;
  generate_addresses(new_seed);
}

var totalAddresses = 0;
function generate_addresses(seed) {
  if (seed == undefined) {
    seed = document.getElementById("seed").value;
  }
  if (!lightwallet.keystore.isSeedValid(seed)) {
    document.getElementById("info").innerHTML = "Please enter a valid seed";
    return;
  }
  totalAddresses = prompt("How many addresses do you want to generate");
  if (!Number.isInteger(parseInt(totalAddresses))) {
    document.getElementById("info").innerHTML =
      "Please enter valid number of addresses";
    return;
  }
  var password = Math.random().toString();
  console.log(lightwallet.keystore.createVault);
  lightwallet.keystore.createVault(
    {
      password: password,
      seedPhrase: seed,
      hdPathString: "m/44'/60'/0'/0",
    },
    function (err, ks) {
      console.log(ks);
      ks.keyFromPassword(password, function (err, pwDerivedKey) {
        if (err) {
          document.getElementById("info").innerHTML = err;
        } else {
          ks.generateNewAddress(pwDerivedKey, totalAddresses);
          var addresses = ks.getAddresses();
          var web3 = new Web3(
            new Web3.providers.HttpProvider("http://localhost:8545")
          );
          var html = "";
          for (var count = 0; count < addresses.length; count++) {
            var address = addresses[count];
            var private_key = ks.exportPrivateKey(address, pwDerivedKey);
            var balance = 0;
            web3.eth.getBalance(address).then((b) => (balance = b));
            html = html + "<li>";
            html = html + "<p><b>Address: </b>" + address + "</p>";
            html = html + "<p><b>Private Key: </b>" + private_key + "</p>";
            html =
              html +
              "<p><b>Balance: </b>" +
              web3.utils.fromWei(String(balance), "ether") +
              " ether</p>";
            html = html + "</li>";
          }
          document.getElementById("list").innerHTML = html;
        }
      });
    }
  );
}

function send_ether() {
  var seed = document.getElementById("seed").value;
  if (!lightwallet.keystore.isSeedValid(seed)) {
    document.getElementById("info").innerHTML = "Please enter a valid seed";
    return;
  }
  var password = Math.random().toString();
  lightwallet.keystore.createVault(
    {
      password: password,
      seedPhrase: seed,
      hdPathString: "m/44'/60'/0'/0",
    },
    function (err, ks) {
      console.log(ks);
      ks.keyFromPassword(password, function (err, pwDerivedKey) {
        if (err) {
          document.getElementById("info").innerHTML = err;
        } else {
          ks.generateNewAddress(pwDerivedKey, totalAddresses);
          ks.passwordProvider = function (callback) {
            callback(null, password);
          };
          var provider = new HookedWeb3Provider({
            host: "http://localhost:8545",
            transaction_signer: ks,
          });
          var web3 = new Web3(provider);
          var from = document.getElementById("address1").value;
          var to = document.getElementById("address2").value;
          var value = web3.utils.toWei(
            document.getElementById("ether").value,
            "ether"
          );
          web3.eth.sendTransaction(
            {
              from: from,
              to: to,
              value: value,
              gas: 21000,
            },
            function (error, result) {
              if (error) {
                document.getElementById("info").innerHTML = error;
              } else {
                document.getElementById("info").innerHTML =
                  "Txn hash: " + result;
              }
            }
          );
        }
      });
    }
  );
}
