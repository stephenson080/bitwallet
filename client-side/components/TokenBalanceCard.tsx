export interface Tokendetail {
  color: string;
  bal: string;
  name: string;
  description: string;
}
type Props = {
  tokendetail: Tokendetail;
};
export default function TokenBalanceCard(props: Props) {
  return (
    <div
      style={{ backgroundColor: props.tokendetail.color, padding: "20px", color: "white", width: "100%", margin: "10px 0", borderBottomLeftRadius: "30px", borderTopRightRadius: "30px" }}
    >
      <div>
        <h2 style={{ fontSize: "bold", margin: "10px 0" }}>{props.tokendetail.bal}</h2>
        <p>Type: {props.tokendetail.name}</p>
      </div>

      <h5>Name: {props.tokendetail.description}</h5>
    </div>
  );
}
