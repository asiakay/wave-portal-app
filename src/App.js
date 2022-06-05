import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./style.scss";
import abi from "./utils/WavePortal.json";

const App = () => {

  // state variable to store user's public wallet
  const [currentAccount, setCurrentAccount] = useState(""); 
  /*  */

  // store `totalWaves` in local state 
  // const [totalWaves, setTotalWaves] = useState(""); 
 


  /* variable to hold contract address after deployment */
  const contractAddress = "0x919384Fa9DB888809eca17F6A1DD8a8296e03CeD";
  
  /* variable referencing abi content */
  const contractABI = abi.abi;

  
  const checkIfWalletIsConnected = async () => {
    // verifying access to window.ethereum
    try {
      const { ethereum } = window;
    
    if (!ethereum){
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    /* checking if we have authorization to access the user's wallet */
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !==0){
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account)
    } else {
      console.log("No authorized account was found")
    }
  } catch (error) {
    console.log(error);
  }
}

/* Implementing connectWallet method */
const connectWallet = async () => {
  try {
    const { ethereum } = window;

    if (!ethereum){
      alert("Get MetaMask to access this feature");
      return;
    }

    // request access to the user's MetaMask account
    const accounts = await ethereum.request({ method: "eth_requestAccounts"});
   
    console.log("Connected", accounts[0]);
    setCurrentAccount(accounts[0]);
  } catch (error) {
    console.log(error)
  }
}
// call the smart contract, read the current waveTotal value

const wave = async () => {
  try {
    const { ethereum } = window;

    if (ethereum){
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

      let count = await wavePortalContract.getTotalWaves();
      console.log("Retreived total wave count ...", count.toNumber());

      const waveTxn = await wavePortalContract.wave();
      console.log("Mining...", waveTxn.hash);

      await waveTxn.wait();
      console.log("Mined -- ", waveTxn.hash);

      count = await wavePortalContract.getTotalWaves();
      console.log("Retrieved total wave count...", count.toNumber());
    } else {
      console.log("Ethereum object doesn't exist.");
    } 
  } catch (error) {
    console.log(error);
  }
}

  /* For running the function when the page loads */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

/* we want to return {count} data in a div  */

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
      {/* If there is no currentAccount render this button */}
      {!currentAccount && (
        <button className="waveButton" onClick={connectWallet}>
          Connect Wallet
        </button>
      )}
    </div>
  </div>
  );
}

export default App;