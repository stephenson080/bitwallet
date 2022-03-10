import ABI from '../../artifacts/contracts/Token.sol/Token.json'
import web3 from './web3-config'

export function getFmtToken(){
    return new web3.eth.Contract(ABI.abi, '0x9f47D6EC88064465E83494f08faf7aae18a3eE3d')
}

export function getCRMToken(){
    return new web3.eth.Contract(ABI.abi, '0x426F64AA5DD4A99C08048bBA50c8A18d3F4290c5')
}

export function getQmToken(){
    return new web3.eth.Contract(ABI.abi, '0xD00521DcF2a03baAF771399CB1cFE8be0F3416db')
}

export default function getToken(address) {
    return new web3.eth.Contract(ABI.abi, address)
}