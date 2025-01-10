import React from 'react';
import { useState, useEffect } from 'react';

interface ButtonWithMessageProps {
  initialMessage?: string;  // Optional prop for the initial message
}

const ButtonText: React.FC<ButtonWithMessageProps> = ({ initialMessage = "Click the button!" }) => {
  const [message, setMessage] = useState<string>(initialMessage);

  const handleClick = () => {
    setMessage("Hello, from JT");
  };
  
  // const message = 'jam'
  return (
    <div>
      <button onClick={handleClick}>Click me</button>
      <p>{message}</p>
    </div>
  );
};

export default ButtonText;