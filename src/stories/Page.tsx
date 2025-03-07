import React, { useEffect } from 'react';
import ButtonText from '../Components/ButtonText';
import { scope } from '../utils/Scope';
import ReactCanvas from '../Components/ReactCanvas';
import { DropdownMenu, DropdownMenuTrigger, } from '@radix-ui/react-dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

type User = {
  name: string;
};

export const Page: React.FC = () => {
  const [user, setUser] = React.useState<User>();

  return (
    <div>
      <section className="p-4">
        <h2 className="text-3xl font-bold text-center">Try the ReactCanvas here</h2>
        <ButtonText />
      </section>
      <div className='p-2'>
        <ReactCanvas scope={scope} code={""} showEditor={true} showError={true} />
      </div >



    </div>
  );
};