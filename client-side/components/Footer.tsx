import {Icon} from 'semantic-ui-react';
import Link from 'next/link';

type Media = {
  name: 'linkedin' | 'github' | 'twitter' | undefined;
  url: string;
};

const myMedia: Media[] = [
  {
    name: 'linkedin',
    url: '#',
  },
  {
    name: 'twitter',
    url: '#',
  },
  {
    name: 'github',
    url: '#',
  },
];

export default function Footer() {
  function renderMedia() {
    return myMedia.map((media, i) => (
      <Link key={i} href={media.url}>
        <a>
          <Icon size="small" name={media.name} color="blue" />
        </a>
      </Link>
    ));
  }
  return (
    <footer style={{backgroundColor: 'black', color: 'white', padding: '20px'}}>
      <div
        style={{
          margin: '30px auto',
          width: '60%',
          maxWidth: '40rem',
          padding: '20px',
          backgroundColor: 'transparent',
          color: 'white',
        }}
      >
        <h2 style={{textAlign: 'center', color: 'orange'}}>BitWallet</h2>
        <p style={{textAlign: 'center'}}>
          BITWallet is DApp built on Ethereum Rinkeby blockchain network use for
          depositing, withdrawing and sending test ether
        </p>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h4 style = {{marginTop: '20px'}}>BITWallet|2022</h4>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            wordWrap: 'break-word'
          }}
        >
          {renderMedia()}
          <h3 style={{color: 'orange', marginBottom: '20px'}}>
            Developer| PathTech
          </h3>
        </div>
      </div>
    </footer>
  );
}
