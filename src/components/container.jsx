import React, { useState } from "react";
import { Content } from "./content";
import { Footer } from "./footer";
import { Header } from "./header";

export const Container = ({ panelController }) => {
  const [message, setMessage] = useState([]);

  const writeToConsole = (consoleMessage) => {
    setMessage((prevMessage) => [...prevMessage, consoleMessage]);
  };

  const clearConsole = () => {
    setMessage([]);
  };

  const handleProcessStart = () => {
    console.log("Process Start button clicked");
    if (panelController) {
      panelController.processFiles();
    } else {
      console.error("panelController is not defined");
    }
  };

  return (
    <>
      <div className="plugin-container">
        <Header />
        <Content message={message} />
        <Footer writeToConsole={writeToConsole} clearConsole={clearConsole} />
        <div>
          <button onClick={handleProcessStart}>処理開始</button>
        </div>
      </div>
      <style>
        {`
    .plugin-container {
  color: white;
  padding: 0 16px;
  }
    `}
      </style>
    </>
  );
};
