import ABI from '../../artifacts/contracts/bank.sol/Bank.json'
import web3 from './web3-config'

const bankContract = new web3.eth.Contract(ABI.abi as any, process.env.NEXT_PUBLIC_BANK_ADDRESS)

export default bankContract