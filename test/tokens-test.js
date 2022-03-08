const { expect } = require('chai')

// const Token = artifacts.require('Token')
const Token = require('../artifacts/contracts/Token.sol/Token.json')


let accounts, freeMint, qMint, cryptMint




describe("Deployment", function () {


    before(async function () {
        accounts = await web3.eth.getAccounts()
        freeMint = await new web3.eth.Contract(Token.abi).deploy({
            data: Token.bytecode,
            arguments: ['FreeMint', "FMT", '1000', '100']
        }).send({
            from: accounts[0],
            gas: '10000000'
        })
        cryptMint = await new web3.eth.Contract(Token.abi).deploy({
            data: Token.bytecode,
            arguments: ['CryptMint', "CRM", '100', '10']
        }).send({
            from: accounts[0],
            gas: '10000000',
        })
        qMint = await new web3.eth.Contract(Token.abi).deploy({
            data: Token.bytecode,
            arguments: ['QMint', "FMT", '10', '5']
        }).send({
            from: accounts[0],
            gas: '10000000'
        })
    })

    describe("Testing tokens details", function () {
        it("Checking Tokens for Minted quantity", async function () {
            const FMTSupply = await freeMint.methods.totalSupply().call()
            const QMTSupply = await qMint.methods.totalSupply().call()
            const CMTSupply = await cryptMint.methods.totalSupply().call()

            let decimal = 10 ** 18
            expect(parseInt(FMTSupply)).to.equal(100 * decimal)
            expect(parseInt(QMTSupply)).to.equal(5 * decimal)
            expect(parseInt(CMTSupply)).to.equal(10 * decimal)
        })
    })

    describe("Transactions", function () {
        it("Buying Token", async function () {

            await freeMint.methods.buyToken().send({
                from: accounts[1],
                value: web3.utils.toWei('0.00001', 'ether')
            })
            await cryptMint.methods.buyToken().send({
                from: accounts[1],
                value: web3.utils.toWei('0.00001', 'ether')
            })
            await qMint.methods.buyToken().send({
                from: accounts[1],
                value: web3.utils.toWei('0.00001', 'ether')
            })

            console.log(freeMint.methods.getBalance(accounts[1]).call(), cryptMint.methods.getBalance(accounts[1]).call(), qMint.methods.getBalance(accounts[1]).call())

        })

    })
})