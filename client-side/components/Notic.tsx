import {Modal, Button} from 'semantic-ui-react';

type Props = {
  centered: boolean;
  size: 'tiny' | 'mini' | 'fullscreen' | 'large' | 'small' | undefined;
  open: boolean;
  close: () => void;
};

export default function Notic(props: Props) {
  return (
    <Modal centered={props.centered} dimmer size={props.size} open={props.open}>
      <Modal.Header style={{backgroundColor: 'blue', color: 'white'}}>
        Disclaimer
      </Modal.Header>
      <Modal.Content>
        <h5>
          For your to use this platform you need to have Metamask extension on
          Pc browser or Metamask app on mobile phones
        </h5>
        <p>
          click{' '}
          <strong
            onClick={() =>
              window.open(
                'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn'
              )
            }
            style={{color: 'orange', cursor: 'pointer', fontStyle: 'italic'}}
          >
            here
          </strong>{' '}
          to download metamask extension on your browser
        </p>
        <p>
          click{' '}
          <strong
            onClick={() =>
              window.open(
                'https://metamask.app.link/bxwkE8oF99'
              )
            }
            style={{color: 'orange', cursor: 'pointer', fontStyle: 'italic'}}
          >
            here
          </strong>{' '}
          to download metamask app on your mobile phone
        </p>
        
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={props.close} basic color="red">
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
