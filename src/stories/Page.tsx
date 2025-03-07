import React, { useEffect } from 'react';
import { Header } from './Header';
import './page.css';

import ButtonText from '../components/ButtonText';
import { scope } from '../utils/Scope';
import ReactCanvas from '../components/ReactCanvas';


type User = {
  name: string;
};

export const Page: React.FC = () => {
  const [user, setUser] = React.useState<User>();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.tailwindcss.com';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Clean up the script when component unmounts
      document.head.removeChild(script);
    };
  }, []);

  return (
    <article>
      <Header
        user={user}
        onLogin={() => setUser({ name: 'James Titus' })}
        onLogout={() => setUser(undefined)}
        onCreateAccount={() => setUser({ name: 'Jane Doe' })}
      />

      <section className="storybook-page">
        <h2>Try the ReactCanvas here</h2>
        <ButtonText />

        <ReactCanvas scope={scope} code={""} showEditor={true} showError={true} />


      </section>
    </article>
  );
};
