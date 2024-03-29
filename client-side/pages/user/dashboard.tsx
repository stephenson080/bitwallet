import {Fragment, useState, useEffect} from 'react';
import {
  Container,
  Dimmer,
  Loader,
} from 'semantic-ui-react';
import {useSelector, useDispatch} from 'react-redux';
import {useRouter} from 'next/router';

import SidebarComponent from '../../components/Sidebar';
import Tokens, {TokenType, Token} from '../../components/Token';
import DashboardNav, {Balances} from '../../components/DashboardNav';
import BuyToken from '../../components/BuyToken';
import SendToken from '../../components/SendToken';
import {Tokendetail} from '../../components/TokenBalanceCard';
import DashboardContainer from '../../components/dashboardcontainer'

import web3 from '../../ethereum/web3-config';
import Acct from '../../ethereum/account';
import {getFmtToken, getCRMToken, getQmToken} from '../../ethereum/token';
import getTokens from '../../ethereum/tokens';
import {MessageType, Role} from '../../store/types';

import {Store} from '../_app';
import User from '../../models/user';
import {autoLogin, logout} from '../../store/actions/auth_action';
import {addTransactionToDB} from '../../store/actions/user-actions';
import {TransactionType} from '../admin/transactions';

import Head from 'next/head';
import Footer from '../../components/Footer';

export interface Customer {
  created: boolean;
  username: string;
  userAddress: string;
  userAcct: string | undefined;
}

type Props = {
  tokens: Token[];
};
interface TokenState {
  showModal: boolean;
  showBuyTokenModal: boolean;
  showSendToken: boolean;
  curTokenName: string;
  curUserAddress: string;
  curContractAddress: string;
  type: TransactionType;
}

export async function getStaticProps() {
  const tokens = await getTokens(undefined);
  return {
    props: {
      tokens: tokens,
    },
  };
}

export default function Dashboard(props: Props) {
  const [sidebarVisble, setSidebar] = useState(false);
  const [curAddress, setCurAddress] = useState('');
  const [message, setMsg] = useState<MessageType>();
  const [tokenState, setTokenState] = useState<TokenState>({
    showModal: false,
    curContractAddress: '',
    curTokenName: '',
    curUserAddress: '',
    showBuyTokenModal: false,
    type: -1,
    showSendToken: false,
  });
  const [acctDetails, setAcctDetails] = useState<Tokendetail[]>([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [bal, setBal] = useState<Balances[]>([]);
  //   const [icon, setIcon] = useState('bars')

  const dispatch = useDispatch();

  const user = useSelector<Store, User>((state) => state.auth.user!);
  const router = useRouter();
  useEffect(() => {
    getAcct();
    if (user){
      return
    }
    const userId = localStorage.getItem('userId');
    if (userId) {
      setPageLoading(true);
      dispatch(
        autoLogin(userId, (us) => {
          setPageLoading(false);
          if(us) {
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
    getAcctDetails(user);
  }, [user]);

  async function getAcct() {
    const accounts = await web3.eth.getAccounts();
    setCurAddress(accounts[0]);
  }

  function getTokenDetails(token: Token, type: TransactionType) {
    if (type == TransactionType.BUY_TOKEN) {
      setTokenState({
        ...tokenState,
        showBuyTokenModal: true,
        curContractAddress: token.address,
        curTokenName: token.name,
        curUserAddress: curAddress,
        type: type,
      });
    } else {
      setTokenState({
        ...tokenState,
        showSendToken: true,
        curContractAddress: token.address,
        curTokenName: token.name,
        curUserAddress: curAddress,
        type: type,
      });
    }
  }

  async function getAcctDetails(user: User) {
    try {
      if (!window.ethereum) throw new Error('Please install metamask')
      const networkId = await web3.eth.net.getId()
      if (networkId !== 4) throw new Error('Please connect to rinkeby testnet')
      const accounts = await web3.eth.getAccounts();
      if (!user) {
      } else {
        setPageLoading(true);
        const acctInstance = Acct(user.acctAddress);
        const summary = await acctInstance.methods.getAccountDetails().call({
          from: accounts[0],
        });
      console.log('okau1')

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
        
      console.log('okay2')


        const tokenBalences : Tokendetail[] = [
          {
            name: 'Main Account',
            color: '#0202fabe',
            bal: `${web3.utils.fromWei(summary[2], 'ether')} ether`,
            description: 'Etheruem Account',
            imageUrl: 'ethereum.png'
          },
          {
            name: 'Token',
            color: '#05c705e8',
            bal: `${web3.utils.fromWei(fmtbalance)} unit(s)`,
            description: 'Free Mint',
            imageUrl: 'fmt.png'
          },
          {
            name: 'Token',
            color: 'orange',
            bal: `${web3.utils.fromWei(crmbalance)} unit(s)`,
            description: 'Crypt Mint',
            imageUrl: 'crm.png'
          },
          {
            name: 'Token',
            color: 'red',
            bal: `${web3.utils.fromWei(qmbalance)} unit(s)`,
            description: 'QMint',
            imageUrl: 'qmt.png'
          }
        ]
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

        console.log(bal)

        setPageLoading(false);
        setBal(bal);
        setAcctDetails(tokenBalences);
      }
    } catch (error : any) {
      setMsg({
        type: 'DANGER',
        header: 'Something went wrong',
        content: error.message,
      });
      setPageLoading(false);
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

  function pushTransactions(hash: string) {
    dispatch(addTransactionToDB(user.uid, hash, tokenState.type));
  }

  function openProfile(){
    router.replace('/user/profile')
  }

  return (
    <Fragment>
      <SidebarComponent user={user} visible={sidebarVisble}>
        <Head>
          <title>Dashboard</title>
        </Head>
        <Dimmer active={pageLoading}>
          <Loader size="massive" indeterminate>
            Please Wait...
          </Loader>
        </Dimmer>
        <SendToken
          closeModal={() =>
            setTokenState({
              ...tokenState,
              showSendToken: false,
            })
          }
          pushTransaction={pushTransactions}
          tokenName={tokenState.curTokenName}
          contractAddress={tokenState.curContractAddress}
          userAddress={tokenState.curUserAddress}
          showModal={tokenState.showSendToken}
        />
        <BuyToken
          closeModal={() =>
            setTokenState({
              ...tokenState,
              showBuyTokenModal: false,
            })
          }
          pushTransaction={pushTransactions}
          tokenName={tokenState.curTokenName}
          contractAddress={tokenState.curContractAddress}
          userAddress={tokenState.curUserAddress}
          showModal={tokenState.showBuyTokenModal}
        />
        <DashboardNav
        openProfile= {openProfile}
          bal={bal}
          user={user}
          logout={handleLogout}
          page="Dashboard"
          sideBarVisibility={sidebarVisble}
          setSidebar={() => setSidebar((visible) => !visible)}
        />
        <div style ={{margin: '20px 0'}}>
          <Container>
            <h1
              style={{margin: '20px 0', fontWeight: 'bolder', fontSize: '2rem'}}
            >
              Your Account
            </h1>
            {acctDetails.length > 0 && <DashboardContainer items={acctDetails} />}
            {/* {acctDetails.length > 0 && <AcctDetails items={acctDetails} />} */}
            <h1
              style={{margin: '20px 0', fontWeight: 'bolder', fontSize: '2rem'}}
            >
              Tokens
            </h1>
            {props.tokens && (
              <Tokens
                tokenType={TokenType.USER}
                getTokenDetails={getTokenDetails}
                tokens={props.tokens}
              />
            )}
          </Container>
        </div>
        <Footer show = {false} />
      </SidebarComponent>
    </Fragment>
  );
}
