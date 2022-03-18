const { expect } = require('chai')

// const Token = artifacts.require('Token')
const Token = require('../artifacts/contracts/Token.sol/Token.json')


let accounts, freeMint, qMint, cryptMint




describe("Deployment", function () {


    before(async function () {
        console.log('Deploying Tokens')
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
            console.log('Buying Tokens...')
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

            console.log(`Getting new balance for ${accounts[1]} ...`)


            const freeMintBalFor1 = parseInt(await freeMint.methods.getBalance(accounts[1]).call())
            const crmBalanceFor1 = parseInt(await cryptMint.methods.getBalance(accounts[1]).call())
            const qmtBalanceFor1 = parseInt(await qMint.methods.getBalance(accounts[1]).call())

           console.log(`Checking ${accounts[1]} balance...`)

            expect(freeMintBalFor1).to.equal(1 * (10 ** 16))
            expect(crmBalanceFor1).to.equal(1 * (10 ** 15))
            expect(qmtBalanceFor1).to.equal(1 * (10 ** 14))

            console.log(`Getting total supply...`)

            const FMTSupply = parseInt(await freeMint.methods.totalSupply().call())
            const QMTSupply = parseInt(await qMint.methods.totalSupply().call())
            const CMTSupply = parseInt(await cryptMint.methods.totalSupply().call())

            
            console.log(`Getting balance for ${accounts[0]}...`)
            const freeMintBalFor0 = parseInt(await freeMint.methods.getBalance(accounts[0]).call())
            const crmBalanceFor0 = parseInt(await cryptMint.methods.getBalance(accounts[0]).call())
            const qmtBalanceFor0 = parseInt(await qMint.methods.getBalance(accounts[0]).call())

            console.log(`Checking token amount of ${accounts[0]} is equal to the totalSupply minus amount of token bought by ${accounts[1]}...`)

            expect(freeMintBalFor0).to.equal(FMTSupply - freeMintBalFor1)
            expect(qmtBalanceFor0).to.equal(QMTSupply - qmtBalanceFor1)
            expect(crmBalanceFor0).to.equal(CMTSupply - crmBalanceFor1)

        })

        it("Sending Tokens", async function() {
            console.log(`${accounts[1]} sending tokens to ${accounts[2]}...`)

            let fmtAmount = 50000
            let cmtAmount = 3000
            let qmtAmount = 200


            console.log(`Getting  balance for ${accounts[1]}...`)

            const prevFreeMintBalFor1 = parseInt(await freeMint.methods.getBalance(accounts[1]).call())
            const prevCrmBalanceFor1 = parseInt(await cryptMint.methods.getBalance(accounts[1]).call())
            const prevQmtBalanceFor1 = parseInt(await qMint.methods.getBalance(accounts[1]).call())

            await freeMint.methods.sendUserSomeToken(accounts[2], fmtAmount).send({from: accounts[1]})
            await cryptMint.methods.sendUserSomeToken(accounts[2], cmtAmount).send({from: accounts[1]})
            await qMint.methods.sendUserSomeToken(accounts[2], qmtAmount).send({from: accounts[1]})

            console.log(`Getting balance for ${accounts[2]}...`)
            const freeMintBalFor2 = parseInt(await freeMint.methods.getBalance(accounts[2]).call())
            const crmBalanceFor2 = parseInt(await cryptMint.methods.getBalance(accounts[2]).call())
            const qmtBalanceFor2 = parseInt(await qMint.methods.getBalance(accounts[2]).call())

            console.log(`Getting new balance for ${accounts[1]}...`)

            const freeMintBalFor1 = parseInt(await freeMint.methods.getBalance(accounts[1]).call())
            const crmBalanceFor1 = parseInt(await cryptMint.methods.getBalance(accounts[1]).call())
            const qmtBalanceFor1 = parseInt(await qMint.methods.getBalance(accounts[1]).call())

            console.log(`checking ${accounts[1]} new balance is less than previous balance minus amount sent to ${accounts[2]}...`)

            expect(freeMintBalFor1).to.equal(prevFreeMintBalFor1 - freeMintBalFor2)
            expect(crmBalanceFor1).to.equal(prevCrmBalanceFor1 - crmBalanceFor2)
            expect(qmtBalanceFor1).to.equal(prevQmtBalanceFor1 - qmtBalanceFor2)
        })

        

    })
})