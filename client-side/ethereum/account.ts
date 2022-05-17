import Account from '../../artifacts/contracts/account.sol/Account.json'
import web3 from './web3-config'

export default function Acct(address : string | undefined){
    return new web3.eth.Contract(Account.abi as any, address)
}