import {Navigate} from "react-router-dom";
import CryptoJS from "crypto-js";
const protectedRoute = ({children})=>{
    const secretKey = import.meta.env.VITE_TOKEN_SECRET
    const encryptedToken = localStorage.getItem("authToken");
    const decryptToken = () =>{
        const bytes = CryptoJS?.AES?.decrypt(encryptedToken,secretKey);
        return bytes.toString(CryptoJS.enc.Utf8);
    }

    const token = decryptToken();
  
    if(!token){
        return <Navigate to="/" replace/>
    }

    return children;
}
export default protectedRoute;