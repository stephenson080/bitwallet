import ABI from '../../artifacts/contracts/bank.sol/Bank.json'
import web3 from './web3-config'

const bankContract = new web3.eth.Contract(ABI.abi as any, '0x972227F818Ec5B4199dD96A923394Ba4053Ed43a')

export default bankContract