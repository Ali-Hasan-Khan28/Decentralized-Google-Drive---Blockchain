import { useState } from "react";
import axios  from "axios";
import "./FileUpload.css"

const FileUpload=({ contract, account, provider })=>{
    const [file,setFile] = useState(null);
    const [fileName,setFileName] = useState("No image selected");
    const handleSubmit=async(e)=>{
        e.preventDefault();
        if(file){
            try{
                const formData = new FormData();
                formData.append("file",file);

                const resFile = await axios({
                    method: "post",
                    url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                    data: formData,
                    headers: {
                      pinata_api_key: `eaa460a6482d7fe2b349`,
                      pinata_secret_api_key: `2620732779c7dc3f19c9958366a597a1bcfa802d1f725d6cfd908a4afabe5827`,
                      "Content-Type": "multipart/form-data",
                    },
                  });
                const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`; 
                // const signer = contract.connect(provider.getSigner());
                contract.add(account,ImgHash);
                alert("Succesfully image uploaded");
                setFileName("No Image Selected");
                setFile(null);
            }catch(e){
                alert("Unable to upload image to Pinata");
                console.log(e)
            }
        }
    };

    const retrieveFile=(e)=>{
        const data = e.target.files[0];
        // console.log(data);
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(data);
        reader.onloadend=()=>{
            setFile(e.target.files[0]);
        }
        setFileName(e.target.files[0].name);
        e.preventDefault();
    };
    return <div className="top">
    <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="choose">
            Choose account Image
        </label>
        <input disabled = {!account} type="file" id ="file-upload" name = "data" onChange = {retrieveFile}/>
    <span className="textArea" >Image:{fileName}</span>
    <button type="submit" className="upload" disabled = {!file} >
        Upload File
    </button>
    </form>
    </div>
}
export default FileUpload;