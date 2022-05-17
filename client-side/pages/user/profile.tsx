import Head from 'next/head';
import {useState, Fragment, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  Form,
  Message,
  Button,
  Image,
  Dimmer,
  Loader,
} from 'semantic-ui-react';

import SidebarComponent from '../../components/Sidebar';
import DashboardNav, {Balances} from '../../components/DashboardNav';
import {
  logout,
  autoLogin,
  setuserAddress,
} from '../../store/actions/auth_action';

import {Store} from '../_app';
import User from '../../models/user';
import {useRouter} from 'next/router';
import {MessageType, Role} from '../../store/types';


import Acct from '../../ethereum/account';
import web3 from '../../ethereum/web3-config';
import {addTransactionToDB} from '../../store/actions/user-actions';
import {TransactionType} from '../admin/transactions';
import {getCRMToken, getFmtToken, getQmToken} from '../../ethereum/token';
import Footer from '../../components/Footer';

interface ProfileState {
  user_address: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const [sidebarVisble, setSidebar] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMsg] = useState<MessageType>();

  const user = useSelector<Store, User>((state) => state.auth.user!);

  const [state, setState] = useState<ProfileState>({
    user_address: user ? user.user_address : '',
    newPassword: '',
    confirmPassword: '',
  });
  const [bal, setBal] = useState<Balances[]>([]);

  const msg = useSelector<Store, MessageType>((state) => state.auth.message);

  const router = useRouter();

  const dispatch = useDispatch();

  

  useEffect(() => {
    if (msg.type === 'SUCCESS') {
      setSuccess(true);
    }
    setMsg({
      type: msg.type,
      content: msg.content,
      header: msg.header,
    });
  }, [msg]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (user) {
      return;
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
    getAcctDetails(user);
  }, [user]);

  useEffect(() => {
    
    setMsg(undefined);
  }, []);

  async function getAcctDetails(user: User) {
    try {
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

  async function update() {
    try {
      const accounts = await web3.eth.getAccounts()
      setLoading(true);
      setSuccess(false);
      setMsg(undefined);
      await Acct(user.acctAddress)
        .methods.setUserAddress(state.user_address)
        .send({
          from: accounts[0],
        })
        .on('transactionHash', (hash: string) => {
          dispatch(
            addTransactionToDB(
              user.uid,
              hash,
              TransactionType.CHANGE_USERADDRESS
            )
          );
        });
      const updatedUser = new User(
        user.uid,
        user.email,
        user.emailVerified,
        state.user_address,
        user.username,
        user.role,
        user.acctAddress
      );
      dispatch(setuserAddress(updatedUser, (m ) => {
        setLoading(false);
      }));
    } catch (error : any) {
      setLoading(false)
      setMsg({
        type: 'DANGER',
        content: `${error.message}`,
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
  function openProfile() {
    router.replace('/user/profile');
  }
  return (
    <Fragment>
      <Head>
        <title>Profile</title>
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
          page="My Profile"
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
          <Image centered src="/images/user.png" width={100} height={100} />
          <Form
            style={{marginTop: '30px'}}
            error={!!message?.content}
            size="large"
          >
            <Form.Input
              type="email"
              disabled
              style={{width: '100%', margin: '18px 0'}}
              label="Email"
              size="big"
              value={user ? user.email : ''}
            />
            <Form.Input
              type="text"
              disabled
              style={{width: '100%', margin: '18px 0'}}
              label="Username"
              size="big"
              value={user ? user.username : ''}
            />
            <Form.Input
              type="text"
              disabled
              style={{width: '100%', margin: '18px 0'}}
              label="Account Address"
              size="big"
              value={user ? user.acctAddress : ''}
            />
            <Form.Input
              type="text"
              style={{width: '100%', margin: '18px 0'}}
              label="User Address"
              size="big"
              placeholder="enter your Address"
              value={state.user_address}
              onChange={(e) =>
                setState({
                  ...state,
                  user_address: e.target.value,
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
              <Button onClick={update} loading={loading} primary>
                Update Profile
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
