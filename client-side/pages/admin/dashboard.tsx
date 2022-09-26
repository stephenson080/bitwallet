import {Fragment, useState, useEffect} from 'react';
import {
  Container,
  Table,
  Button,
  Message,
  Dimmer,
  Loader,
} from 'semantic-ui-react';
import {useSelector, useDispatch} from 'react-redux';
import Head from 'next/head';
import {useRouter} from 'next/router';


import {Token} from '../../components/Token';
import DashboardNav from '../../components/DashboardNav';
import SidebarComponent from '../../components/Sidebar';
import Tokens, {TokenType} from '../../components/Token';
import MintToken from '../../components/MintToken';

import web3 from '../../ethereum/web3-config';
import bankContract from '../../ethereum/bankInstance';
import getTokens from '../../ethereum/tokens';


import {autoLogin, logout} from '../../store/actions/auth_action';
import {Store} from '../_app';
import User from '../../models/user';
import {
  addTransactionToDB
} from '../../store/actions/user-actions';
import {TransactionType} from './transactions';
import {MessageType, Role} from '../../store/types';
import Footer from '../../components/Footer';


export interface Customer {
  key: number;
  created: boolean;
  username: string;
  userAddress: string;
  userAcct: string | undefined;
}


type Props = {
  tokens: Token[];
};
interface MintState {
  showModal: boolean;
  showBuyTokenModal: boolean;
  curTokenName: string;
  curUserAddress: string;
  curContractAddress: string;
}

export async function getStaticProps() {
  const tokens = await getTokens(undefined);
  return {
    props: {
      tokens: tokens,
    },
  };
}

export default function AdminDashboard(props: Props) {
  const [sidebarVisble, setSidebar] = useState(false);
  const [curAddress, setCurAddress] = useState('');
  const [message, setMsg] = useState<MessageType>();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [mintState, setMintState] = useState<MintState>({
    showModal: false,
    curContractAddress: '',
    curTokenName: '',
    curUserAddress: '',
    showBuyTokenModal: false,
  });
  const [pageLoading, setPageLoading] = useState(false);

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
            if (us.role !== Role.Admin) {
              router.replace('/user/dashboard');
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

  async function getAcct() {
    try {
      const accounts = await web3.eth.getAccounts();
      setCurAddress(accounts[0]);
    } catch (error : any) {
      setMsg({
        type: 'DANGER',
        content: error.message,
        header: 'Something went wrong'
      })
    }
  }

  function getTokenDetails(token: Token, action: TransactionType) {
    if (action === TransactionType.MINT_TOKEN) {
      setMintState({
        ...mintState,
        showBuyTokenModal: true,
        curContractAddress: token.address,
        curTokenName: token.name,
        curUserAddress: curAddress,
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

  function pushTransactions(hash: string) {
    dispatch(addTransactionToDB(user.uid, hash, TransactionType.MINT_TOKEN));
  }
  
  return (
    <Fragment>
      <Head>
        <title>Admin Dashboard</title>
      </Head>
      <SidebarComponent user={user} visible={sidebarVisble}>
        <Dimmer active={pageLoading}>
          <Loader size="massive" indeterminate>
            Please Wait...
          </Loader>
        </Dimmer>
        <MintToken
          pushTransaction={pushTransactions}
          tokenName={mintState.curTokenName}
          userAddress={mintState.curUserAddress}
          contractAddress={mintState.curContractAddress}
          closeModal={() =>
            setMintState({
              ...mintState,
              showBuyTokenModal: false,
            })
          }
          showModal={mintState.showBuyTokenModal}
        />
        <DashboardNav
          bal={undefined}
          user={user}
          logout={handleLogout}
          page="Dashboard"
          sideBarVisibility={sidebarVisble}
          setSidebar={() => setSidebar((visible) => !visible)}
        />
        <div>
          <Container>

            

            <h1
              style={{margin: '20px 0', fontWeight: 'bolder', fontSize: '2rem'}}
            >
              Tokens
            </h1>
            {props.tokens && (
              <Tokens
                tokenType={TokenType.ADMIN}
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
