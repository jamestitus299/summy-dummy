import { useState } from "react";
import { HexColorPicker } from "react-colorful";

export const ColorPicker = () => {
  const [color, setColor] = useState("#aabbcc");
  return (
    <>
      {color}
      <HexColorPicker color={color} onChange={setColor} />;
    </>
  );
};
