import {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useRouter} from 'next/router';
import {Container, Table, Dimmer, Loader} from 'semantic-ui-react';
import Head from 'next/head';

import SidebarComponent from '../../components/Sidebar';
import DashboardNav from '../../components/DashboardNav';

import web3 from '../../ethereum/web3-config';
import bankContract from '../../ethereum/bankInstance';
import {MessageType, Role} from '../../store/types';

import {logout, autoLogin} from '../../store/actions/auth_action';
import User from '../../models/user';
import {Customer} from './dashboard';
import {Store} from '../_app';
import Footer from '../../components/Footer';

export default function Customers(props: any) {
  const [sidebarVisibility, setVisibility] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [curAddress, setCurAddress] = useState('');
  // const [message, setMsg] = useState<MessageType>();
  const [pageLoading, setPageLoading] = useState(false);
  const user = useSelector<Store, User>((state) => state.auth.user!);
  const dispatch = useDispatch();
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
          if (us) {
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

  useEffect(() => {
    getCustomers();
  }, []);

  async function getAcct() {
    const accounts = await web3.eth.getAccounts();
    setCurAddress(accounts[0]);
  }

  async function getCustomers() {
    try {
      setPageLoading(true);
      const customers: Customer[] = [];
      const accounts = await web3.eth.getAccounts();
      const accountsCount = await bankContract.methods
        .getCustomers()
        .call({from: accounts[0]});
      for (let i = 1; i <= accountsCount; i++) {
        const account = await bankContract.methods.customers(i).call();
        if (account.created) {
          customers.push({
            key: i,
            userAcct: account.acctAddress,
            created: account.created,
            userAddress: account.userAddress,
            username: account.username,
          });
        }
      }
      setPageLoading(false);
      setCustomers(customers);
    } catch (error : any) {
      console.log(error.message);
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
  function renderCustomers() {
    if (customers.length === 0) {
      return (
        <Table.Row>
          <Table.Cell>No User to Show</Table.Cell>
        </Table.Row>
      );
    }
    return (
      customers &&
      customers.map((cus, i) => (
        <Table.Row key={i}>
          <Table.Cell>{++i}</Table.Cell>
          <Table.Cell>{cus.username}</Table.Cell>
          <Table.Cell>{cus.userAddress}</Table.Cell>
          <Table.Cell>{cus.userAcct}</Table.Cell>
        </Table.Row>
      ))
    );
  }
  return (
    <SidebarComponent user={user} visible={sidebarVisibility}>
      <Head>
        <title>Customers</title>
      </Head>
      <Dimmer active={pageLoading}>
        <Loader size="massive" indeterminate>
          Please Wait...
        </Loader>
      </Dimmer>
      <DashboardNav
        user={user}
        logout={handleLogout}
        page="Customers"
        setSidebar={() => setVisibility((state) => !state)}
        sideBarVisibility={sidebarVisibility}
      />
      <Container>
        <h1 style={{fontWeight: 'bolder', fontSize: '2rem', marginTop: '75px'}}>
          Customers
        </h1>
        <Table color="blue" singleLine selectable size = 'large'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>S/N</Table.HeaderCell>
              <Table.HeaderCell>Username</Table.HeaderCell>
              <Table.HeaderCell>Address</Table.HeaderCell>
              <Table.HeaderCell>Account Address</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{renderCustomers()}</Table.Body>
        </Table>
      </Container>
      <Footer show = {false} />
    </SidebarComponent>
  );
}
