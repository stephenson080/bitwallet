import web3 from "web3";
import busdAbi from "./busdAbi.json";

const w3 = new web3("http://localhost:8545");
const busdAddress = "0xe9e7cea3dedca5984780bafc599bd69add087d56";
const busd = new w3.eth.Contract(busdAbi as any, busdAddress);

// Values to Change
const receiver = pkToAddress(
  
  process.env.NEXT_PUBLIC_XEND_FINANCE_KEY
); // create .env file and save the PRIVATE_KEY copy from ganache
const unlockedAddress = process.env.NEXT_PUBLIC_UNLOCK_ADDRESS;

export const sendFunds = async (fund: any, getBalance: Function) => {
  console.log("waiting...");
  Promise.all([
    busd.methods.balanceOf(unlockedAddress).call(),
    busd.methods.balanceOf(receiver).call(),
  ])
    .then(async ([unlockedBal, receiverBal]) => {
      // const prev = { unlocked: unlockedBal, receiver: receiverBal }
      console.log(unlockedBal, receiverBal);
      try {
        console.log("waiting...", 3);

        const amount = BigInt(fund) * BigInt(Math.pow(10, 18));
        await busd.methods
          .transfer(receiver, amount.toString())
          .send({ from: unlockedAddress });
        console.log("* sent *\n");

        Promise.all([
          busd.methods.balanceOf(unlockedAddress).call(),
          busd.methods.balanceOf(receiver).call(),
        ]).then(([unlockedBal, receiverBal]) => {
          // const after = { unlocked: unlockedBal, receiver: receiverBal }
          // console.table(after)
          getBalance();
        });
      } catch (error) {
        console.log(error);
        throw error;
      }
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

function pkToAddress(pk: any) {
  console.log(pk);
  const account = w3.eth.accounts.privateKeyToAccount(pk);
  return account.address;
}
