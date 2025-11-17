import { createContext, useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiService from '../services/api.js'; 
import CryptoJS from "crypto-js"
export const DigitalContext = createContext();
const recordIdSecret = import.meta.env.VITE_RECORDID_SECRET
export const DigitalProvider = ({ children }) => {
  const [digitalData, setDigitalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [twitterData, setTwiiterData] = useState(null)
  const [errorMsg, setErrorMsg] = useState('');
  const [twitterErrorMsg, setTwitterErrorMsg] = useState('');
  const {encryptedProfileId} = useParams(); 

  const decryptRecordId = (encryptedRecordId) => {
    const bytes = CryptoJS.AES.decrypt(encryptedRecordId, recordIdSecret);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  const profileId = decryptRecordId(encryptedProfileId);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setErrorMsg('');
        const response = await apiService.profiles.digital(profileId);

        if (response.status === 200) {
          const data = {
            Popular: response.Popular || [],
            Shorts: response.Shorts || []
          };
          setDigitalData(data);
        } else {
          const error = response.data?.error;
          setErrorMsg(error);
          // console.error("Error fetching videos:", error);
        }
      } catch (err) {
        const axiosError = err?.response?.data?.error || err.message || 'An error occurred.';
        setErrorMsg(axiosError);
        // console.error("Error fetching videos:", axiosError);
      } finally {
        setLoading(false);
      }
    };

    if (profileId) fetchVideos();
  }, [profileId]);

  useEffect(() => {
    const fetchTwitterData = async () => {
      try{
        setLoading(true);
        const response = await apiService.profiles.twitter(profileId);
      if (response.status ===200){
        setTwiiterData({Twitter: response.data || []}
          
        );
        // console.log("Twitter data fetched successfully:", response.data);
      }
      }
      catch (err) {
        const axiosError = err?.response?.data?.error || err.message || 'An error occurred while fetching Twitter data.';
        setTwitterErrorMsg(axiosError);
        setLoading(false);
        // console.error("Error fetching Twitter data:", axiosError);
      }finally {
        setLoading(false);
      }
    }
    if (profileId) fetchTwitterData();
  },[profileId]);


  console.log("Digital Data in context:", digitalData);
  console.log("Twitter Data in context:",twitterData)


  return (
    <DigitalContext.Provider value={{ digitalData, setDigitalData, loading, errorMsg,twitterData,twitterErrorMsg }}>
      {children}
    </DigitalContext.Provider>
  );
};