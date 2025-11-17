import React, { useRef, useEffect, useState, useCallback } from "react";
import apiService from "../services/api";
import { Suspense,lazy } from "react";
import { useNavigate } from "react-router-dom";
const CongressPage =  lazy(() => import("../Pages/CongressPage"));
import HomeSearchCongressPage from "./HomeSearchCongressPage";
const ScientificContentTab = lazy(() => import("./scientificcontenttab"));
import TabNavigation from "./TabNavigation";
import { FixedSizeList as List } from "react-window";
import HomeSearchScientificContent from "./HomeSearchScientificContent";
import { getAssetPath } from '../utils/imageUtils';
import CryptoJS from "crypto-js"
import ShimmerEffect from "./ShimmerEffect";


/**
 * @component SearchModal
 * @description A modal component that provides real-time search functionality across different categories
 * including people, congresses, and scientific content. Features debounced search and virtualized list rendering.
 * 
 * @param {Object} props
 * @param {string} props.searchTerm - The current search query string
 * @param {Function} props.onClose - Callback function to close the modal
 * 
 * @state
 * @property {string} activeTab - Current active tab ('PEOPLE', 'CONGRESSES', 'SCIENTIFIC CONTENT')
 * @property {Array} profiles - List of healthcare professional profiles matching the search
 * @property {Array} congressData - Congress-related search results
 * @property {Array} publicationsData - Scientific publications matching the search
 * @property {boolean} loading - Loading state during search operations
 * 
 * @hooks
 * - useRef: For modal container reference and click outside detection
 * - useEffect: For search debouncing and click outside handling
 * - useNavigate: For profile navigation
 * 
 * @subcomponents
 * - ProfileItem: Renders individual profile items in virtualized list
 * - CongressPage: Displays congress search results
 * - ScientificContentTab: Shows scientific content results
 * 
 * @features
 * - Debounced search (500ms delay)
 * - Click outside to close
 * - Virtualized list rendering for performance
 * - Tab-based content organization
 * - Real-time API search integration
 * 
 * @api
 * - apiService.profiles.mainSearch: Fetches search results across all categories
 *   Returns: {
 *     doctor_profiles: Array,
 *     congress_data: Array,
 *     pubmed_articles: Array
 *   }
 * 
 * @performance
 * - Uses react-window for efficient list rendering
 * - Implements debouncing for search API calls
 * - Lazy loading of tab contents
 * 
 * @example
 * ```jsx
 * <SearchModal 
 *   searchTerm="oncology"
 *   onClose={() => setModalOpen(false)}
 * />
 * ```
 * 
 * @returns {JSX.Element} A modal dialog with search functionality and results display
 */
const SearchModal = ({ searchTerm, onClose }) => {
  console.log("searchTerm", searchTerm);
  const modalRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);
  // const inputRef = useRef(null);
  const [profiles, setProfiles] = useState([]);
  const [congressData, setCongressData] = useState([]);
  const [publicationsData, setPublicationsData] = useState([]);
  const [loading,setLoading] =  useState(false);
  const recordIdSecret = import.meta.env.VITE_RECORDID_SECRET
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // get the profiles data for people
  const searchProfiles = async () => {
    try {
      const params = {
        search: searchTerm,
      };
      const searchResults = await apiService.profiles.mainSearch(params);

      return searchResults;
    } catch (error) {
      console.log("error", error);
    }
  };

  // useEffect(() =>{
  //   async function fetchData(){
  //     try{
  //       const response = await searchProfiles(searchTerm)
  //     const data = response.data;
  //     console.log(data["doctor_profiles"]);
  //     setProfiles(Array.isArray(data["doctor_profiles"])?data.doctor_profiles:[]);

  //     }catch(error){
  //       console.log("error",error);
  //     }

  //   }
  //   fetchData();
  // },[searchTerm])
  console.log("profiles", profiles);
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      const trimmed = searchTerm.trim();
      if (!trimmed) {
        // If no search term, reset to PEOPLE tab and clear results
        setActiveTab(0);
        setProfiles([]);
        setCongressData([]);
        setPublicationsData([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const params = { search: trimmed };
        const data = await apiService.profiles.mainSearch(params);
        console.log("data", data);
        setLoading(false);
        setProfiles(
          Array.isArray(data["doctor_profiles"]) ? data.doctor_profiles : []
        );
        setCongressData(
          Array.isArray(data["congress_data"]) ? data.congress_data : []
        );
        setPublicationsData(
          Array.isArray(data["pubmed_articles"]) ? data.pubmed_articles : []
        );
        console.log("publicationsData in modal", publicationsData);

        // Automatically switch to the tab with results
      if (Array.isArray(data["doctor_profiles"]) && data["doctor_profiles"].length > 0) {
        setActiveTab(0); // Switch to "PEOPLE" tab
      } else if (Array.isArray(data["congress_data"]) && data["congress_data"].length > 0) {
        setActiveTab(1); // Switch to "CONGRESSES" tab
      } else if (Array.isArray(data["pubmed_articles"]) && data["pubmed_articles"].length > 0) {
        setActiveTab(2); // Switch to "SCIENTIFIC CONTENT" tab
      }

      } catch (error) {
        console.log("error", error);
        setProfiles([]);
        setCongressData([])
        setPublicationsData([])
      }finally{
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const ProfileItem = ({ index, style }) => {
    const profile = profiles[index];
    // const navigate = useNavigate();
    const handleProfileClick = useCallback(
      (recordId) => {
        const encryptedRecordId = CryptoJS.AES.encrypt(recordId,recordIdSecret).toString();
        const encodedProfileId = encodeURIComponent(encryptedRecordId);

        navigate(`/profile/${encodedProfileId}`);
        onClose()
      },
      [navigate]
    );
    return (
      <div style={style} className="border-b border-gray-200 last:border-b-0">
        <div className="flex items-center gap-2 p-5 my-auto">
          {/* <input
                    type="checkbox"
                    className="w-4 h-4 rounded-md mr-2 accent-fuchsia-700"
                    checked={selectedProfiles.some(
                        (p) => p.Record_Id === profile.Record_Id
                    )}
                    onChange={() => handleProfileSelect(profile)}
                /> */}
          <img
                        src={profile["Profile_Pic_Link"] && profile["Profile_Pic_Link"] !== "NaN" ? profile["Profile_Pic_Link"] : getAssetPath('profileImg1.png')}
                        alt="profile"
                        className="w-15 h-15 rounded-full"
                    />
          <div className="flex flex-col">
            <div className="flex items-center gap-8">
              <p
                onClick={() => handleProfileClick(profile.Record_Id)}
                className="text-[#800080] font-semibold text-lg hover:underline cursor-pointer"
              >
                {profile.Full_Name},{" "}
                {profile["Degree_1"] !== "NaN" && profile["Degree_1"]}{" "}
                {profile["Degree_2"] !== "NaN" && profile["Degree_2"]}{" "}
                {profile["Degree_3"] !== "NaN" && profile["Degree_3"]}
              </p>

              {/* <p className="text-[#8C7B2B] font-bold text-lg">
                            ||||||||||
                        </p> */}
            </div>

            {profile.Clinic_Name_1 !== "NaN" && (
              <p className="text-[#696969]">{profile.Clinic_Name_1}</p>
            )}
            {profile["HCP_Speciality_1"] !== "NaN" && (
              <p className="text-[#545454]">{profile["HCP_Speciality_1"]}</p>
            )}
          </div>
        </div>
      </div>
    );
  };
  const tabs = [
    "SCIENTIFIC EXPERTS",
    "CONGRESSES", 
    "SCIENTIFIC CONTENT"
  ];

  const handleTabChange = useCallback((index) => {
    console.log('Tab changed to:', tabs[index], index);
    setActiveTab(index);
  }, []);
  return (
    <div>
      <div ref={modalRef} onClick={(e) => e.stopPropagation()} >
        {/* Navigation Pills */}
        {/* <div className="border-b ">
          <div className="flex gap-4 ">
            <button
              className={`px-4 mb-3 py-2 ${
                activeTab === "PEOPLE"
                    ? "text-[#800080] border-b-2 border-[#800080]"
                  : "text-gray-600 "
              }`}
              onClick={() => setActiveTab("PEOPLE")}
            >
              PEOPLE
            </button>
            <button
              className={`px-4 mb-3 py-2 ${
                activeTab === "CONGRESSES"
                   ? "text-[#800080] border-b-2 border-[#800080]"
                  : "text-gray-600 "
              }`}
              onClick={() => setActiveTab("CONGRESSES")}
            >
              CONGRESSES
            </button>
            <button
              className={`px-4 mb-3 py-2 ${
                activeTab === "SCIENTIFIC CONTENT"
                  ? "text-[#800080] border-b-2 border-[#800080]"
                  : "text-gray-600 "
              }`}
              onClick={() => setActiveTab("SCIENTIFIC CONTENT")}
            >
              SCIENTIFIC CONTENT
            </button>
            {/* <button
              className={`px-4 mb-3 py-2 ${activeTab === 'ASSOCIATIONS' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
              onClick={() => setActiveTab('ASSOCIATIONS')}
            >
              ASSOCIATIONS
            </button> */}
          {/* </div>
        </div> */} 
        <TabNavigation 
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        

        {/* Recently Viewed Section */}
        <div className="p-4 ">
          {/* <h3 className="text-gray-500 text-sm mb-4">RECENTLY VIEWED</h3> */}

          <div className="space-y-4 ">
            {/* {recentlyViewed.map(person => (
              <div key={person.id} className="flex items-center gap-4 hover:bg-gray-50 p-2 rounded cursor-pointer">
                <img src={person.image} alt={person.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-medium">{person.name}</h4>
                  <p className="text-sm text-gray-600">{person.role}</p>
                </div>
              </div>
            ))} */}
            {activeTab === 0 &&( 
              <Suspense fallback={<h1>loading ... </h1>}>
                {loading ? (
                  // <div className="flex justify-center items-center h-40">
                  //   <span className="loader">Loading...</span> 
                  // </div>
                  <ShimmerEffect type="profileCard" />
                ) : profiles.length > 0 ? (
                  <List
                    height={400}
                    itemCount={profiles.length}
                    itemSize={120}
                    width={"100%"}
                  >
                    {ProfileItem}
                  </List>
                ) : (
                  <p>No profiles found.</p>
                )}
              </Suspense>)}
            {activeTab === 1 && (
              <Suspense fallback={<ShimmerEffect type="congress" />}>
                <div >
                <HomeSearchCongressPage mainSearchCongressData={congressData}  />
                </div>
                </Suspense>
            )}
            {activeTab ===  2 && (
              <Suspense fallback={<h1>loading..</h1>}>
              <div className="overflow-y-hidden">
                {/* <ScientificContentTab
                  mainPublications={publicationsData}
                  isFromSearch={true}
                  isFromSideSearch={false}
                /> */}
                <HomeSearchScientificContent
                  mainPublications={publicationsData}
                  isFromSearch={true}
                  isFromSideSearch={false}
                />
              </div>
              </Suspense>
            )}

            {/* {events.map(event => (
              <div key={event.id} className="flex items-center gap-4 hover:bg-gray-50 p-2 rounded cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-xs text-center">
                  {event.date.split(' ')[0]}<br />{event.date.split(' ')[1]}
                </div>
                <p className="font-medium">{event.title}</p>
              </div>
            ))} */}
          </div>
        </div>

        {/* Advanced Search Button */}
        {/* <div className="p-4 border-t">
          <button
            className="w-full text-center text-blue-600 py-2 hover:bg-blue-50 rounded"
          >
            ADVANCED SEARCH
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default React.memo(SearchModal);
