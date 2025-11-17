import axios from "axios";
import { AlignVerticalJustifyCenter } from "lucide-react";
import { DecryptionHelper } from "../utils/encryption";
import { useSelector } from "react-redux";
import CryptoJS from "crypto-js";
import { generatePath } from "react-router-dom";
const API_BASE_URL = "https://ai.multipliersolutions.in";
// const API_BASE_URL = 'http://127.0.0.1:5000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const secretKey = import.meta.env.VITE_TOKEN_SECRET
// apiClient.defaults.headers["Authorization"] = `Bearer `
const encryptToken = (token,secretKey)=>{
  const encryptedToken = CryptoJS.AES.encrypt(token,secretKey).toString();
  return encryptedToken;
}

let usemail = localStorage.getItem("userEmail")

let email = usemail? usemail : "";



// const setBearer = () =>{
//   const token = encryptToken(localStorage?.getItem("authToken"),secretKey);

//   apiClient.defaults.headers["Authorization"] = `Bearer ${token}`
// }
// setBearer()
const decryptionHelper = new DecryptionHelper("wJ0hP19QU4hmpB64Y3fV2dAed8t/mupw3sjN5jNRFzg=");

apiClient.interceptors.request.use((config) => {
  const isPublicRoute = [
    "/api/auth/login",
    "/api/auth/generate-otp",
    "/api/auth/register"
  ].some((route) => config.url.includes(route));

  if (isPublicRoute) {
    return config; // Don't attach token for public routes
  }

  const encryptedToken = localStorage?.getItem("authToken");
  if (encryptedToken) {
    const token = CryptoJS.AES.decrypt(encryptedToken, secretKey).toString(CryptoJS.enc.Utf8);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return config;
});

const apiService = {
  admin: {
    getPendingUsers: async (companyId) => {
      try {
        const response = await apiClient.get(
          `/api/admin/companies/${companyId}/pending-users?email=${email}`
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching pending users:", error);
        throw error;
      }
    },

    updateUserStatus: async (userId, data) => {
      try {
        const response = await apiClient.put(
          `/api/admin/users/${userId}/status?email=${email}`,
          data
        );
        return response.data;
      } catch (error) {
        console.error("Error updating user status:", error);
        throw error;
      }
    },
  },
  auth: {
    login: async (email, password) => {
      try {
        const response = await apiClient.post(`/login?email=${email}`, { email, password });
        return response.data;
      } catch (error) {
        console.error("Login error:", error.message);
        throw error;
      }
    },
    register: async (userData) => {
      const response = await apiClient.post(`api/auth/register?email=${email}`, userData);
      return response.data;
    },
    generateOtp: async (userEmail) => {
      console.log("email inside the generateotp ",userEmail)
      email= userEmail? userEmail : usemail;
      try{
        const response = await apiClient.post(`/api/auth/generate-otp?email=${email}`, {
          email,
        });
        return response.data;
      }catch(e){
        console.log(e," error for the generating the otp")
      }
      
    },
    verifyOtp: async (email, otp) => {
      const response = await apiClient.post(`/api/auth/verify-otp?email=${email}`, {
        email,
        otp,
      });
      if(response.data.encrypted){
        console.log("yes iam encrypted")
        
        const decryptedData = await decryptionHelper.decryptResponse(response.data.data)
        console.log("decrypted data", decryptedData.data);
        return await  decryptedData.data;

      }else{
        return await response.data;
      }
    },
    updateProfile: async (data) => {
      const token = useSelector((state) => state.user.token)
      const response = await apiClient.post(`/api/auth/updateUser?email=${email}`, data);
      console.log("response for update profile  ", response);
      return response.data;
    },
  },
  profiles: {
    getAll: async (page = 1) => {
      const response = await apiClient.get(`/api/profile?page=${page}&email=${email}`);
      if(response.data.encrypted){
        console.log("yes iam encrypted")
        
        const decryptedData = await decryptionHelper.decryptResponse(response.data.data)
        console.log("decrypted data", decryptedData.data);
        return await  decryptedData.data;

      }else{
        return await response.data;
      }

     
    },
    getById: async (id) => {
      console.log("id inside the getById:", id);
      try {
        const response = await apiClient.get(`/api/profile/${id}?email=${email}`);
        // Properly log the response data
        // console.log("Response data:", JSON.stringify(response.data, null, 2));
        if(response.data.encrypted){
          console.log("yes iam encrypted")
          
          const decryptedData = await decryptionHelper.decryptResponse(response.data.data)
          console.log("decrypted data", decryptedData.data);
          return await  decryptedData.data;
  
        }else{
          return await response.data;
        }
      } catch (error) {
        console.error("Error fetching profile:", error.message);
        if (error.response) {
          console.error("Response status:", error.response.status);
          console.error("Response data:", error.response.data);
        }
        throw error;
      }
    },
    scientificProfile: async (id) => {
      console.log("id inside the scientificProfile:", id);
      const response = await apiClient.get(`/api/profile/${id}/scientific?email=${email}`);
      console.log("response for scientific  ", response);
      console.log(
        "scientificProfile API response in service:",
        typeof response.data
      );
      if(response.data.encrypted){
        console.log("yes iam encrypted")
        
        const decryptedData = await decryptionHelper.decryptResponse(response.data.data)
        console.log("decrypted data", decryptedData.data);
        return await  decryptedData.data;

      }else{
        return await response.data;
      }
    },
    collaborators: async (id) => {
      // console.log("Fetching collaborators for ID:", id);
      const response = await apiClient.get(`/api/profile/${id}/collaborators?email=${email}`);
      // console.log("Collaborators API response in service:", response.data[0]);
      return response.data[0];
    },
   sideSearch: async (filter, page, activeTab) => {
  const { scientific, clinical, location, digital, speciality } = filter;

  // ✅ Always default to page=1 if undefined, null, or 0
  const currentPage = !page || page <= 0 ? 1 : page;

  const queryParams = new URLSearchParams();

  if (scientific) queryParams.append("scientific", scientific);
  if (clinical) queryParams.append("clinical", clinical);
  if (location) queryParams.append("location", location);
  if (digital) queryParams.append("digital", digital);
  if (speciality) queryParams.append("speciality", speciality);
    console.log("-------------------------%%%%%%", speciality);


  queryParams.append("page", currentPage);

  const response = await apiClient.get(`/api/profile/sideSearch?${queryParams}&email=${email}`);
  console.log("sideSearch API response in service:", response.data);

  if (response.data.encrypted) {
    console.log("yes I am encrypted");
    const decryptedData = await decryptionHelper.decryptResponse(response.data.data);
    console.log("decrypted data", decryptedData.data);
    return decryptedData.data;
  } else {
    return response.data;
  }
},

    vectorSearch: async (searchTerm) => {
      const response = await apiClient.get(
        `/api/vector-search?query=${searchTerm}&email=${email}`
      );
      return response.data;
    },
    mainSearch: async (params = {}) => {
      const { search } = params;

      // Early return if search term is missing or empty after trim
      if (!search || search.trim().length === 0) {
        console.warn("Skipped API call: Empty search term");
        return { doctor_profiles: [] }; // Return empty response format
      }

      const queryParams = new URLSearchParams({ search: search.trim() });

      try {
        const response = await apiClient.get(
          `/api/profile/search?${queryParams}&email=${email}`
        );
        console.log(response.data);
        if(response.data.encrypted){
          console.log("yes iam encrypted")
          const decryptedData = await decryptionHelper.decryptResponse(response.data.data)
          console.log("decrypted data", decryptedData.data);
          return decryptedData.data;
  
        }else{
          return response.data;
        }
      } catch (error) {
        console.error("API error:", error);
        throw error;
      }
    },

    clinicalTrails: async (id) => {
      try {
        const response = await apiClient.get(
          `/api/profile/${id}/clinical-trails?email=${email}`
        );
        if(response.data.encrypted){
          console.log("yes iam encrypted")
          
          const decryptedData = await decryptionHelper.decryptResponse(response.data.data)
          console.log("clinical trials decrypted data", decryptedData.data);
          return await  decryptedData.data.data;
  
        }else{
          return await response.data;
        }
      } catch (error) {
        console.error("Error fetching clinical trials:", error.message);
        throw error;
      }
    },
    clinicalTrailsByNctId: async (profileId, nctId) => {
      try {
        const response = await apiClient.get(
          `/api/profile/${profileId}/clinical-trails/${nctId}&email=${email}`
        );
        if(response.data.encrypted){
          console.log("yes iam encrypted")
          
          const decryptedData = await decryptionHelper.decryptResponse(response.data.data)
          console.log("decrypted data", decryptedData.data);
          return await  decryptedData.data;
  
        }else{
          return await response.data;
        }
      } catch (error) {
        console.error(
          "Error fetching clinical trials by NCT ID:",
          error.message
        );
        throw error;
      }
    },
    CTRIData : async (profileId) =>{
      try{
        const response = await apiClient.get(`/api/ctri/${profileId}&email=${email}`);
        console.log("CTRI API response in service:", response);
        return response.data;

      }catch(error){
        console.error("Error fetching CTRI data:", error.message);
        throw error;
      }

    },
    CTRIDataById : async (ctriId) =>{
      try{
        const response = await apiClient.get(`/api/profile/ctri/${ctriId}&email=${email}`);
        console.log("CTRI API response in service:", response.data);
        return response.data;
      }catch(error){
        console.error("Error fetching CTRI data:", error.message);
        throw error;
      }

    },
    overview: async (profileId) => {
      try {
        const response = await apiClient.get(
          `/api/profile/${profileId}/overview?email=${email}`
        );
        console.log("Overview API response in service:", response.data);
        if(response.data.encrypted){
          console.log("overview encrypted logged")
          
          const decryptedData = await decryptionHelper.decryptResponse(response.data.data)
          console.log("decrypted data", decryptedData.data);
          return await  decryptedData.data.data;
  
        }else{
          return await response.data;
        }
      } catch (error) {
        console.error("Error fetching overview:", error.message);
        throw error;
      }
    },
    congress: async () => {
      try {
        const response = await apiClient.get(`api/profile/congress?email=${email}`);

        if(response.data.encrypted){
          console.log("yes iam encrypted")
          
          const decryptedData = await decryptionHelper.decryptResponse(response.data.data)
          console.log("decrypted data", decryptedData.data);
          return await  decryptedData.data;
  
        }else{
          return await response.data;
        }
      } catch (error) {
        console.error("Error fetching congress data:", error.message);
        throw error;
      }
    },
    digital: async (profileId) => {
      try {
        const response = await apiClient.get(
          `/api/profile/${profileId}/digital`
        );
        if(response.data.encrypted){
          console.log("yes iam encrypted")
          
          const decryptedData = await decryptionHelper.decryptResponse(response.data.data)
          console.log("decrypted data", decryptedData.data);
          return await  decryptedData.data;
  
        }else{
          return await response.data;
        }
      } catch (error) {
        console.error("Error fetching digital data:", error.message);
        throw error;
      }
    },
    twitter: async (profileId) => {
      try {
        const response = await apiClient.get(
          `/api/profile/${profileId}/twitter?email=${email}`
        );
        if(response.data.encrypted){
          console.log("yes iam encrypted")
          
          const decryptedData = await decryptionHelper.decryptResponse(response.data.data)
          console.log("decrypted data", decryptedData.data);
          return await  decryptedData.data;
  
        }else{
          return await response.data;
        }
      } catch (error) {
        console.error("Error fetching Twitter data:", error.message);
        throw error;
      }
    },

    newsFeed: async () => {
      try {
        const response = await apiClient.get(`/live-search?email=${email}`);
        if(response.data.encrypted){
          console.log("yes iam encrypted")
          
          const decryptedData = await decryptionHelper.decryptResponse(response.data.data)
          console.log("decrypted data in live search ", decryptedData.data);
          return await  decryptedData.data;
  
        }else{
          return await response.data;
        }
      } catch (error) {
        console.error("Error fetching congress data:", error.message);
        throw error;
      }
    },
    doctorCongressData: async (profileId) => {
      try {
        const response = await apiClient.get(
          `/api/profile/${profileId}/congress?email=${email}`
        );
        if(response.data.encrypted){
          console.log("yes iam encrypted")
          const decryptedData = await decryptionHelper.decryptResponse(response.data.data)
          console.log("decrypted data", decryptedData.data);
          return decryptedData.data;
  
        }else{
          return await response.data;
        }
        // return response.data;
      } catch (error) {
        console.error("Error fetching congress data:", error.message);
        throw error;
      }
    },
    generateCV : async (profileId) =>{
      try{
        const response = await apiClient.get(`/api/profile/${profileId}/generateCV?email=${email}`);
        console.log("api response for generate cv data in the api.js",response.data)
        return response
      }catch(error){
        console.error("Error fectching the data",error.message);
        throw error;
      }
    }
  },
};

export const favoritesApi = {
  getFavorites: async () => {
    try {
      const response = await apiClient.get(`/api/favorites?email=${email}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching favorites:", error.message);
      throw error;
    }
  },

  addFavorites: async (doctorIds, groupId, isGroupCreated) => {
    try {
      const response = await apiClient.post(`/api/favorites?email=${email}`, {
        doctor_ids: doctorIds,
        // group_id: isGroupCreated ? groupId : null, // Include group_id only if group is created
      });
      return response.data;
    } catch (error) {
      console.error("Error adding to favorites:", error.message);
      throw error;
    }
  },

  removeFavorites: async (doctorIds) => {
    try {
      const response = await apiClient.delete(`/api/favorites?email=${email}`, 
        {
          headers: { 'Content-Type': 'application/json' },
          data: { doctor_ids: doctorIds },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error removing from favorites:", error.message);
      throw error;
    }
  },

  getGroups: async () => {
    try {
      const response = await apiClient.get(`/api/group_names?email=${email}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching groups:", error.message);
      throw error;
    }
  },
  getGroupDoctors: async (groupName) => {
    try{
      const response = await apiClient.get(`/api/groups/${groupName}&email=${email}`)
      return response.data

    }catch(e){
      console.error("Error fetching group doctors:", error.message);
      // throw error;
    }
  },

  createGroup: async (name, doctorIds) => {
    try {
      const response = await apiClient.post(`/api/groups?email=${email}`, {doctor_ids: doctorIds,group_id: name });
      return response.data;
    } catch (error) {
      console.error("Error creating group:", error.message);
      throw error;
    }
  },
  removeGroupDoctors: async (name,doctorIds)=>{
    try {
      const response = await apiClient.delete(`/api/groups/${name}&email=${email}`,      {
        headers: { 'Content-Type': 'application/json' },
        data: { doctor_ids: doctorIds },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating group:", error.message);
      throw error;
    }
  },

  updateGroup: async (groupId, data) => {
    try {
      const response = await apiClient.put(`api/groups/${groupId}&email=${email}`, {
        group_name:data
      });
      return response.data;
    } catch (error) {
      console.error("Error updating group:", error.message);
      throw error;
    }
  },

  deleteGroup: async (groupId) => {
    try {
      const response = await apiClient.delete(`api/groups/${groupId}/remove?email=${email}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting group:", error.message);
      throw error;
    }
  },
  addExpertsToGroup: async (doctorIds,groupId) => {
    try{
      const response = await apiClient.post(`/api/groups/addExperts?email=${email}`,{
        doctor_ids:doctorIds,
        group_id:groupId
      })
    
      return response.data
    }catch(error){
      console.error("Error adding experts to the group", error.message)
      throw error
    }
  }
};

export const hospitalApiService = {
  hospital: {
    getAllHCOProfiles: async () => {
      const response = await apiClient.get("/api/hco/parentProfiles?email=${email}");
      return await response.data;
    },
    getAllHCOBranches:async (id)=>{
      const response = await apiClient.get(`/api/hco/parentProfiles/${id}&email=${email}`);
      return await response.data;

    },
    getHCOProfileById: async (id) => {
      const response = await apiClient.get(`/api/hco/profile/${id}&email=${email}`);
      return await response.data;
    },
    getHCOPeopleData: async (id) => {
      const response = await apiClient.get(`/api/hco/people/${id}&email=${email}`);
      return await response.data;
    },
    getHCODigitalData: async (id) => {
      try {
        const response = await apiClient.get(`/api/hco/${id}/digital?email=${email}`);
        return response.data;
      } catch (error) {
        console.error("Error fetching HCO digital data:", error.message);
        throw error;
      }
    },
    getHCOTwitterData: async (id) => {
      try {
        const response = await apiClient.get(`/api/hco/${id}/twitter?email=${email}`);
        return response.data;
      } catch (error) {
        console.error("Error fetching HCO digital data:", error.message);
        throw error;
      }
    },
    getHCOProfileDocuments: async (id) => {
      try {
        const response = await apiClient.get(`/api/hco/${id}/documents?email=${email}`);
        return response.data;
      } catch (error) {
        console.error("Error fetching HCO documents data:", error.message);
        throw error;
      }
    },
    getclinicalDocumentsByID: async (id, nctId) => {
      try {
        console.log(
          "Fetching clinical documents for HCO ID in api.js:",
          id,
          "and NCT ID:",
          nctId
        );
        const response = await apiClient.get(
          `/api/hco/${id}/clinical-trails/${nctId}&email=${email}`
        );
        return response.data;
      } catch (error) {
        // Enhanced error logging
        console.error("Error Details:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          config: error.config,
        });
        throw error;
      }
    },
    getHomeSearchData: async (searchTerm) => {
      try {
        const response = await apiClient.get(
          `/api/hco/search?search=${searchTerm}&email=${email}`
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching HCO home search data:", error.message);
        throw error;
      }
    },
  },
};

export default apiService;


// I want some changes in this dashboard given below
// I should be able to see all the chart data in table format and vise versa.
// I want more detailed analysis based on the ppt provided, I want whatever data I am fetching form db we can paas it to the ollama api and we cam refine the results in more detail.
// Use Below api
//         curl_command = [
//             "curl", "-s", "-X", "POST", "https://ollama.com/api/chat",
//             "-H", "Authorization: Bearer f8db447ca1244b7cbd24ef57d0a5d0ac.YTvI-pVSXYDLyxiWywB4QfOb",
//             "-H", "Content-Type: application/json",
//             "-H", "Cookie: aid=ba14a101-09b7-4628-8369-ce2808cbc8b7",
//             "-d", json.dumps({
//                 "model": "deepseek-v3.1:671b",
//                 "messages": [{"role": "user", "content": instruction}],
//                 "stream": False
//             })
//         ] 
// Create  its backend also add db connection as well credentials are below
// mongodb+srv://vasudeva:ommN1EMg2KsURyPQ@cluster0.n3ejr.mongodb.net/
// Database name : SML 
// collection name : sampletest 


// 2. Add Sidebar for multipage aplication also include filter based on country, attribute and stakeholder wise 

