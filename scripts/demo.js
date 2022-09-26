const Web3 = require('web3')
const greaterJson = require('../artifacts/contracts/Greeter.sol/Greeter.json')


const web3 = new Web3("http://localhost:8545")

async function test(){
    const accounts = await web3.eth.getAccounts()
    const contract = await  new web3.eth.Contract(greaterJson.abi).deploy({
        data: greaterJson.bytecode,
        arguments: ['Hello']
    }).send({from: accounts[0], gas: 1500000})
    const newCon = new web3.eth.Contract(greaterJson.abi, contract.options.address)
    await newCon.methods.setGreeting('Hello World').send({from: accounts[0]})
    const greeting = await newCon.methods.greet().call()
    console.log(greeting)
}

test()

