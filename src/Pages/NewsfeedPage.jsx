import React, { useState, useCallback, useMemo, useEffect, lazy, Suspense } from "react";
import Header from "../Components/Header";

import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import axios from "axios"
import apiService from "../services/api";
import { favoritesApi } from "../services/api"
import { getAssetPath } from '../utils/imageUtils';
const ClinicalTrailsPage = lazy(() => import("./ClinicalTrailsPage"));
import { IoLocationSharp } from "react-icons/io5";
const NewsFeedPublicationsPage = lazy(() => import("./NewsFeedPublicationsPage"))
const NewsFeedCongressPage = lazy(() => import("./NewsFeedCongressPage"))
import ShimmerEffect from "../Components/ShimmerEffect";
import CryptoJS from 'crypto-js';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'

const queryClient = new QueryClient()



/**
 * @component NewsfeedPage
 * @description A dashboard component that displays latest activities in healthcare including
 * publications, clinical trials, and congress contributions. Features a tabbed interface
 * and favorite doctors sidebar.
 * 
 * @props {Object} props
 * @prop {boolean} [hadHiddenHeader=false] - Controls header visibility
 * @prop {boolean} [hadHiddenFavorites=false] - Controls favorites sidebar visibility
 * @prop {boolean} [showTabs=true] - Controls tab navigation visibility
 * 
 * @state
 * - publications {Array} - Latest medical publications
 * - congressess {Array} - Upcoming and recent medical congresses
 * - trials {Array} - Clinical trials data
 * - loading {boolean} - Loading state for data fetching
 * - activeTab {string} - Currently selected content tab
 * - expandedCards {Object} - Tracks expanded/collapsed publication abstracts
 * - showAll {boolean} - Controls favorite doctors list expansion
 * 
 * @api
 * - profiles.newsFeed: Fetches combined newsfeed data
 *   Returns: {
 *     newsFeed_results: Array<Publication>,
 *     congress: Array<Congress>,
 *     clinical_trails: Array<Trial>
 *   }
 * - profiles.clinicalTrailsByNctId: Fetches detailed trial data by NCT ID
 * 
 * @subcomponents
 * - Header: Navigation header component
 * - NewsFeedPublicationsPage: Props: {
 *     publications: Array,
 *     expandedCards: Object
 *   }
 * - ClinicalTrailsPage: Props: {
 *     newsFeedClinicalData: Array,
 *     fromNewsFeed: boolean,
 *     newsFeedClinicalDataByNctId: Array,
 *     newsFeedHandleClinicalData: Function
 *   }
 * - NewsFeedCongressPage: Props: {
 *     congressess: Array
 *   }
 * 
 * @redux
 * - favorites.doctors: Array of favorite doctor profiles
 * 
 * @tabs
 * - Latest Publications: Recent medical research publications
 * - Latest Clinical Trials: Ongoing and new clinical trials
 * - Latest Congress Contributions: Recent congress events and presentations
 * 
 * @layout
 * - Responsive two-column layout (main content and favorites sidebar)
 * - Tabbed navigation for content sections
 * - Loading states with spinner
 * - Expandable favorites list
 * 
 * @example
 * // Basic usage
 * <NewsfeedPage />
 * 
 * // Hidden header and favorites
 * <NewsfeedPage hadHiddenHeader={true} hadHiddenFavorites={true} />
 * 
 * @returns {JSX.Element} A dashboard page with latest healthcare activities
 */
const NewsfeedPage = React.memo(({ hadHiddenHeader, hadHiddenFavorites, showTabs = true }) => {

  const [favoriteDoctors, setFavoriteDoctors] = useState([]);
  const [publications, setPublications] = useState([]);
  const navigate = useNavigate()
  const [showAll, setShowAll] = useState(false);
  const [showFulltext, setShowFulltext] = useState(false);
  const [loading, setLoading] = useState(true);
  // const [expandedCards, setExpandedCards] = useState({});
  const [congressess, setCongressess] = useState([]);
  const [trials, setTrials] = useState([]);
  const [clinicalTrailsByNctId, setClinicalTrailsByNctId] = useState([]);
  const tabs = ["Latest Publications", "Latest Clinical Trials", "Latest Congressess"]
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const [isFavoritesLoading, setIsFavoritesLoading] = useState(true);
  const [error, setError] = useState(null);
  const recordIdSecret = import.meta.env.VITE_RECORDID_SECRET

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.toString().split(" ");
    return { day, month, year };
  };

  //   const { isPending, error, data } = useQuery({
  //   queryKey: ['repoData'],
  //   queryFn: async () => {
  //     const response = await favoritesApi.getFavorites();
  //     setFavoriteDoctors(response.data);
  //     return response.data;
  //   },
  // });



  /*Favourites Doctors API */
  useEffect(() => {
    const fetchFavorites = async () => {
      setIsFavoritesLoading(true);
      try {
        const response = await favoritesApi.getFavorites();
        // console.log("favorite doctors in newsfeed page ", response.data)
        setFavoriteDoctors(response.data);
      } catch (e) {
        console.log("error in the useEffect of the getting favorites api", e);
        setError(e);

      } finally {
        setIsFavoritesLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  useEffect(() => {
    const fetchPublications = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await apiService.profiles.newsFeed();
        const data = response;

        const formattedData = data.congress.map(item => {
          const overview = item.openai_overview || {};

          // Clean and simplify openai_overview
          const cleanOverview = {
            startDate: overview["Start Date"] || null,
            endDate: overview["End Date"] || null,
            topics: overview["Main Topics"] || [],
            organization: overview["Organization"] || "",
            policayAndAdvocacy: overview["Policy and Advocacy"],
            publication: overview["Publication"]?.["Scientific Journals"] || [],
            funding: overview["Research Funding"] || null,
            upcomingMeetings: overview["Upcoming Meetings"] || [],
          };

          return {
            ...item,
            date: parseDate(item.Date_of_the_Event),
            cleanOverview, // Add cleanOverview to each congress item
          };
        });

        const withIds = data.newsFeed_results.map((item, index) => ({
          ...item,
          id: item.id || index + 1,  // fallback to index if no id is provided
        }));

        setTrials(data.clinical_trails);
        setCongressess(formattedData); // includes cleanOverview now
        setPublications(withIds);
        setLoading(false); // Set loading to false after fetching
      } catch (error) {
        console.error("Error fetching publications:", error);
      }
    };

    fetchPublications();
  }, []);


  const toggleAbstract = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };


  const visibleDoctors = useMemo(() => {
    return showAll
      ? favoriteDoctors.slice(0, 5)
      : favoriteDoctors.slice(0, 3);
  }, [showAll, favoriteDoctors]);




  const handleProfileClick = useCallback((recordId) => {
    const encryptedRecordId = CryptoJS.AES.encrypt(recordId, recordIdSecret).toString()
    const encodedProfileId = encodeURIComponent(encryptedRecordId);
    navigate(`/profile/${encodedProfileId}`)
  }, [navigate])

  const handleClinicalData = async (nctId, profileId) => {
    console.log(profileId + " here is the nctId inside profile page")
    try {
      const response = await apiService.profiles.clinicalTrailsByNctId(profileId, nctId);
      console.log("Clinical data for NCT ID:", nctId, response);
      setClinicalTrailsByNctId(response.data);
    } catch (error) {
      console.error("Error fetching clinical data:", error.message);
    }
  }





  const renderContent = useMemo(() => {
    if (!showTabs) {
      return (
        <Suspense fallback={<ShimmerEffect type="publication" />}>
          <NewsFeedPublicationsPage publications={publications} expandedCards={expandedCards} toggleAbstract={toggleAbstract(id)} />
        </Suspense>
      )
    }

    switch (activeTab) {
      case "Latest Publications":
        if (loading) {
          return (
            <ShimmerEffect type="publication" />
          )
        }
        return (
          <Suspense fallback={<ShimmerEffect type="publication" />}>
            <NewsFeedPublicationsPage publications={publications} />
          </Suspense>
        )
      case "Latest Clinical Trials":
        return (
          <div>
            <Suspense fallback={<ShimmerEffect type="clinical" />}>
              <ClinicalTrailsPage
                newsFeedClinicalData={trials}
                fromNewsFeed={true}
                newsFeedClinicalDataByNctId={clinicalTrailsByNctId}
                newsFeedHandleClinicalData={handleClinicalData}
              />
            </Suspense>
          </div>
        )
      case "Latest Congressess":
        return (
          <Suspense fallback={<ShimmerEffect type="congress" />}>
            <NewsFeedCongressPage congressess={congressess} />
          </Suspense>
        )
    }
  }, [activeTab, publications, clinicalTrailsByNctId, trials, congressess])





  return (

    <div className={`min-h-screen bg-gray-20 ${!hadHiddenHeader ? 'mt-[5rem]' : ''}`}>

      {/* {!hadHiddenHeader && <Header />} px-4 py-6*/}

      <div className="container mx-auto px-2 py-2 md:px-4 lg:px-6 xl:px-8 md:py-4 lg:py-6 xl:py-8">
        {/* Tabs */}
        {!hadHiddenHeader && <div className="flex items-center ml-4 gap-2 md:gap-10 lg:gap-10  pb-5 mt-4 border-b border-gray-200 mb-2 sm:flex-wrap">
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={`cursor-pointer  ${activeTab === tab
                ? "bg-[#800080] text-white px-4 py-2 rounded-md text-sm sm:text-xs md:text-base "
                : "border border-[#800080] text-[#800080] px-4 py-2 rounded-md text-sm sm:text-xs md:text-base"
                }`}
              onClick={() => setActiveTab(tab)}
            >
              <p>{tab}</p>
            </div>
          ))}
        </div>}

        <div className="flex flex-col md:flex-row  sm:flex-col gap-6">
          {/* Left Column - Guidelines */}
          {/* should remove this loader effect has we are using the shimmer effect */}
          {/* {loading ? (
            <div className={`flex justify-center items-center p-10 gap-2 ${hadHiddenFavorites ? 'w-[calc(100%-400px)]' : 'md:w-2/3'}`}>
              <div className="w-8 h-8 border-4 border-[#800080] border-dashed rounded-full animate-spin"></div>
              <span className="text-lg text-gray-600">
                Loading...
              </span>
            </div>
          ) : ( */}
          <div className={`${hadHiddenFavorites ? 'w-full' : 'md:w-2/3'}`}>
            {renderContent}
          </div>
          {/* )} */}






          {/* Right Column - Favorites */}
          {!hadHiddenFavorites && <div className="md:w-1/3 ">
            <div className="bg-white rounded-lg shadow-md p-4 step-newsfeed-favourites">
              <h2 className="text-lg font-medium text-gray-700 mb-4 ">
                HERE YOUR Segments
              </h2>

              {isFavoritesLoading && (
                <div>Loading...</div>
              )}

              {!isFavoritesLoading && error && (
                <div>
                  {error.message.includes('401') && (
                    <span className="text-red-600 font-medium">
                      Your session has expired. Please login again.
                    </span>)
                    // ) : (
                    //   <>An error has occurred: {error.message}</>
                    // )
                  }
                </div>
              )}

              {!isFavoritesLoading && favoriteDoctors.length === 0 && (
                <p className="text-sm text-gray-500">No favorite doctors available</p>
              )}
              {!isFavoritesLoading && error && error.message.includes('404') && (
                <span className="text-gray-600 font-medium">
                  No favorites doctors found.
                </span>
              )}
              {!isFavoritesLoading && !error && favoriteDoctors.length > 0 && (
                (visibleDoctors.map((profile) => (

                  <div
                    key={profile.id}
                    className="border-b border-gray-200 py-3 last:border-b-0"
                  >
                    <div className="flex items-center gap-2 p-2">

                      <img
                        src={profile["Profile_Pic_Link"] && profile["Profile_Pic_Link"] !== "NaN"
                          ? profile["Profile_Pic_Link"]
                          : getAssetPath('profileImg1.png')}
                        alt="profile"
                        className="w-15 h-15 rounded-full"
                      />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-8">
                          <p
                            onClick={() => handleProfileClick(profile.Record_Id)}
                            className="text-[#800080] font-semibold text-lg hover:underline cursor-pointer"
                          >
                            {profile.Full_Name}, {profile["Degree_1"] !== "NaN" && profile["Degree_1"]} {profile["Degree_2"] !== "NaN" && profile["Degree_2"]} {profile["Degree_3"] !== "NaN" && profile["Degree_3"]}
                          </p>

                          {/* <p className="text-[#8C7B2B] font-bold text-lg">
                      ||||||||||
                    </p> */}
                        </div>

                        <p className="text-md">{profile.Clinic_Name_1 !== "NaN" && profile.Clinic_Name_1}</p>
                        <p className="text-sm">{profile["HCP_Speciality_1"]}</p>
                      </div>
                    </div>
                  </div>
                )))
              )}

              {/* Show All Button */}

              <div className="flex justify-center items-center mt-2">
                {favoriteDoctors.length > 3 && (
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="mt-4 px-4 py-2 bg-[#800080] text-white rounded hover:bg-purple-800"
                  >
                    {showAll ? 'Show Less' : 'Show All'}
                  </button>
                )}

              </div>
            </div>
          </div>}
        </div>
      </div>
    </div>

  );
});

export default NewsfeedPage;