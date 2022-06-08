import React, { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/WavePortal.json";

const App = () => {
  const contractABI = abi.abi;
  const [allWaves, setAllWaves] = useState([]);
  const [currentAccount, setCurrentAccount] = useState("");
  const [message, setMsgText] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    wave(message);
    setMsgText("");

  }
  const contractAddress = "0x484124904Cc0d4712f58A60C804382b895a584A4";

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

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
  };

  /**
  * Implement your renderInput method here
  */





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
  }; /* .`connectWallet()` */

  const wave = async (message) => {
    console.log("let the waving begin.")
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        
        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
                /*
                 * Execute the actual wave from your smart contract
                 */
        const waveTxn = await wavePortalContract.wave(message);
        console.log("Mining...", waveTxn.hash);

        setLoading(true)

        await waveTxn.wait();
        console.log("Mined --", waveTxn.hash);
        
        setLoading(false)
        
        count = await wavePortalContract.getTotalWaves();
        console.log("Retreived total wave count...", count.toNumber());

        setMsgText("")
        getAllWaves()
      } else {
        console.log("Ethereum object doesn't exist!");
        alert("You need to connect a wallet to use this feature.");

      }
    } catch (error) {
      console.log(error);
      setLoading(false);

    }
  };

  const getAllWaves = async () => {
    const { ethereum } = window;

    try {
      if (ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        const waves = await wavePortalContract.getAllWaves();

        const wavesCleaned = waves.map((wave) => {
          return {
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          };
        });

        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist")
      }
    } catch (error){
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    let wavePortalContract;



    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message);
      setAllWaves((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      wavePortalContract.on("NewWave", onNewWave);
  }

  return () => {
      if (wavePortalContract) {
          wavePortalContract.off("NewWave", onNewWave);
      }
  };
}, []);

return (
  <div className="mainContainer">
    <div className="dataContainer">
      <div className="header">
        <h1><span className="name">👋 Hey there!</span></h1>
      </div> {/* .header */}

        <div className="bio">
        <h2><span className="name">I am Asia Lakay.</span></h2>
        <span className="name">My interests include</span>
        <ListGroup variant="flush" id="li">
        <ListGroup.Item id="li">Wellness</ListGroup.Item>
        <ListGroup.Item id="li">Finance</ListGroup.Item>
        <ListGroup.Item id="li">Music</ListGroup.Item>
        <ListGroup.Item id="li">Cats</ListGroup.Item>  
        <ListGroup.Item id="li">Tech</ListGroup.Item>
        </ListGroup>
       
         </div>{/* .bio */}
         


       

          {/* If there is a currentAccount, then render the `div className="text-write" below */}

           
           {currentAccount && (
                       <div className="text-write">

             <form onSubmit={handleSubmit}>
               <label className="name">Enter Your Message Below</label>
               <div>
                 <textarea 
                 value={message}
                 onChange={(e) => setMsgText(e.target.value)}
                 rows={10}
                 cols={60}
                 placeholder="(optional)"
                 />
               </div>
               <button 
             className="waveButton" 
             onClick={wave} >Send & Wave</button>
             </form>
             </div>
             
           )}
        

     {/*    <button 
        className="waveButton" 
        onClick={wave}>
          Click Here to Send a Wave
        </button> */}

        {/* If there is no currentAccount, then render the {connectWallet} button below */}
        {!currentAccount && (
          <button className="" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {loading && (
          <div className="load-9">
            <div className="spinner">
              <div className="bubble-1"></div>
              <div className="bubble-2"></div>
            </div>
            <p>loading</p>
            </div>
        )}

        {allWaves.map((wave, index) => {
          return (
          <div key={index} className="read">
              <div><label>Address:</label> {wave.address}</div>
              <div><label>Time:</label> {wave.timestamp.toString()}</div>
              <div><label>Message:</label> {wave.message}</div>
              </div>
      );
        })}
    </div> {/* /* .dataContainer * */}
  </div> /* .mainContainer */
  );
};

export default App;

  // state variable to store user's public wallet

  // store `totalWaves` in local state 

  // const [totalWaves, setTotalWaves] = useState(""); 
 


  /* variable to hold contract address after deployment */
  // const contractAddress = "0x919384Fa9DB888809eca17F6A1DD8a8296e03CeD";
  
  /* variable referencing abi content */

  
  // const checkIfWalletIsConnected = async () => {
    // verifying access to window.ethereum
   