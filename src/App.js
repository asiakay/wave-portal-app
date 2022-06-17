import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import abi from "./utils/WavePortal.json";
import { ButtonGroup, /* ListGroup */ } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import Navigation from "./Navigation";

const App = () => {
  /* state property that stores all waves to block */
  const [allWaves, setAllWaves] = useState([]); 

  const [currentAccount, setCurrentAccount] = useState("");
  // variable that grabs and sets/updates the state of account that is adding the wave being sent to the blockchain
  const [messageText, setMessageText] = useState("");
  // variable that grabs and sets/updates the state of the current message that gets sent to the smart contract
  
  const [loading, setLoading] = useState(false);
  // variable that grabs and sets/updates the state of the loading animation that displays on the page letting the user know minting is in progress
  
  const handleSubmit = (e) => {
    // variable that triggers:  
    e.preventDefault();
    wave(messageText);
    // (cont) 1. the wave() function holding the message as a parameter
    setMessageText("");
    // (cont) 2. the setMessageText("") function setting the empty string to hold 
  }



  const contractAddress = "0x2cEA3A7269A7530EDE5F4a6093640Fb028DE8b19";
  // variable that holds the smart contract address

  const contractABI = abi.abi; 
  // imports application binary data from my-wave-portal>artifacts>contracts>WavePortal.json 
  // (cont from above) into wave-portal-app>src>utils>WavePortal.json
  
  const checkIfWalletIsConnected = async () => {
  // variable that holds the async function that triggers the process checking
  // (cont) checking if the wallet is connected  

 
  const { ethereum } = window;
  /* making sure we have access to window.ethereum */

      if (!ethereum) {
        console.log("MetaMask is not connected")
        // then output to the JavaScript console the above message in "".  
        return;
      } else {
        console.log("We have the ethereum object", ethereum)
     /* Checking if we're authorized to access the user's wallet */
      }
      ethereum.request({ method: 'eth_accounts' })
      .then(accounts => {
       console.log(accounts)
     if(accounts.length !==0){
       const account = accounts[0];
       console.log("Found an authorized account:", account)
       setCurrentAccount(account);
     } else {
       console.log("No authorized account found")
     }
    })
  }

  const connectWallet = async () => {
  // implementing connectWallet method

  const ethereum = window.ethereum;

    if (!ethereum){
      alert("Get MetaMask!");
      return;
    } else {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" })
    /* eth_requestAccounts: asking Metamask to give access to the user's wallet */
    setCurrentAccount(accounts[0])
    console.log("Connected", accounts[0])
      }
    }

  const wave = async () => {
    const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        /* providers talks to Etheruem nodes */
        const signer = provider.getSigner();
        /* signer sends transactions and signs messages https://docs.ethers.io/v5/api/signer/#signers?utm_source=buildspace.so&utm_medium=buildspace_project */
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();

        await wavePortalContract.wave("WavePortal", { gasLimit: 30000 });
        
        /* calling the getTotalWaves() function */
        console.log("Retrieved total wave count...", count.toNumber());

    // executing wave transaction below
    const waveTxn = await wavePortalContract.wave(messageText);
    console.log("Writing wave to the blockchain", waveTxn.hash);

    setLoading(true)
    /* calls the setLoading variable that shows the mining process is 
    happening   */

    await waveTxn.wait();
    console.log("Mined --", waveTxn.hash);

    setLoading(false)
        /* stops the animation that shows the transaction is being mined because the 
        process has been completed */

    count = await wavePortalContract.getTotalWaves();
    console.log("Updated wave count...", count.toNumber());

    setMessageText("")
    getAllWaves()
    
      } else {
        console.log("Ethereum object doesn't exist");
      }
    }

    // method to get all waves from the contract 
    const getAllWaves = async () => {
      
        const { ethereum }  = window;
        if (ethereum){
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
          
    // calling getAllWaves method from smart contract
    const waves = await wavePortalContract.getAllWaves();
  
    // collecting address, timestamp and message for the UI
    let wavesCleaned = [];
    waves.forEach(wave => {
      wavesCleaned.push({
          address: wave.waver,
          timestamp: new Date(wave.timestamp * 1000),
          message: wave.message,
        });
      });

    // storing data in React state 
    setAllWaves(wavesCleaned);
  } else {
    console.log("Ethereum object does not exist");
  }
}

  useEffect(() => {
        // runs function when page loads
    checkIfWalletIsConnected();
  }, []);

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
        
       <div id="curated-links"> 
        <ButtonGroup bsPrefix="" vertical aria-label="curated links" /* variant="flush" id="li" */>
        <a href="https://padlet.com/asialakay/fvc9yi3h4932" role="button" className="href-button" >🌱 The Environment</a>
        <a href="https://padlet.com/asialakay/fvc9yi3h4932" role="button" className="href-button" >🌎 Sustainability</a>
        <a href="https://padlet.com/asialakay/ut5ofk1704pjygy7" role="button" className="href-button" >🖊️ Creative Tools</a>
        <a href="https://padlet.com/asialakay/fvc9yi3h4932" role="button" className="href-button" >🧘🏽‍♀️ Wellness</a>
        <a href="https://padlet.com/asialakay/loz0p1k78g4zv592" role="button" className="href-button" >🌐 Web3.0</a>
        </ButtonGroup>
      </div>{/* .curated-links */}
         </div>{/* .bio */}
         
<p></p>

            

          {/* If there is a currentAccount, then render the div below */}
 
           {currentAccount && (
                       <div >
               <h3><span className="name">Want to share? Send your fav links! 🙌 </span></h3>

             <form onSubmit={handleSubmit}>
               <div id="text-write">
                 <textarea 
                 value={messageText}
                 onChange={(e) => setMessageText(e.target.value)}
                 rows={3}
                 cols={60}
                 placeholder="(optional)"
                 />
               </div>
             </form>
             <div className="waveButton">
             <button 
             className="waveButton" 
             onClick={wave}>Send & Wave</button>
             </div>
             </div>
             
           )}
        



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
              </div>)
      
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
   