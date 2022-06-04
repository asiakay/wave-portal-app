import * as React from "react";
import { ethers } from "ethers";

export default function App(){
  const wave = () => {

  }

  return (
    <div className="mainContainer">
      <div className="dataContainer">
      <div className="header">
      👋 Hey there!
      </div>

      <div className="bio">
        I am <span className="name">Asia Lakay</span>  and I worked on music projects that benefitted local nonprofit organizations. Connect your Ethereum wallet and send me a wave!
      </div>

      <button className="waveButton" onClick={wave}>
        Wave at Me
      </button>
    </div>
  </div>
  );
}
