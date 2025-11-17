import React, { useState, useEffect } from "react";
import { hospitalApiService } from "../../services/api";
import { FaLocationDot } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import HCOHeader from '../../Components/Hospitals/HCOHeader'
import { getAssetPath } from '../../utils/imageUtils';

const HCOHospitalsPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [HospitalsProfileData, setHospitalsProfileData] = useState([]);
  
  const navigate = useNavigate()

  useEffect(() => {
    const fetchHospitalProfileData = async () => {
      try {
        const response = await hospitalApiService.hospital.getAllHCOProfiles();
        console.log("Hospitals profiles", response.data);

        setHospitalsProfileData(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch hospital data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchHospitalProfileData();
  }, []);

  const handleProfileClick = (Parent_HCO_Record_Id) => {
    navigate(`/branches/${Parent_HCO_Record_Id}`);
  }

  

  // if (isLoading) return <div className="flex justify-center items-center">Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
    <HCOHeader />
   
    <div className="flex flex-col justify-center gap-4 m-20">
      <h1 className="text-xl font-medium">Explore Hospitals Profiles</h1>
      {isLoading ? <p className="flex justify-center items-center text-[#800080] font-semibold">Loading...</p> : (
      <div className="grid grid-cols-3 gap-x-6">
        { Array.isArray(HospitalsProfileData) &&
        HospitalsProfileData.length > 0 ? (
          HospitalsProfileData.filter(profile => profile.Parent_HCO_Name && profile.Parent_HCO_Name.trim() !== "").map((profile, index) => (
            <div 
            key={index} 
            className="flex items-center gap-10 my-6 border rounded-md border-gray-200 p-4 cursor-pointer"
            onClick={() => handleProfileClick(profile.Parent_HCO_Record_Id)}
            >
              <img
                src={profile.Image_Url || getAssetPath('hospitalLogo1.png')}
                alt="hospital-logo"
                className="rounded-full  border border-gray-100 h-20 w-20 object-contain"
              />
              <div className="flex flex-col gap-2">
                <h1 className="text-lg">{profile.Parent_HCO_Name}</h1>
                {/* <p><span className="bg-[#800080] text-white text-xs font-semibold px-2 py-0.5 rounded-md mr-2">1</span>Branch</p> */}
              </div>
            </div>
          ))
        ) : (
          <div>No hospital profiles found</div>
        )}
      </div>
  )}
    </div>
    </>
  );
};

export default HCOHospitalsPage;
