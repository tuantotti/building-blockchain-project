# building-blockchain-project
## chương 4:
### Tạo private network
#### Bước 1: cài geth https://geth.ethereum.org/downloads/ (mục đích: tạo local node để kết nối tới ethereum network (mainnet or testnet))
#### Bước 2: dùng puppeth (command tool in geth) để setup genesis block
```
run: puppeth
run: geth --datadir . init .\<tên file json chứa thông tin genesis block>
```
#### Bước 3: tạo account 
```
run: geth --datadir . account new
run: geth --datadir . account list (check list account)
Done tạo private network và 3 account
```
#### Bước 4: run private node and mining block
```
cho tất cả các câu lệnh cần thiết vào 1 file: startnode.cmd
run: file startnode.cmd 
(chạy file này xong sẽ Generating DAG algorithm sau đó thực hiện mine block)
run: c (run geth console via ipc)
```

#### Bước 5: RPC sử dụng web3 web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
