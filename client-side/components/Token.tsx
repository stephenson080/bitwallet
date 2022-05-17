import { Card, Image, Button } from "semantic-ui-react";
import { TransactionType } from "../pages/admin/transactions";

export interface Token {
  name: string;
  symbol: string;
  price: number;
  imageUrl: string;
  totalSupply: string;
  address: string;
}

export enum TokenType {
  GUEST,
  USER,
  ADMIN,
}

type Props = {
  tokens: Token[];
  getTokenDetails: (token: Token, action: TransactionType) => void;
  tokenType: TokenType;
};

export default function Tokens(props: Props) {
  return (
    <Card.Group centered>
      {props.tokens.map((tk, i) => {
        return (
          <Card key={i} raised>
            <Image wrapped src={`/images/${tk.imageUrl}`} ui={false} />
            <Card.Content>
              <Card.Header style={{ color: "blue" }}>
                {tk.name} ({tk.symbol})
              </Card.Header>
              <Card.Meta style={{ wordWrap: "break-word" }}>
                {tk.address}
              </Card.Meta>
              <Card.Description>
                Price: {tk.price} ether <br />
                {tk.symbol === "FMT"
                  ? "Create a Wallet and This free"
                  : "You can buy this here buy"}
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <div className="ui two buttons">
                {(props.tokenType === TokenType.GUEST ||
                  props.tokenType === TokenType.USER) && (
                  <Button
                    basic
                    color="blue"
                    onClick={() => {
                      props.getTokenDetails(tk, TransactionType.BUY_TOKEN);
                    }}
                  >
                    Buy {tk.name}
                  </Button>
                )}
                {props.tokenType === TokenType.ADMIN && (
                  <Button
                    basic
                    color="orange"
                    onClick={() => {
                      props.getTokenDetails(tk, TransactionType.MINT_TOKEN);
                    }}
                  >
                    Mint Token
                  </Button>
                )}
                {props.tokenType === TokenType.USER && (
                  <Button
                    basic
                    color="orange"
                    onClick={() => {
                      props.getTokenDetails(tk, TransactionType.SEND_TOKEN);
                    }}
                  >
                    Send Token
                  </Button>
                )}
              </div>
            </Card.Content>
          </Card>
        );
      })}
    </Card.Group>
  );
}
