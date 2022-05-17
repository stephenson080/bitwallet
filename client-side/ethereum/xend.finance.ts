import XF from "@xend-finance/web-sdk";
import protocols from "./addresses.json";

const setupSdk = async () => {
  const chainID = 0; // ganache
  const PK = process.env.NEXT_PUBLIC_XEND_FINANCE_KEY;
  return await XF(chainID, PK as any, { env: "local", protocols });
};

export const getMyAccountBalance = async (
  setAmount: any,
  setLoading: Function
) => {
  try {
    setLoading(true);
    const sdk = await setupSdk();

    const acct = await sdk.walletBalance();

    setLoading && setLoading(false);
    setAmount && setAmount(acct);
    return acct;
  } catch (e) {
    console.error(e);
    setLoading && setLoading(false);
    setAmount && setAmount("0");
    throw e;
  }
};

export const flexibleInfo = async (isFixed: boolean) => {
  try {
    const { Personal } = await setupSdk();

    if (isFixed) {
      return await Personal.fixedInfo();
    }

    const info = await Personal.flexibleInfo();
    console.log(info);
    return info;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const makeDeposit = async (
  amount: any,
  isFixed: boolean,
  lockPeriod: number | undefined,
  setLoading: Function
) => {
  try {
    setLoading(true);
    const { Personal } = await setupSdk();
    if (isFixed && lockPeriod) {
      const result = await Personal.fixedDeposit(amount, lockPeriod);

      return result;
    }

    const x = await Personal.flexibleDeposit(String(amount));

    setLoading(false);
    return x;
  } catch (e) {
    setLoading(false);
    throw e;
  }
};

export const doWithdraw = async (
  amount: any,
  isFixed: boolean,
  recordId: number | undefined,
  setLoading: Function
) => {
  try {
    setLoading(true);
    const { Personal } = await setupSdk();

    // let amountToPass = Number(amount) * Math.pow(10, -8)

    //@ts-ignore
    const finalAmount = String(
      amount.toString().match(/^-?\d+(?:\.\d{0,4})?/)[0]
    );
    console.log(finalAmount);
    if (isFixed && recordId) {
      const result = await Personal.withdrawFixed(recordId);
      return result;
    }

    const x = await Personal.withdrawFlexible(finalAmount); // we withdraw share balance, not the busd value
    console.log(x);
    setLoading(false);
  } catch (error) {
    console.log(error);
    setLoading(false);
    throw error;
  }
};

export const myAddress = async () => {
  try {
    const xf = await setupSdk();
    const result = await xf.retrieveWallet(); // we withdraw share balance, not the busd value
    return result.address;
  } catch (error) {
    throw error;
  }
};
