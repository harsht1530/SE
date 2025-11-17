import React,{useRef,useEffect, useState, use} from 'react'
import { useNavigate } from "react-router-dom";
import {hospitalApiService} from '../../services/api';
import { getAssetPath } from '../../utils/imageUtils';

const HCOHomeSearch = ({ searchTerm, onClose }) => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true); 

  const searchContainerRef = useRef(null);
  // console.log("HCOHomeSearch component rendered with searchTerm:", searchTerm);


  // Effect to close the modal when clicking outside
    useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Function to fetch HCOs based on search term
  const fetchHCOs = async (searchTerm) => {
    setLoading(true);
    try {
      const response = await hospitalApiService.hospital.getHomeSearchData(searchTerm);
      console.log("Search results:", response.results);
      setSearchResults(response.results);
    
    } catch (error) {
      console.error("Error fetching HCOs:", error);
    } finally {
      setLoading(false);
    }
  }

  // Effect to fetch HCOs when searchTerm changes
  useEffect(() => {
  if (!searchTerm) {
    setSearchResults([]);
    setLoading(false);
    return;
  }

  setLoading(true);
  const handler = setTimeout(() => {
    fetchHCOs(searchTerm);
  }, 400); // 400ms debounce

  return () => {
    clearTimeout(handler);
  };
}, [searchTerm]);

  // Function to handle hospital click
const handleHospitalClick = (hcoId) => {
    navigate(`/profile/${hcoId}`)
    onClose(); // Close the modal after navigating
  };



  return (
    <div  ref={searchContainerRef} onClick={(e) => e.stopPropagation()}>
      
      <div className="bg-white rounded-lg p-4 max-h-96 overflow-y-auto">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : !searchTerm ? (
          <p className="text-gray-500">Search for hospitals...</p>
        ) : searchResults.length > 0 ? (
          searchResults.map((hco, index) => (
            <div 
            key={index} 
            className="flex items-center gap-4 p-2 hover:bg-gray-200 hover:rounded-md cursor-pointer"
            onClick={() => handleHospitalClick(hco.HCO_Record_Id)}
            >
              <img
                src={hco.Image_Url || getAssetPath('hospitalLogo4.png')}
                alt={hco.Name}
                className="w-12 h-12 border border-gray-100 rounded-full object-contain"
              />
              <div>
                <h3 className="">{hco.HCO_Name}</h3>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No results found</p>
        )}
      </div>
    </div>
      
  )
}

export default HCOHomeSearch