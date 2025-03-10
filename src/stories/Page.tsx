import React, { useEffect } from 'react';
import ButtonText from '../Components/ButtonText';
import { scope } from '../scopes/Scope';
import ReactCanvas from '../Components/ReactCanvas';
// import "./page.css"

type User = {
  name: string;
};

export const Page: React.FC = () => {
  const [user, setUser] = React.useState<User>();

  return (
    <div>
      {/* <Helmet defer={false}>
        <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
        <link rel="stylesheet" href="https://jamestitus299.github.io/css_server/jstyles.css" />
      </Helmet> */}
      <section className="p-4">
        <h2 className="text-3xl font-bold text-center">Try the ReactCanvas here</h2>
        <ButtonText />
      </section>
      <div className='p-2'>
        <ReactCanvas scope={scope} code={""} showEditor={true} showError={true} />
      </div>
    </div>
  );
};