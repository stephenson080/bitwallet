import ABI from '../../artifacts/contracts/bank.sol/Bank.json'
import web3 from './web3-config'

const bankContract = new web3.eth.Contract(ABI.abi, '0x00a1e43946D2aeAE056E3Bb0C2efE300d947d5b1')

export default bankContract