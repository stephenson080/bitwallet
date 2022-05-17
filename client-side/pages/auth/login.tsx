import {useSelector, useDispatch} from 'react-redux';
import {useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import Head from 'next/head';
import {
  Container,
  Grid,
  Image,
  Form,
  Message,
  Button,
  Icon,
  Loader,
  Dimmer,
} from 'semantic-ui-react';

import {Store} from '../_app';
import {MessageType, Role} from '../../store/types';
import ForgotPassword from '../../components/ForgotPassword';
import {Signin, autoLogin} from '../../store/actions/auth_action';

import User from '../../models/user';
import web3 from '../../ethereum/web3-config';

import classes from '../../styles/Home.module.css';

export interface LoginState {
  email: string;
  password: string;
}

export default function Login() {
  const [currentAddress, setCurAddress] = useState('');
  const [showForgotPassModal, setPassModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMsg] = useState<MessageType>();
  const [state, setState] = useState<LoginState>({
    email: '',
    password: '',
  });
  const [pageLoading, setPageLoading] = useState(false);
  const msg = useSelector<Store, MessageType>((state) => state.auth.message);
  const user = useSelector<Store, User>((state) => state.auth.user!);

  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    const userId = localStorage.getItem('userId');

    if (userId) {
      setPageLoading(true);
      dispatch(
        autoLogin(userId, (us) => {
          setPageLoading(false);
          if (us) {
            if (us.role === Role.Admin) {
              router.replace('/admin/dashboard');
            } else {
              router.replace('/user/dashboard');
            }
          }
        })
      );
      getAcct();
    }
  }, []);
  async function getAcct() {
    const accounts = await web3.eth.getAccounts();
    setCurAddress(accounts[0]);
  }
  async function setDependencies() {
    if (user) {
      const accounts = await web3.eth.getAccounts();
      if (user.user_address !== accounts[0]) {
        setMsg({
          type: 'DANGER',
          content: 'Please change your Address to One you use to Register',
          header: 'Warning',
        });
        setSuccess(false);
      } else if (user.acctAddress === undefined && user.role === Role.User) {
        setMsg({
          type: 'DANGER',
          header: 'WARNING',
          content:
            "Sorry, you can't Login cause your account has not been verified yet",
        });
        setSuccess(false);
      } else {
        setSuccess(true)
        setMsg({
          type: msg.type,
          content: msg.content,
          header: msg.header
        })
        localStorage.setItem('userId', user.uid);
        if (user.role === Role.Admin) {
          router.replace('/admin/dashboard');
        } else {
          router.replace('/user/dashboard');
        }
      }
    }
  }
  useEffect(() => {
    setDependencies();
  }, [msg]);

  function loginUser() {
    setLoading(true);
    setSuccess(false);
    setMsg(undefined);
    dispatch(
      Signin(state, (m, userAdd) => {
        setLoading(false);
      })
    );
  }
  useEffect(() => {
    setMsg(undefined);
  }, []);
  return (
    <div style={{backgroundColor: 'whitesmoke'}}>
      <Head>
        <title>BITWallet | Login</title>
      </Head>
      <Dimmer active={pageLoading}>
        <Loader size="massive" indeterminate>
          Trying to Login...
        </Loader>
      </Dimmer>
      <ForgotPassword
        msg={msg}
        showModal={showForgotPassModal}
        closeModal={() => setPassModal(false)}
      />
      <div className={classes.main}>
        <Container>
          <Grid>
            <Grid.Row>
              <Grid.Column
                verticalAlign="middle"
                largeScreen="eight"
                mobile="16"
              >
                <h1 style={{marginBottom: '15px'}}>Login to Your BITWallet</h1>
              </Grid.Column>
              <Grid.Column largeScreen="eight" mobile="16">
                <div
                  style={{
                    backgroundColor: 'white',
                    padding: '35px',
                    borderTopRightRadius: '25px',
                    borderBottomLeftRadius: '25px',
                  }}
                >
                  <p onClick={() => router.replace('/')}>
                    <Icon size="large" link name="arrow left" />
                  </p>
                  <Image
                    centered
                    src="/images/login-image.png"
                    width={100}
                    height={100}
                  />
                  <Form
                    style={{marginTop: '30px'}}
                    error={!!message?.content}
                    size="large"
                  >
                    <Form.Input
                      type="email"
                      style={{width: '100%', margin: '18px 0'}}
                      label="Email"
                      size="big"
                      placeholder="enter your email"
                      value={state.email}
                      onChange={(e) =>
                        setState({
                          ...state,
                          email: e.target.value,
                        })
                      }
                    />

                    <Form.Input
                      type="password"
                      style={{width: '100%', margin: '18px 0'}}
                      label="Password"
                      size="big"
                      placeholder="enter your password"
                      value={state.password}
                      onChange={(e) =>
                        setState({
                          ...state,
                          password: e.target.value,
                        })
                      }
                    />
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <p
                        style={{fontSize: '1.2rem'}}
                        onClick={() => setPassModal(true)}
                      >
                        Forget Password
                      </p>
                      <Button
                        onClick={loginUser}
                        loading={loading}
                        primary
                        animated
                      >
                        <Button.Content visible>Login</Button.Content>
                        <Button.Content hidden>
                          <Icon name="sign-in" />
                        </Button.Content>
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
                  <p
                    style={{
                      fontSize: '1.2rem',
                      textAlign: 'center',
                      marginTop: '32px',
                      marginBottom: '-15px',
                    }}
                  >
                    Don't have an Account?{' '}
                    <strong
                      style={{cursor: 'pointer', color: 'orange'}}
                      onClick={() => router.replace('/auth/sign-up')}
                    >
                      Create new Account
                    </strong>
                  </p>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    </div>
  );
}