export type Props = {
    balance: any
    shareBalance: any
    derivativeWithdrawn: any
} | {
    balance: undefined
    shareBalance: undefined
    derivativeWithdrawn: undefined
}
export default function SavingsInfo(props: Props){
    console.log(props);
    if (!props.balance) {
        return (
            <div style={{
                backgroundColor: 'white',
                padding: '35px',
                borderTopRightRadius: '25px',
                borderBottomLeftRadius: '25px',
                margin: '45px auto',
                width: '80%',
                maxWidth: '60rem',
              }}>
                  <h1>Sorry, You have no Savings yet</h1>
            </div>
        )
    }
    return (
        <div style={{
            backgroundColor: 'blue',
            padding: '35px',
            borderTopRightRadius: '25px',
            borderBottomLeftRadius: '25px',
            margin: '30px auto 20px auto',
            width: '80%',
            maxWidth: '40rem',
            color: 'white',
            boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px;'
          }}>
              {<p>Savings Balance: <h1>{parseFloat(props.balance).toFixed(2)} BUSD</h1></p>}
              <p>Share Balance: <h3>{parseFloat(props.shareBalance).toFixed(2)}</h3></p>
              {props.derivativeWithdrawn && <p>Derivative Withdrawn: <h3>{parseFloat(props.derivativeWithdrawn).toFixed(2)}</h3></p>}
        </div>
    )
}