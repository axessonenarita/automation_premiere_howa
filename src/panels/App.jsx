import React from "react";

import { Container } from "../components/container.jsx";

export const App = ({ panelController }) => {
  return (
    <>
      <Container panelController={panelController} />
    </>
  );
};
