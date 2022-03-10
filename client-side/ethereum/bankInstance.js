import ABI from '../../artifacts/contracts/bank.sol/Bank.json'
import web3 from './web3-config'

const bankContract = new web3.eth.Contract(ABI.abi, '0x722C77F07Dc094236AeCD5543b65213f6Ca52a10')

export default bankContract