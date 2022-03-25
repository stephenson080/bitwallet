import ABI from '../../artifacts/contracts/Token.sol/Token.json'
import web3 from './web3-config'

export function getFmtToken(){
    return new web3.eth.Contract(ABI.abi, '0xE46eDE392D5db80Ff5e89f1A57D96e737756ecda')
}

export function getCRMToken(){
    return new web3.eth.Contract(ABI.abi, '0x0323B35DfE7f579a61774EAEc1443a221E26958A')
}

export function getQmToken(){
    return new web3.eth.Contract(ABI.abi, '0xE7cbEb30D6DcE56836e6330FBA73D0450f472d65')
}

export default function getToken(address) {
    return new web3.eth.Contract(ABI.abi, address)
}