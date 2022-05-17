import Head from "next/head";
import { useState, Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import SidebarComponent from "../../components/Sidebar";
import DashboardNav, { Balances } from "../../components/DashboardNav";
import { logout, autoLogin } from "../../store/actions/auth_action";

import { Store } from "../_app";
import User from "../../models/user";
import { useRouter } from "next/router";
import { MessageType, Role } from "../../store/types";

import { Container, Dimmer, Loader, Grid } from "semantic-ui-react";
import Acct from "../../ethereum/account";
import web3 from "../../ethereum/web3-config";
import { addTransactionToDB } from "../../store/actions/user-actions";
import { TransactionType } from "../admin/transactions";
import { getCRMToken, getFmtToken, getQmToken } from "../../ethereum/token";
import { getMyAccountBalance, flexibleInfo } from "../../ethereum/xend.finance";
import Footer from "../../components/Footer";
import XendSavings from "../../components/XendSavings";
import SavingsInfo, { Props } from "../../components/SavingsInfo";
import Link from "next/link";

interface SavingState {
  savingsInfoFlex: Props | any;
  savingsInfoFixed: Props | any;
}

export default function SavingsPage() {
  const [sidebarVisble, setSidebar] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMsg] = useState<MessageType>();

  const user = useSelector<Store, User>((state) => state.auth.user!);
  const [state, setState] = useState<SavingState>();

  const [bal, setBal] = useState<Balances[]>([]);
  const [busdBal, setBusdBal] = useState("0");

  const msg = useSelector<Store, MessageType>((state) => state.auth.message);

  const router = useRouter();

  const dispatch = useDispatch();

  useEffect(() => {
    if (msg.type === "SUCCESS") {
      setSuccess(true);
    }
    setMsg({
      type: msg.type,
      content: msg.content,
      header: msg.header,
    });
  }, [msg]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
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
              router.replace("/admin/dashboard");
            }
          } else {
            router.replace("/auth/login");
          }
        })
      );
    } else {
      router.replace("/auth/login");
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

        const flexibledata = await flexibleInfo(false);
        const fixedData = await flexibleInfo(true);

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

        const busdBal = await getMyAccountBalance(undefined, setLoading);

        const bal: Balances[] = [
          {
            key: "0",
            image: { avatar: true, src: "/images/ethereum.png" },
            values: `${web3.utils.fromWei(summary[2], "ether")}`,
            text: `Main Account: ${web3.utils.fromWei(summary[2], "ether")}`,
          },
          {
            key: "1",
            image: { avatar: true, src: "/images/fmt.png" },
            values: `${web3.utils.fromWei(fmtbalance)}`,
            text: `FreeMint Token: ${web3.utils.fromWei(fmtbalance)}`,
          },
          {
            key: "2",
            image: { avatar: true, src: "/images/crm.png" },
            values: `${web3.utils.fromWei(crmbalance)}`,
            text: `CryptMint Token: ${web3.utils.fromWei(crmbalance)}`,
          },
          {
            key: "3",
            image: { avatar: true, src: "/images/qmt.png" },
            values: `${web3.utils.fromWei(qmbalance)}`,
            text: `QMint Token: ${web3.utils.fromWei(qmbalance)}`,
          },
          {
            key: "4",
            image: { avatar: true, src: "/images/qmt.png" },
            values: `${busdBal}`,
            text: `BUSD: ${busdBal}`,
          },
        ];
        setBal(bal);
        setBusdBal(busdBal);
        setState({
          ...state,
          savingsInfoFlex: flexibledata,
          savingsInfoFixed: fixedData,
        });
      }
    } catch (error: any) {
      setMsg({
        type: "DANGER",
        header: "Something went wrong",
        content: error.message,
      });
    }
  }

  function handleLogout() {
    setPageLoading(true);
    dispatch(
      logout((m) => {
        setPageLoading(false);
        if (m === "SUCCESS") {
          localStorage.clear();
          router.replace("/auth/login");
        }
      })
    );
  }
  function openProfile() {
    router.replace("/user/profile");
  }

  return (
    <Fragment>
      <Head>
        <title>Start Saving</title>
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
          page="Start Saving"
          setSidebar={() => setSidebar((state) => !state)}
          sideBarVisibility={sidebarVisble}
          user={user}
          logout={handleLogout}
        />

        <Container>
          <Grid>
            <Grid.Row>
              <Grid.Column largeScreen={8} mobile={16}>
                {/* {state?.savingsInfoFixed.balance && (
                  <SavingsInfo
                    balance={state?.savingsInfoFixed.balance}
                    shareBalance={state?.savingsInfoFixed.shareBalance}
                    derivativeWithdrawn={
                      state?.savingsInfoFixed.derivativeWithdrawn
                    }
                  />
                )} */}
                <div
                  style={{
                    backgroundColor: "blue",
                    padding: "35px",
                    borderTopRightRadius: "25px",
                    borderBottomLeftRadius: "25px",
                    margin: "30px auto 20px auto",
                    width: "80%",
                    maxWidth: "40rem",
                    color: "white",
                  }}
                >
                  <p>
                    BUSD Balance: <h1>{parseFloat(busdBal).toFixed(2)} BUSD</h1>
                  </p>
                  <p>
                    This amount of token you use for saving{" "}
                    <Link href={"/user/get-busd"}>
                      <b style={{ cursor: "pointer" }}>Get BUSD</b>
                    </Link>
                  </p>
                </div>
              </Grid.Column>
              <Grid.Column largeScreen={8} mobile={16}>
                {/* {!state?.savingsInfoFlex && (
                  <SavingsInfo
                    balance="0.00"
                    shareBalance="0.00"
                    derivativeWithdrawn="0.00"
                  />
                )}
                {state?.savingsInfoFlex.balance && (
                  <SavingsInfo
                    balance={state?.savingsInfoFlex.balance}
                    shareBalance={state?.savingsInfoFlex.shareBalance}
                    derivativeWithdrawn={
                      state?.savingsInfoFlex.derivativeWithdrawn
                    }
                  />
                )} */}
                <SavingsInfo
                  balance={
                    state?.savingsInfoFlex
                      ? state.savingsInfoFlex.balance
                      : "0.00"
                  }
                  shareBalance={
                    state?.savingsInfoFlex
                      ? state.savingsInfoFlex.shareBalance
                      : "0.00"
                  }
                  derivativeWithdrawn={
                    state?.savingsInfoFlex
                      ? state.savingsInfoFlex.derivativeWithdrawn
                      : "0.00"
                  }
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>

        <div
          style={{
            backgroundColor: "white",
            padding: "35px",
            borderTopRightRadius: "25px",
            borderBottomLeftRadius: "25px",
            margin: "45px auto",
            width: "80%",
            maxWidth: "50rem",
            boxShadow: "rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
          }}
        >
          <XendSavings save />
        </div>
        <Footer show={false} />
      </SidebarComponent>
    </Fragment>
  );
}
