import {Icon, Dropdown} from 'semantic-ui-react';
import {Role} from '../store/types';
import User from '../models/user';

export interface Balances {
  values: string;
  image: {avatar: boolean; src: string};
  text: string;
  key: string;
}

type Props = {
  sideBarVisibility: boolean;
  setSidebar: () => void;
  page: string;
  logout: () => void;
  user: User;
  bal: Balances[] | undefined;
  openProfile: (() => void) | undefined
};

export default function DashboardNav(props: Props) {
  function bal() {
    return (
      props.user.role === Role.User && (
        <span>
          Balance:{' '}
          <Dropdown
            inline
            options={props.bal}
            defaultValue={props.bal ? props.bal[0]?.values : ''}
          />
        </span>
      )
    );
  }
  return (
    <div
      style={{
        height: '200px',
        borderBottomLeftRadius: '20px',
        borderBottomRightRadius: '20px',
        backgroundColor: 'white',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px',
        }}
      >
        <div style={{fontSize: '1.5rem'}}>
          <p onClick={props.setSidebar}>
            <Icon
              link
              fitted
              size="big"
              name={props.sideBarVisibility ? 'cancel' : 'bars'}
            />
            {bal()}
          </p>
        </div>
        <Dropdown
          text="Profile"
          icon="user"
          floating
          labeled
          button
          style = {{backgroundColor: 'orange', color: 'white'}}
          className="icon"
        >
          <Dropdown.Menu >
            {props.user.role === Role.User && <Dropdown.Item onClick = {props.openProfile} style = {{ color: 'blue'}} icon="user circle" text="My Profile" />}
            <Dropdown.Divider />
            <Dropdown.Item style = {{ color: 'blue'}} icon="sign-out" text="Logout" onClick = {props.logout} />
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <h1
        style={{
          marginTop: '30px',
          textAlign: 'center',
          marginBottom: '-20px',
        }}
      >
        {props.page}
      </h1>
    </div>
  );
}
