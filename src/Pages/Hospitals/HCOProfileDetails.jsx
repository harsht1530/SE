import React,{useState,useEffect} from 'react'
import { CiLocationOn } from "react-icons/ci";
import { MdOutlineMail } from "react-icons/md";
import { LuBarcode } from "react-icons/lu";
import { BsTwitterX } from "react-icons/bs";
import { FaGlobe } from "react-icons/fa";
import {
  FaLinkedin,
  FaFacebookF,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa";
import { SlStar } from "react-icons/sl";
import { getAssetPath } from '../../utils/imageUtils';
import {hospitalApiService} from '../../services/api';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../../utils/HCOFavouritesDoctorsSlice';
import HCOShimmerEffect from '../../Components/Hospitals/HCOShimmerEffect'  


const HCOProfileDetails = ({hcoProfile, loading}) => {
  const dispatch = useDispatch();
  const favoriteBranches = useSelector(state => state.hcoFavorites.favoriteBranches);

  const isFavorite = (profile) => {
    return favoriteBranches.some(fav => fav.HCO_Record_Id === profile.HCO_Record_Id);
  }

  const handleAddToFavorites = (profile) => {
    if (!isFavorite(profile)) {
      dispatch(addFavorite(profile));
    }
  }
    
  return (

    <div >
      {loading ? (<HCOShimmerEffect type="HCOProfile"/>) : (
        <>
        {hcoProfile && ( hcoProfile.map((profile,index) => (
        <div key={index} className="w-full flex   gap-10 p-10">
        <div className="flex flex-col gap-4 cursor-pointer">
        {/* {profile.image ? ( <img
          src={getAssetPath('hospitalLogo1.png')}
          className="rounded-full h-50 w-50 object-cover"
          alt="hospital logo"
          loading="lazy"
        />) :( <img
          src={getAssetPath('profileImg1.png')}
          className="rounded-full h-50 w-50 object-cover"
          alt="hospital logo"
          loading="lazy"
        />)} */}
        <img
          src={profile.Image_Url || getAssetPath('hospitalLogo1.png')}
          className="rounded-full h-45 w-54 object-contain border border-gray-200"
          alt="hospital logo"
          loading="lazy"
        />
        <div className="flex justify-between gap-2 bg-[#800080] text-white p-3 rounded-md">
          
          {profile.HCO_Facebook && <a href={profile.HCO_Facebook} target="_blank" rel="noopener noreferrer" className=""><FaFacebookF size={20} aria-label="Facebook" /></a>}
          {profile.HCO_Instagram && <a href={profile.HCO_Instagram} target="_blank" rel="noopener noreferrer" className=""><FaInstagram size={20} aria-label="Instagram" /></a>}
          {profile.HCO_Youtube && <a href={profile.HCO_Youtube} target="_blank" rel="noopener noreferrer" className=""><FaYoutube size={23} aria-label="YouTube" /></a>}
          {profile.HCO_Twitter && <a href={profile.HCO_Twitter} target="_blank" rel="noopener noreferrer" className=""><BsTwitterX size={20} aria-label="Twitter" /></a>}
          {profile.HCO_LinkedIn && <a href={profile.HCO_LinkedIn} target="_blank" rel="noopener noreferrer" className=""><FaLinkedin size={20} aria-label="LinkedIn" /></a>}
        </div>
      </div>
  
      <div className="w-full flex flex-col mt-10">
        {/* Profile header */}
        <div className="flex  justify-between">
          <h1 className="text-xl font-medium text-black">
            {profile.HCO_Name ? profile.HCO_Name : "Name not available"}
          </h1>
          <div className="flex gap-2 mb-2">
            
            <button 
              className="text-white bg-[#800080] button rounded-md flex items-center gap-2"
              aria-label="Add to segment"
              onClick = {() => handleAddToFavorites(profile)}
              disabled = {isFavorite(profile)}
            >
              <SlStar />
              {isFavorite(profile) ? 'ADDED TO FAVORITES' : 'ADD TO SEGMENT'}
            </button>
            {/* <button 
              className="bg-transparent border border-[#0B6DA4] button shadow-md"
              aria-label="More options"
            >
              MORE
            </button> */}
          </div>
        </div>
        
        <hr className="text-gray-400" />
        
        {/* Profile details */}
        <div className="mt-2">
          {/* <p className="text-[#696969]">
            {"Institution not available"}
          </p>
          <p className="text-[#545454]">{ "Specialty not available"}</p>*/}
          {/* <p className="text-[#545454]">Medanta- The Medicity is a multi-specialty medical institute rewoned for robotic sugery, organ transplants, neurology,cardiology and oncology.it is NABH and JCI accredited, with cutting-edge research facilities and over 50 specialites.</p>  */}
          
          <div className="flex items-center gap-2 mt-2">
            <a 
            href={`https://www.google.com/maps?q=${profile["Latitude"]},${profile["Longitude"]}`}
            target='_blank'
            ><CiLocationOn size={20} className="text-[#800080]" aria-hidden="true" /></a>
            <p className="">
              {/* Sector 38, Gurugram, Harayana, India */}
              {profile.Address ? profile.Address : "Address not available"}
            </p>
          </div>
          
          <div className="flex w-full gap-6 mt-3 cursor-pointer">
            <div className="flex items-center gap-2">
              <MdOutlineMail size={20} className="text-[#545454]" aria-hidden="true" />
              <a
                href={`mailto:${ "email@example.com"}`}
                className="text-gray-700 hover:underline"
              >
                {profile.HCO_Email ? profile.HCO_Email : "N/A"}
              </a>
            </div>
            
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[#545454]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span className="text-[#545454]">
                {profile.HCO_Phone ? profile.HCO_Phone : "N/A"}  
              </span>
            </div>
            
            {/* <div className="flex items-center gap-2 w-full">
              <FaGlobe  size={20} className="text-[#545454]" aria-hidden="true" />
              <a
                href={profile.HCO_Website ? profile.HCO_Website : "#"}
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Website"
              >
                {profile.HCO_Website ? profile.HCO_Website : "N/A"} 
              </a>
            </div> */}
          </div>
          <div className="flex items-center mt-2 gap-2 w-full">
              <FaGlobe  size={20} className="text-[#545454]" aria-hidden="true" />
              <a
                href={profile.HCO_Website ? profile.HCO_Website : "#"}
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Website"
              >
                {profile.HCO_Website ? profile.HCO_Website : "N/A"} 
              </a>
            </div>
  
          {/* <button className="global-reach-button">
            GLOBAL REACH
          </button> */}
        </div>
      </div>
      </div>
      ))

      )}
        </>
      )}
  </div>
  )
}

export default HCOProfileDetails





// const [hcoProfile, setHcoProfile] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const { id } = useParams();

//   useEffect(() => {
//     const fetchData = async () => {
//         try {
//             const response = await hospitalApiService.hospital.getHCOProfileById(id);
//             console.log("HCO Profiles response:", response.data);
//             setHcoProfile([response.data]);
//         } catch (error) {
//             console.error("Error fetching HCO Profiles:", error);
//         }finally{
//             setLoading(false);
//         }
//     };

//     fetchData();
// }, []);