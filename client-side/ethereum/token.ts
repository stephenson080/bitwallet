import ABI from '../../artifacts/contracts/Token.sol/Token.json'
import web3 from './web3-config'

export function getFmtToken(){
    return new web3.eth.Contract(ABI.abi as any, process.env.NEXT_PUBLIC_FMTTOKEN)
}

export function getCRMToken(){
    return new web3.eth.Contract(ABI.abi as any, process.env.NEXT_PUBLIC_CMTTOKEN)
}

export function getQmToken(){
    return new web3.eth.Contract(ABI.abi as any, process.env.NEXT_PUBLIC_QMTTOKEN)
}

export default function getToken(address : string) {
    return new web3.eth.Contract(ABI.abi as any, address)
}