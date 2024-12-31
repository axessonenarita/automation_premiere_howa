import React from "react";
import "./footer.css";
import { mediacoreBackend } from "uxp";
export const Footer = (props) => {
  const populateApplicationInfo = async () => {
    const ppro = require("premierepro");
    const project = await ppro.Project.getActiveProject();
    if (!project) {
      props.writeToConsole("There is no active project found");
    } else {
      props.writeToConsole(`Active project: ${project.name}`);
      const sequence = await project.getActiveSequence();
      if (!sequence) {
        props.writeToConsole("There is no active sequence found");
      } else {
        props.writeToConsole(`Active sequence: ${sequence.name}`);
      }
    }
  };

  const clearApplicationInfo = async () => {
    props.clearConsole();
  };
  return (
    <sp-body>
      <div className="plugin-footer">
        <sp-button onClick={populateApplicationInfo}>
          Populate Application Info
        </sp-button>
        <sp-button onClick={clearApplicationInfo}>
          Clear Application Info
        </sp-button>
      </div>
    </sp-body>
  );
};
