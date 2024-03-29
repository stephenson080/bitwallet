import {Modal, Form, Container, Message, Icon, Button} from 'semantic-ui-react';
import {useState} from 'react';

import {MessageType} from '../store/types';
import getToken from '../ethereum/token';
import web3 from '../ethereum/web3-config';

type Props = {
  contractAddress: string;
  userAddress: string;
  showModal: boolean;
  tokenName: string;
  closeModal: () => void;
  pushTransaction: (hash: string) => void;
};

interface SendTokenState {
  recipiant: string;
  userAddress: string;
  amount: string;
}

export default function SendToken(props: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMsg] = useState<MessageType>();
  const [state, setState] = useState<SendTokenState>({
    recipiant: '',
    userAddress: props.userAddress,
    amount: '',
  });

  async function sendToken() {
    try {
      if (!window.ethereum) throw new Error('Please install metamask')
      const networkId = await web3.eth.net.getId()
      if (networkId !== 4) throw new Error('Please connect to rinkeby testnet')
      setSuccess(false);
      setLoading(true);
      setMsg(undefined);
        const tokenContract = getToken(props.contractAddress);
        await tokenContract.methods.sendUserSomeToken(state.recipiant, web3.utils.toWei(state.amount.toString(), 'ether')).send({
          from: props.userAddress
        }).on('transactionHash', (hash : string) => {
          props.pushTransaction(hash)
        })
      setSuccess(true);
      setLoading(false);
      setMsg({
        type: 'SUCCESS',
        content: `You have sent ${props.tokenName} to ${state.recipiant}`,
        header: 'Operation Success',
      });
    } catch (error : any) {
      setMsg({
        type: 'DANGER',
        content: error.message,
        header: 'Something went wrong',
      });
      setLoading(false);
    }
  }
  return (
    <Modal dimmer open={props.showModal}>
      <Modal.Header style={{backgroundColor: 'blue', color: 'white'}}>
        {' '}
        <Icon
          loading={loading}
          name={loading ? 'asterisk' : 'add circle'}
        />{' '}
        {loading
          ? 'Processing Transaction... Please Wait!'
          : `Send ${props.tokenName}`}
      </Modal.Header>
      <Modal.Content>
        <Container>
          <h5 style={{marginLeft: '28px'}}>
            Fill in the Form to send {props.tokenName}
          </h5>
          <Form
            style={{marginTop: '55px', marginLeft: '28px'}}
            loading={loading}
            error={!!message?.content}
          >
            <Form.Input
              disabled
              type="text"
              style={{width: '80%'}}
              label="Your Address"
              size="big"
              placeholder="enter your Address"
              value={props.userAddress}
              onChange={(e) =>
                setState({
                  ...state,
                  userAddress: e.target.value,
                })
              }
            />
            <Form.Input
              required
              type="text"
              style={{width: '100%'}}
              label="Recipiant Address"
              size="big"
              placeholder="Enter recipiant Address"
              value={state.recipiant}
              onChange={(e) =>
                setState({
                  ...state,
                  recipiant: e.target.value,
                })
              }
            />
            <Form.Input
              required
              type="text"
              style={{width: '100%'}}
              label="Amount"
              size="big"
              placeholder={`enter amount of ${props.tokenName} you want to send`}
              value={state.amount}
              onChange={(e) => {
                setState({
                  ...state,
                  amount: e.target.value,
                });
              }}
            />
            <Message
              success={success}
              style={{width: '70%'}}
              error
              content={message?.content}
              header={message?.header}
            />
          </Form>
        </Container>
      </Modal.Content>
      <Modal.Actions>
        <Button
          disabled={loading ? true : false}
          negative
          onClick={props.closeModal}
        >
          Cancel
        </Button>
        <Button disabled={loading ? true : false} positive onClick={sendToken}>
          Send
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
