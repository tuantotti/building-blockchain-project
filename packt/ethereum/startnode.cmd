geth --networkid 4224 --mine --miner.threads 2 --datadir "." --nodiscover --ws --http --http.port "8545" --port "30303" --http.corsdomain "*" --nat "any" --http.api eth,web3,personal,net --unlock 0 --password ./password.sec --allow-insecure-unlock