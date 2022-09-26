import ABI from '../../artifacts/contracts/bank.sol/Bank.json'
import web3 from './web3-config'

const bankContract = new web3.eth.Contract(ABI.abi as any, '0x3b8b98e2Ec18240f16fF9626Ca446d9b3E1080b7')

export default bankContract