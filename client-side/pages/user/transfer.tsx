import {useSelector, useDispatch} from 'react-redux';
import {useState, Fragment, useEffect} from 'react';
import Head from 'next/head';
import {
  Form,
  Message,
  Button,
  Image,
  Dimmer,
  Loader,
} from 'semantic-ui-react';
import {useRouter} from 'next/router';

import SidebarComponent from '../../components/Sidebar';
import DashboardNav, {Balances} from '../../components/DashboardNav';

import Acct from '../../ethereum/account';
import web3 from '../../ethereum/web3-config';
import {getFmtToken, getCRMToken, getQmToken} from '../../ethereum/token';

import {logout, autoLogin} from '../../store/actions/auth_action';
import {Store} from '../_app';
import User from '../../models/user';
import {MessageType, Role} from '../../store/types';
import {addTransactionToDB} from '../../store/actions/user-actions';
import {TransactionType} from '../admin/transactions';
import Footer from '../../components/Footer';

interface TransferState {
  amount: string;
  receiver: string;
}

export default function WithdrawPage() {
  const [sidebarVisble, setSidebar] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMsg] = useState<MessageType>();
  const [state, setState] = useState<TransferState>({
    amount: '',
    receiver: '',
  });
  const [bal, setBal] = useState<Balances[]>([]);

  const user = useSelector<Store, User>((state) => state.auth.user!);

  const router = useRouter();

  const dispatch = useDispatch();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (user){
      return
    }
    if (userId) {
      setPageLoading(true);
      dispatch(
        autoLogin(userId, (us) => {
          setPageLoading(false);
          if (us) {
            if (us.role === Role.Admin) {
              router.replace('/admin/dashboard');
            }
          } else {
            router.replace('/auth/login');
          }
        })
      );
    } else {
      router.replace('/auth/login');
    }
  }, []);

  useEffect(() => {
    getAcctDetails(user)
  }, [user])

  async function transfer() {
    try {
      if (!window.ethereum) throw new Error('Please install metamask')
      const networkId = await web3.eth.net.getId()
      if (networkId !== 4) throw new Error('Please connect to rinkeby testnet')
      setLoading(true);
      setSuccess(false);
      setMsg(undefined);
      await Acct(user.acctAddress)
        .methods.transferFunds(
          web3.utils.toWei(state.amount.toString()),
          state.receiver
        )
        .send({
          from: user.user_address,
        })
        .on('transactionHash', (hash: string) => {
          dispatch(
            addTransactionToDB(user.uid, hash, TransactionType.TRANSFER)
          );
        });

      setLoading(false);
      setSuccess(true);
      setMsg({
        type: 'SUCCESS',
        content: `You have transferred ${state.amount} to ${state.receiver}`,
        header: 'Operation Success',
      });
    } catch (error : any) {
      setMsg({
        type: 'DANGER',
        content: error.message,
        header: 'Something went wrong',
      });
    }
  }

  function handleLogout() {
    setPageLoading(true);
    dispatch(
      logout((m) => {
        setPageLoading(false);
        if (m === 'SUCCESS') {
          localStorage.clear();
          router.replace('/auth/login');
        }
      })
    );
  }

  async function getAcctDetails(user: User) {
    try {
      if (!window.ethereum) throw new Error('Please install metamask')
      const networkId = await web3.eth.net.getId()
      if (networkId !== 4) throw new Error('Please connect to rinkeby testnet')
      const accounts = await web3.eth.getAccounts();
      if (!user) {
      } else {
        const acctInstance = Acct(user.acctAddress);
        const summary = await acctInstance.methods.getAccountDetails().call({
          from: accounts[0],
        });

        const fmtToken = getFmtToken();
        const crmToken = getCRMToken();
        const qmtToken = getQmToken();
        const fmtbalance = await fmtToken.methods
          .getBalance(user.user_address)
          .call();
        const crmbalance = await crmToken.methods
          .getBalance(user.user_address)
          .call();
        const qmbalance = await qmtToken.methods
          .getBalance(user.user_address)
          .call();

        const bal: Balances[] = [
          {
            key: '0',
            image: {avatar: true, src: '/images/ethereum.png'},
            values: `${web3.utils.fromWei(summary[2], 'ether')}`,
            text: `Main Account: ${web3.utils.fromWei(summary[2], 'ether')}`,
          },
          {
            key: '1',
            image: {avatar: true, src: '/images/fmt.png'},
            values: `${web3.utils.fromWei(fmtbalance)}`,
            text: `FreeMint Token: ${web3.utils.fromWei(fmtbalance)}`,
          },
          {
            key: '2',
            image: {avatar: true, src: '/images/crm.png'},
            values: `${web3.utils.fromWei(crmbalance)}`,
            text: `CryptMint Token: ${web3.utils.fromWei(crmbalance)}`,
          },
          {
            key: '3',
            image: {avatar: true, src: '/images/qmt.png'},
            values: `${web3.utils.fromWei(qmbalance)}`,
            text: `QMint Token: ${web3.utils.fromWei(qmbalance)}`,
          },
        ];

        setBal(bal);
      }
    } catch (error : any) {
      setMsg({
        type: 'DANGER',
        header: 'Something went wrong',
        content: error.message,
      });
    }
  }
  function openProfile(){
    router.replace('/user/profile')
  }
  return (
    <Fragment>
      <Head>
        <title>Transfer</title>
      </Head>
      <Dimmer active={pageLoading}>
        <Loader size="massive" indeterminate>
          Checking Credentials...
        </Loader>
      </Dimmer>
      <SidebarComponent user={user} visible={sidebarVisble}>
        <DashboardNav
        openProfile={openProfile}
          bal={bal}
          page="Transfer Ether"
          setSidebar={() => setSidebar((state) => !state)}
          sideBarVisibility={sidebarVisble}
          user={user}
          logout={handleLogout}
        />
        <div
          style={{
            backgroundColor: 'white',
            padding: '35px',
            borderTopRightRadius: '25px',
            borderBottomLeftRadius: '25px',
            margin: '45px auto',
            width: '80%',
            maxWidth: '45rem',
          }}
        >
          <Image centered src="/images/with.png" width={100} height={100} />
          <Form
            style={{marginTop: '30px'}}
            error={!!message?.content}
            size="large"
          >
            <Form.Input
              type="text"
              required
              style={{width: '100%', margin: '18px 0'}}
              label="Receiver"
              size="big"
              placeholder="enter user address you want to send to"
              value={state.receiver}
              onChange={(e) =>
                setState({
                  ...state,
                  receiver: e.target.value,
                })
              }
            />
            <Form.Input
              type="text"
              required
              style={{width: '100%', margin: '18px 0'}}
              label="Amount"
              size="big"
              placeholder="enter amount you want to send"
              value={state.amount}
              onChange={(e) =>
                setState({
                  ...state,
                  amount: e.target.value,
                })
              }
            />

            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              <Button onClick={transfer} loading={loading} primary>
                Transfer
              </Button>
            </div>

            <Message
              success={success}
              style={{width: '70%'}}
              error
              content={message?.content}
              header={message?.header}
            />
          </Form>
        </div>
        <Footer show = {false} />
      </SidebarComponent>
    </Fragment>
  );
}
