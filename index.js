import React from "react";
import { render } from "react-dom";
import { hot } from "react-hot-loader/root";

const magicRender = (Component, domElement) => {
  const HotApp = hot(Component);

  render(<HotApp />, document.getElementById(domElement));
};

export { magicRender as render };
