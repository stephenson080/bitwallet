import ABI from '../../artifacts/contracts/bank.sol/Bank.json'
import web3 from './web3-config'

const bankContract = new web3.eth.Contract(ABI.abi, '0xdC9aBb03f857dB1a883950FbECB4c59eDe23bBc1')

export default bankContract