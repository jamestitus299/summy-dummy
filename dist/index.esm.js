import React, { useState } from 'react';

var ButtonText = function (_a) {
  var _b = _a.initialMessage,
    initialMessage = _b === void 0 ? "Click the button!" : _b;
  var _c = useState(initialMessage),
    message = _c[0];
    _c[1];
  // const handleClick = () => {
  //   setMessage("Hello, you clicked the button!");
  // };
  // const message = 'jam'
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, message));
};

export { ButtonText as Button };
//# sourceMappingURL=index.esm.js.map
