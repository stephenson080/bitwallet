import { Tab } from "semantic-ui-react";
import FixedSave from "./fixedSavings";
import FlexiSave from "./flexiSave";


export default function XendSavings(props: any) {
  const panes = [
    {
      menuItem: "Flexible Savings",
      render: () => <Tab.Pane as='div' size = 'massive'  attached={false}><FlexiSave save = {props.save}/></Tab.Pane>,
    },
    {
      menuItem: "Fixed Savings",
      render: () => <Tab.Pane as = 'div' size = 'massive' attached={false}><FixedSave/></Tab.Pane>,
    },
    
  ];
  return <Tab  panes={panes} menu = {{secondary: true, pointing: true}} />;
}
