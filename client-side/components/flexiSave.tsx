import { Form, Message, Button } from "semantic-ui-react";
import { useState } from "react";
import { makeDeposit, doWithdraw } from "../ethereum/xend.finance";

import { MessageType } from "../store/types";

type Props = {
  save: boolean;
};
export default function FlexiSave(props: Props) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMsg] = useState<MessageType>();

  async function transact() {
    try {
      setMsg(undefined);
      setSuccess(false);

      if (!props.save) {
        const res = await doWithdraw(amount, false, undefined, setLoading);
        if (!res?.status) {
          throw new Error(res?.data);
        }
        console.log(res);
        setSuccess(true);

        setMsg({
          type: "SUCCESS",
          header: "Operation Success",
          content: `You have successfully withdrawn ${amount}`,
        });
        return
      }

      const { status, data } = await makeDeposit(
        amount,
        false,
        undefined,
        setLoading
      );
      if (!status) {
        throw new Error("Could not Deposit. Please try again later");
      }

      console.log(status, data);
      setSuccess(true);

      setMsg({
        type: "SUCCESS",
        header: "Operation Success",
        content: `You have successfully saved ${amount}`,
      });
    } catch (error: any) {
      setLoading(false);
      setMsg({
        type: "DANGER",
        header: "Something went wrong",
        content: error.message,
      });
    }
  }

  return (
    <Form
      style={{ margin: "40px 20px" }}
      loading={loading}
      size="big"
      error={!!message?.content}
    >
      <Form.Input
        required
        type="text"
        style={{ width: "80%" }}
        label="Amount (BUSD)"
        size="big"
        placeholder={`Enter amount of BUSD to ${
          props.save ? "save" : "withdraw"
        }`}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Button onClick={transact} color="blue" loading={loading}>
        {props.save ? "Save" : "Withdraw"}
      </Button>
      <Message
        success={success}
        style={{ width: "70%" }}
        error
        content={message?.content}
        header={message?.header}
      />
    </Form>
  );
}
