import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/WavePortal.json";


const App = () => {
  /*
  * Just a state variable we use to store our user's public wallet.
  */
  const [currentAccount, setCurrentAccount] = useState("");

  const contractAddress = "0xf5F5AdB9909A28BF881FFE55eB5A24cF39Bf8806";

  const contractABI = abi.abi;


  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window; 

      if (!ethereum){
        alert("Please Get MetaMask");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts"});

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error){
      console.log(error)
    }
  } /* .`connectWallet()` */

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        const waveTxn = await wavePortalContract.wave();
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined --", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retreived total wave count...", count.toNumber());

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

return (
  <div className="mainContainer">
    <div className="dataContainer">
      <div className="header">
        <h1>👋 Hey there!</h1>
      </div> {/* .header */}

        <div className="bio">
        <h2>I am <span className="name">Asia Lakay.</span></h2>
        My passion is music because of its power to help people create connections and boost their moods.
        My other passion is tech because of its potential to help people improve express themselves and improve their quality of life.
        </div>{/* .bio */}

        <button 
        className="waveButton" 
        onClick={wave}>
          Click Here to Send a Wave
        </button>

        {/* If there is no currentAccount, then render the {connectWallet} button below */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

    </div> {/* /* .dataContainer * */}
  </div> /* .mainContainer */
  );
}

export default App;

  // state variable to store user's public wallet

  // store `totalWaves` in local state 

  // const [totalWaves, setTotalWaves] = useState(""); 
 


  /* variable to hold contract address after deployment */
  // const contractAddress = "0x919384Fa9DB888809eca17F6A1DD8a8296e03CeD";
  
  /* variable referencing abi content */

  
  // const checkIfWalletIsConnected = async () => {
    // verifying access to window.ethereum
   