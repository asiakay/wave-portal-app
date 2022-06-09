import React, { useEffect, useState } from "react";
import { ButtonGroup, /* ListGroup */ } from "react-bootstrap";
import { ethers } from "ethers";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import abi from "./utils/WavePortal.json";
import Navigation from "./Navigation";


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
        console.log("Make sure you have MetaMask!");
        alert("Make sure you have MetaMask")
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
}, [contractABI]);

return (
  <>
<div>
<Navigation/>
</div>
  <div className="mainContainer">
    <div className="dataContainer">
      <div className="header">
        <h1><span className="name">👋 Hey there! I am Asia Lakay.</span></h1>
      </div> {/* .header */}

        <div className="bio">
        <h2><span className="">Curated Links</span></h2>
        
        
        
       {/*  <div class="btn-group-vertical">
        <a href="https://padlet.com/asialakay/fvc9yi3h4932" type="button" id="href-buttons">Wellness</a>
        </div> */}



        <ButtonGroup vertical aria-label="curated links" /* variant="flush" id="li" */>
        <a href="https://padlet.com/asialakay/fvc9yi3h4932" role="button" class="href-button" >🌱 The Environment</a>
        <a href="https://padlet.com/asialakay/fvc9yi3h4932" role="button" class="href-button" >🌎 Sustainability</a>
        <a href="https://padlet.com/asialakay/ut5ofk1704pjygy7" role="button" class="href-button" >🖊️ Creative Tools</a>


        <a href="https://padlet.com/asialakay/fvc9yi3h4932" role="button" class="href-button" >🧘🏽‍♀️ Wellness</a>

        <a href="https://padlet.com/asialakay/loz0p1k78g4zv592" role="button" class="href-button" >🌐 Web3.0</a>
        </ButtonGroup>

{/*         <ListGroup.Item>💰 Finance</ListGroup.Item>
        <ListGroup.Item>🎼 Music</ListGroup.Item>
        <ListGroup.Item>😻 Cats</ListGroup.Item>  
        <ListGroup.Item>👩🏽‍💻 Tech</ListGroup.Item>
        </ListGroup> */}
       
         </div>{/* .bio */}
         
<p></p>

       

          {/* If there is a currentAccount, then render the `div className="text-write" below */}

           
           {currentAccount && (
                       <div >
               <h3><span className="name">Want to share? Send your fav links! 🙌 </span></h3>

             <form onSubmit={handleSubmit}>
               <div id="text-write">
                 <textarea 
                 value={message}
                 onChange={(e) => setMsgText(e.target.value)}
                 rows={10}
                 cols={60}
                 placeholder="(optional)"
                 />
               </div>
               
             </form>
             <button 
             className="waveButton" 
             onClick={wave}>Send & Wave</button>
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
  </div> {/* .mainContainer */}
  </>
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
   