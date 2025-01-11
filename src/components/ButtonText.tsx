import React from "react";
import { useState, useEffect } from "react";

interface ButtonWithMessageProps {
  initialMessage?: string; // Optional prop for the initial message
}

const ButtonText: React.FC<ButtonWithMessageProps> = ({
  initialMessage = "",
}) => {
  const [message, setMessage] = useState<string>(initialMessage);

  const handleClick = () => {
    setMessage("Hello, from JT");
  };

  // const message = 'jam'
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <p className="text-xl text-gray-800">{message}</p>
      <button
        onClick={handleClick}
        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300"
      >
        Click me
      </button>
    </div>
  );
};

export default ButtonText;