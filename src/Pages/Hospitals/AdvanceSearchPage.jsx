import React,{useState, useEffect,useRef} from 'react'
import { getAssetPath } from '../../utils/imageUtils';
import { useHCODoctorsData } from '../../Context/HCODoctorsDataContext'
import HCOHeader from '../../Components/Hospitals/HCOHeader'

const tabs = ['People','Accounts']

const hospitalNames = [
    "Tata Memorial Hospital",
    "All India Institute of Medical Sciences (AIIMS)",
    "Adyar Cancer Institute (WIA)",
    "Rajiv Gandhi Cancer Institute and Research Centre",
    "Apollo Cancer Centres",
    "Max Institute of Cancer Care",
    "Fortis Memorial Research Institute",
    "HCG Cancer Centre",
    "KIDWAI Memorial Institute of Oncology",
    "Dharamshila Narayana Superspeciality Hospital",
    "Shalby Hospitals",
    "Yatharth Hospital",
    "kovai Medical(KMCH)",
    "Aster DM Health",
    "KIMS Hospitals",
    "Asarfi Hospital",
    "Rainbow Hospitals"
  ];

const AdvanceSearchPage = () => {
  const { hcoDoctorsData } = useHCODoctorsData();
  const [activeTab, setActiveTab] = useState('People');
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null); 

//   console.log('Advance Search Page Data:', hcoDoctorsData);

// Handle input change
const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Filter suggestions based on input
    if (value.trim()) {
      const filtered = hospitalNames.filter(hospital =>
        hospital.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    // Filter your data here based on selection
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  return (
    <div className='overflow-x-hidden'>
        <HCOHeader />
        <div className='flex  gap-4 w-full m-10 '>

            {/*Filter Section */}
            <div className='w-[25%] p-2 border border-gray-200 rounded-md h-screen'>
                <h2 className='p-4 text-xl font-medium '>Filters</h2>
                <div className="flex flex-col gap-4 p-4">
                    <label className="flex flex-col relative">
                        <span className="mb-2">Account</span>
                        <input type="text" 
                        placeholder="Search for Accounts" 
                        className="border p-2 rounded border-gray-400"
                        value={searchTerm}
                        onChange={handleSearchChange} 
                        />
                        {/* Suggestions dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div
                            ref={suggestionsRef}
                            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto"
                            >
                            {suggestions.map((suggestion, index) => (
                                <div
                                key={index}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSuggestionClick(suggestion)}
                                >
                                {suggestion}
                                </div>
                            ))}
                            </div>
                        )}
                        
                    </label>
                    <label className="flex flex-col">
                        <span className="mb-2">Location</span>
                        <input type="text" placeholder="Search for Location" className="border p-2 rounded border-gray-400" />
                    </label>
                    <label className="flex flex-col">
                        <span className="mb-2">Scientific</span>
                        <input type="search" placeholder="Search for Scientific" className="border p-2 rounded border-gray-400" />
                    </label>
                    <label className="flex flex-col">
                        <span className="mb-2">Committee</span>
                        <input type="text" placeholder="Search for Committess" className="border p-2 rounded border-gray-400" />
                    </label>
                    <label className="flex flex-col">
                        <span className="mb-2">Designation</span>
                        <select name="Select Designation" className="border p-2 rounded border-gray-400 cursor-pointer ">
                            <option value="" disabled className='bg-gray-100'>Select Designation</option>
                            <option value="hospital" className='bg-gray-100'>Heads of Departments</option>
                            <option value="clinic" className='bg-gray-100'>Medical Directors</option>
                            <option value="pharmacy" className='bg-gray-100'>Doctors/Consultants</option>
                         </select>
                    </label>
                </div>
            </div>

            {/* Advance Search Page Content */}
            <div className="flex flex-col ml-10  h-screen w-[70%]">
                
                {/*tabs */}
                <div className='flex items-center gap-4'>
                    {tabs.map((tab,index)=>(
                        <button 
                            key={index} 
                            className={`p-2  text-center  ${activeTab === tab ? ' border-b-3 border-[#800080] text-black' : ' text-black'}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>

                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'People' && (
                    Array.isArray(hcoDoctorsData) && hcoDoctorsData.length > 0 ?
                        hcoDoctorsData.map((Profile,index)=>(
                
                           <div className='border border-gray-200 rounded-md mt-2' key={index}>
                           <div className="flex items-center gap-2 p-5">
                                <input type="checkbox"
                                  className="w-4 h-4 rounded-md mr-2 accent-fuchsia-700 cursor-pointer"/>
                          
                                <img
                                   src={Profile.Profile_Pic_Link === 'NaN'
                                    ? getAssetPath('profileImg1.png')
                                    : Profile.Profile_Pic_Link
                                  }
                                  alt="profile"
                                  className="w-15 h-15 rounded-full"
                                />
                                <div className="flex flex-col">
                                  <div className="flex flex-col items-start ">
                                    <p className="text-[#800080] font-semibold text-lg hover:underline cursor-pointer">
                                      {Profile.Full_Name}
                                    </p>
                                    <p className='text-sm font-medium mb-1'>{Profile.HCP_speciality1}</p>
                                    <p className='text-sm text-gray-500 font-medium mb-1'>{Profile.HCO_Name}</p>
                                    {/* <div className="flex items-center gap-2">
                                      <p className='border border-gray-400 rounded-md p-1'>Haemato-oncology, Lymphoma</p>
                                      <p className='border border-gray-400 rounded-md p-1'>Medical Oncology</p>
                                    </div> */}
                                    
                                  </div>
                  
                                  
                                </div>
                            </div>
                            
                      </div>
                        )) :(<div>No data available</div>)
                )}
                
                
            </div>
        </div>
    </div>
  )
}

export default AdvanceSearchPage