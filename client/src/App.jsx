import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import Display from "./components/Display";
import Modal from "./components/Modal"; // Ensure this file exists
import FileUpload from "./components/FileUpload";
import "./App.css";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {

    const loadProvider = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          if (provider) {
            window.ethereum.on("chainChanged", () => {
              window.location.reload();
            });

            window.ethereum.on("accountsChanged", () => {
              window.location.reload();
            });
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            const address = await signer.address; // Correct way to get the address in ethers@6
            setAccount(address);

            const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
            const contract = new ethers.Contract(
              contractAddress,
              Upload.abi,
              signer
            );
            // console.log(contract);

            setContract(contract);
            setProvider(provider);
          }
        } catch (error) {
          console.error("Error connecting to MetaMask:", error);
        }
      } else {
        console.error("MetaMask is not installed");
      }
    };

    loadProvider();
  }, []);
  return <div className="App">
    {!modalOpen && (<button className="share" onClick={()=>setModalOpen(true)}>share</button>)}{" "} 
    {modalOpen && (<Modal setModalOpen={setModalOpen} contract={contract}></Modal>)}
    <h1 style={{ color: "white" }}>Gdrive 3.0</h1>
    <div className="bg"></div>
    <div className="bg bg2"></div>
    <div className="bg bg3"></div>

    <p style={{ color: "white" }}> Account : {account ? account : "Not Connected"}</p>


    <FileUpload
      account={account}
      provider={provider}
      contract={contract}
    ></FileUpload>
    <Display
      contract={contract} account={account}
    ></Display>

  </div>

}

export default App
