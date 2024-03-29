import {useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import {useSelector, useDispatch} from 'react-redux';
import {Container, Table, Dimmer, Loader} from 'semantic-ui-react';
import Head from 'next/head';

import DashboardNav, {Balances} from '../../components/DashboardNav';
import SidebarComponent from '../../components/Sidebar';

import web3 from '../../ethereum/web3-config';
import Acct from '../../ethereum/account';
import {getFmtToken, getCRMToken, getQmToken} from '../../ethereum/token';

import {MessageType, Role} from '../../store/types';
import {logout, autoLogin} from '../../store/actions/auth_action';
import {getTransactionsFromDB} from '../../store/actions/user-actions';
import {Store} from '../_app';
import User from '../../models/user';
import Footer from '../../components/Footer';

export enum TransactionType {
  MINT_TOKEN,
  BUY_TOKEN,
  SEND_TOKEN,
  DEPOSIT,
  WITHDRAW,
  TRANSFER,
  CREATE_ACCOUNTS,
  CREATE_ACCOUNT,
}

export default function Transactions(props: any) {
  const [sidebarVisibility, setVisibility] = useState(false);
  const [loading, setLoading] = useState(false)
  const [curAddress, setCurAddress] = useState('');
  const [message, setMsg] = useState<MessageType>();
  const [trxs, setTrxs] = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState(false);
  const user = useSelector<Store, User>((state) => state.auth.user!);
  const [bal, setBal] = useState<Balances[]>([]);

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    getAcct();
    if (user) {
      return;
    }
    const userId = localStorage.getItem('userId');
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

  function getTrxType(type: string) {
    switch (type) {
      case '0':
        return 'Mint Token';
      case '1':
        return 'Buy Token';
      case '2':
        return 'Send Token';
      case '3':
        return 'Deposit';
      case '4':
        return 'Withdraw';
      case '5':
        return 'Transfer';
      case '6':
        return 'Create Accounts';
      case '7':
        return 'Create Account';
      case '8':
        return 'Change User Address'
      default:
        return ''
    }
  }

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setLoading(true)
      dispatch(
        getTransactionsFromDB(userId, async (trxs) => {
          let transact: any[] = [];
          if (trxs.length > 0) {
            for (let trx of trxs) {
              const t = await web3.eth.getTransaction(trx.hash);
              transact.push({
                ...t,
                type: getTrxType(trx.type.toString()),
              });
            }
            setTrxs(transact);
          }
          setLoading(false)
        })
      );
    }
  }, []);
  async function getAcct() {
    const accounts = await web3.eth.getAccounts();
    setCurAddress(accounts[0]);
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

  useEffect(() => {
    getAcctDetails(user)
  }, [user])

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

  function rendertransactions() {
    if (loading){
      return (
        <Table.Row >
          <Table.Cell >Getting your Transactions... Please wait!</Table.Cell>
        </Table.Row>
      );
    }
    if (trxs.length === 0) {
      return (
        <Table.Row >
          <Table.Cell >No Transaction to show</Table.Cell>
        </Table.Row>
      );
    }
    return (
      trxs &&
      trxs.map((trx, i) => (
        <Table.Row key={i}>
          <Table.Cell>{++i}</Table.Cell>
          <Table.Cell>{trx.nonce}</Table.Cell>
          <Table.Cell>
        <p style = {{cursor: 'pointer', color: 'blue', }}
              onClick={() =>
                window.open(`https://rinkeby.etherscan.io/tx/${trx.hash}`)
              }
            >
              {trx.hash}
            </p>
          </Table.Cell>
          <Table.Cell>{trx.from}</Table.Cell>
          <Table.Cell>{trx.to}</Table.Cell>
          <Table.Cell>{trx.gas}</Table.Cell>
          <Table.Cell>
            {web3.utils.fromWei(trx.value, 'ether')} ether
          </Table.Cell>
          <Table.Cell>{trx.type}</Table.Cell>
        </Table.Row>
      ))
    );
  }
  function openProfile(){
    router.replace('/user/profile')
  }
  return (
    <SidebarComponent user={user} visible={sidebarVisibility}>
      <Head>
        <title>Transactions</title>
      </Head>
      <Dimmer active={pageLoading}>
        <Loader size="massive" indeterminate>
          Checking Credentials...
        </Loader>
      </Dimmer>
      <DashboardNav
      openProfile={openProfile}
        bal={bal}
        user={user}
        logout={handleLogout}
        page="Transactions"
        setSidebar={() => setVisibility((state) => !state)}
        sideBarVisibility={sidebarVisibility}
      />
      <Container style={{margin: '110px 0'}}>
        <h1 style={{fontWeight: 'bolder', fontSize: '2rem', margin: '25px 0'}}>
          Transactions
        </h1>
        <Table color="blue" singleLine fixed selectable size = 'large' >
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>S/N</Table.HeaderCell>
              <Table.HeaderCell>Nonce</Table.HeaderCell>
              <Table.HeaderCell>Transaction Hash</Table.HeaderCell>
              <Table.HeaderCell>From</Table.HeaderCell>
              <Table.HeaderCell>To</Table.HeaderCell>
              <Table.HeaderCell>Gas</Table.HeaderCell>
              <Table.HeaderCell>Value</Table.HeaderCell>
              <Table.HeaderCell>Transaction Type</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{rendertransactions()}</Table.Body>
        </Table>
      </Container>
      <Footer show = {false} />
    </SidebarComponent>
  );
}
