import {Grid} from 'semantic-ui-react'
import TokenBalanceCard , {Tokendetail} from './TokenBalanceCard'

type Props = {
    items: Tokendetail[]
}
export default function DashboardContainer(props : Props){
    return (
        <div style={{width: '90%', maxWidth: '70rem', padding: '30px', margin: '50px auto', backgroundColor: 'white', borderRadius: '10px'}}>
            
            <Grid>
                <Grid.Row>
                    {props.items.map((item, index) => (
                        <Grid.Column key={index} largeScreen = {4} mobile = {16}>
                            <TokenBalanceCard tokendetail={item}/>
                        </Grid.Column>
                    ))}
                </Grid.Row>
            </Grid>
        </div>
    )
} 