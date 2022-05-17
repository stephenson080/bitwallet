import {Image} from 'semantic-ui-react'

export interface Tokendetail {
  color: string;
  bal: string;
  name: string;
  description: string;
  imageUrl: string
}
type Props = {
  tokendetail: Tokendetail;
};
export default function TokenBalanceCard(props: Props) {
  return (
    <div
      style={{
        backgroundColor: props.tokendetail.color,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: "20px",
        color: "white",
        width: "100%",
        margin: "10px 0",
        borderRadius: "15px",
        height: '13rem'
      }}
    >
      <div style={{width: '75%'}}>
        <div>
          <h2 style={{ fontSize: "bold", margin: "10px 0" }}>
            {props.tokendetail.bal}
          </h2>
          <p>Type: {props.tokendetail.name}</p>
        </div>

        <h5>Name: {props.tokendetail.description}</h5>
      </div>
      <div style={{width: '25%'}}>
        <Image style = {{filter: 'brightness(50%)'}} src={`/images/${props.tokendetail.imageUrl}`} />
      </div>
    </div>
  );
}
