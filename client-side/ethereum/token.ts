import ABI from '../../artifacts/contracts/Token.sol/Token.json'
import web3 from './web3-config'

export function getFmtToken(){
    return new web3.eth.Contract(ABI.abi as any, '0x8C9D4E16be814AdEE7E913700a34018d2Aee4568')
}

export function getCRMToken(){
    return new web3.eth.Contract(ABI.abi as any, '0xffc19F1d934c5F06BCc82757F5D2889142d1e421')
}

export function getQmToken(){
    return new web3.eth.Contract(ABI.abi as any, '0xb30671B61B29504D2D2ADA7aD2803210Aa658796')
}

export default function getToken(address : string) {
    return new web3.eth.Contract(ABI.abi as any, address)
}