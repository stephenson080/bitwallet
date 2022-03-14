# Bitwallet

Bitwallet is DApp built on the Etheruem Rinkeby test network, 

to compile the smart contracts run:

```shell
npx hardhat compile
```

to run the test scripts, run:

```shell

yarn test

```

to deploy the contracts on local and rinkeby test networks respectively, run:

```shell

// on local network
yarn dep:local

// on rinkeby network
yarn dep:rinkeby

```

to start the frontend,  run the following commands

```shell

cd client-side
yarn add

// then,

yarn dev // to start the front-end

```
