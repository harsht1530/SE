import React, {useState,useEffect} from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAssetPath } from '../../utils/imageUtils';
import HCOHeader from '../../Components/Hospitals/HCOHeader';
import { FaLocationDot } from "react-icons/fa6";
import { SlStar } from "react-icons/sl";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { hospitalApiService } from "../../services/api";
import { set } from 'lodash';
import { addFavorite, removeFavorite } from '../../utils/HCOFavouritesDoctorsSlice';

const HCOHospitalsBranchesPages = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [branchesData, setBranchesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBranches, setSelectedBranches] = useState([]);

    const selectedBranchesData = useSelector(state => state.hcoFavorites.favoriteBranches);

    const handleAddToFavorites = () => {
      if (selectedBranches.length >=1) {

        selectedBranches.forEach(branch => {
          dispatch(addFavorite(branch));
        });

        toast.success("Selected branches addded to favorites!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setSelectedBranches([]);
    }
      console.log("Selected branches:", selectedBranchesData);
    }

    useEffect(() => {
        const fetchBranchesData = async () => {
            setLoading(true);
            try {
                const response = await hospitalApiService.hospital.getAllHCOBranches(id);
                console.log("Branches data", response.data);
                setBranchesData(response.data);
            }
            catch (error) {
                console.error("Error fetching branches data:", error);
            }finally {
                setLoading(false);
            }
        };
        fetchBranchesData();
    }, []);

    const handleCheckboxChange = (e, profile) => {
        if (e.target.checked) {
            setSelectedBranches([...selectedBranches, profile]);
            // dispatch(addFavorite(profile));
        }
        else {
            // dispatch(removeFavorite(profile.HCO_Record_Id));
            setSelectedBranches(selectedBranches.filter(p => p.HCO_Record_Id !== profile.HCO_Record_Id));
        }
    };

    const handleProfileClick = (HCO_Record_Id) => {
    navigate(`/profile/${HCO_Record_Id}`);
  }
  return (
    <div>
         <HCOHeader />
         <ToastContainer />
          <div className="flex flex-col justify-center gap-4 m-20">
               <div className='flex justify-between items-center mb-4'>
                   <h1 className="text-xl font-medium">Hospital Network Branches</h1>
                    <button
                    className="text-white bg-[#800080] rounded-md flex items-center gap-2 px-4 py-2 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-purple-700 hover:shadow-lg"
                    aria-label="Add to segment"
                    onClick={() => handleAddToFavorites()}
                    disabled={selectedBranches.length === 0}
                  >
                    <SlStar className="transition-transform duration-300 group-hover:rotate-12" />
                    <span className="transition-colors duration-300">ADD TO SEGMENT</span>
                  </button>

               </div>
               
               <div className="grid grid-cols-3 gap-x-6">
                 {loading ? (
                        <div className="flex justify-center items-center w-full col-span-3 py-10">
                            <div className="dotted-spinner"></div>
                            <span className="ml-4 text-[#800080] font-medium">Loading data...</span>
                        </div>
                    ) : Array.isArray(branchesData) &&
                 branchesData.length > 0 ? (
                   branchesData.map((profile, index) => (
                     <div 
                     key={index} 
                     className="w-full flex items-center gap-5 my-6 border border-gray-200 rounded-md p-4 cursor-pointer"
                     
                     > 
                      <div className='flex items-center gap-2 w-[30%]'>
                       <input type="checkbox" onChange={(e) => handleCheckboxChange(e, profile)} className='w-4 h-4 cursor-pointer accent-[#800080]'/>
                       <img
                         src={profile.Image_Url || getAssetPath('hospitalLogo3.png')}
                         alt="hospital-logo"
                         className="rounded-full border border-gray-100 h-20 w-20 object-contain"
                       />
                       </div>
                       <div className="flex flex-col gap-2 w-[70%]">
                         <h1 className="text-lg" onClick={() => handleProfileClick(profile.HCO_Record_Id)}>{profile.HCO_Name}</h1>
                         <p className="flex items-center gap-2 text-gray-500"><FaLocationDot />{profile.City}</p>
                       </div>
                     </div>
                   ))
                 ) : (
                   <div>No hospital profiles found</div>
                 )}
               </div>
             </div>
    </div>
  )
}

export default HCOHospitalsBranchesPages