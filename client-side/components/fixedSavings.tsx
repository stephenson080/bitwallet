import {Form, Message, Button } from 'semantic-ui-react'
import {useState} from 'react'
import {makeDeposit } from '../ethereum/xend.finance'

import {MessageType} from '../store/types';
export default function FixedSave(){
    const [amount, setAmount] = useState('');
    const [lockPeriod, setLockPeriod] = useState(0);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [message, setMsg] = useState<MessageType>();


    async function depositFixed(){
        try{
            setMsg(undefined);
            setSuccess(false);
            console.log(lockPeriod)
            const {status, data} = await makeDeposit(amount, true, lockPeriod, setLoading);
            console.log(status, data);
            if (!status){
              throw new Error(data);
            }

            
            setSuccess(true);
        
            setMsg({
                type: 'SUCCESS',
                header: 'Operation Success',
                content: `You have successfully saved ${amount}`
            })
        }catch(error : any){
            setLoading(false);
            setMsg({
                type: 'DANGER',
                header: 'Something went wrong',
                content: error.message,
            })
        }
    }

    return (
        <Form
            style={{margin: '40px 20px'}}
            loading={loading}
            size = 'big'
            error={!!message?.content}
          >
            <Form.Input
              required
              type="text"
              style={{width: '80%'}}
              label="Amount (BUSD)"
              size="big"
              placeholder="Enter amount of BUSD to deposit"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
            />
            <Form.Input
              required
              type="number"
              style={{width: '80%'}}
              label="Lock Period"
              size="big"
              placeholder="Enter number of period to lock funds"
              value={lockPeriod}
              onChange={(e) =>
                setLockPeriod(parseInt(e.target.value))
              }
            />
            <Button onClick={depositFixed} color='blue' loading = {loading} >
                Deposit
            </Button>
            <Message
              success={success}
              style={{width: '70%'}}
              error
              content={message?.content}
              header={message?.header}
            />
          </Form>
    )
}