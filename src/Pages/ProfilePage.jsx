import React, { useEffect, useState, lazy, Suspense, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { CiLocationOn } from "react-icons/ci";
import { MdOutlineMail } from "react-icons/md";
import { BsTwitterX } from "react-icons/bs";
import { LuBarcode } from "react-icons/lu";
import {
  FaLinkedin,
  FaFacebookF,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa";
import { ScientificProfileDataProvider } from "../Context/ScientificProfileDataContext.js"
const OverviewPage = lazy(() => import("./OverviewPage.jsx"))
const OverviewPageV2 = lazy(() => import("./OverviewPageV2.jsx"))
const InteractionsPage = lazy(() => import("./InteractionsPage.jsx"))
const DigitalPage = lazy(() => import("./DigitalPage.jsx"))
const ScientificActivitiesPageV2 = lazy(() => import("./ScientificActivitiesPageV2.jsx"))
const ScientificActivitiesPageV3 = lazy(() => import("./ScientificActivitiesPageV3.jsx"))
const CollaboratorsPage = lazy(() => import("./CollaboratorsPage.jsx"))
import { DoctorProfileProvider } from "../Context/DoctorProfileContext.js";
// import ProfileDetails from "../Components/ProfileDetails.jsx";
const ProfileDetails = lazy(() => import("../Components/ProfileDetails.jsx"));
import TabNavigation from "../Components/TabNavigation.jsx";
import Header from "../components/Header.jsx";
import apiService from "../services/api.js";
import { useParams } from "react-router-dom"
// import ScientificActivitiesPageV2 from "./ScientificActivitiesPageV2.jsx";
import { ClinicalTrialsProvider } from "../Context/ClinicalTrialsContext.js"
import { DigitalProvider } from "../Context/DigitalContext.jsx";
import { DoctorCongressProvider } from "../Context/DoctorCongressContext.js";
import ShimmerEffect from "../Components/ShimmerEffect.jsx";
import CryptoJS from "crypto-js";

const tabs = [
  "OVERVIEW",
  "SCIENTIFIC", //scientific activities pagev3
  "DIGITAL",
  "INTERACTIONS",
  "COLLABORATORS",
];

/**
 * @component ProfilePage
 * @description A comprehensive profile view component that displays detailed information about a healthcare professional.
 * Features a tabbed interface showing different aspects of the doctor's profile including overview, scientific activities,
 * and digital presence. Implements lazy loading for optimal performance.
 * 
 * @state
 * - profile {Object} - Contains the doctor's basic profile information
 * - loading {boolean} - Tracks data loading state
 * - error {string|null} - Stores error messages if any
 * - activeTab {number} - Currently selected tab index
 * - scientificProfileData {Object} - Scientific publications and collaborations data
 * - clinicalData {Object} - Clinical trials information
 * - overviewData {Object} - Education and affiliations data
 * 
 * @hooks
 * - useParams - Extracts profileId from URL
 * - useEffect - Manages data fetching for different profile sections
 * - useCallback - Optimizes tab rendering and handling
 * - useState - Manages component state
 * 
 * @context
 * - DoctorProfileProvider - Provides doctor's profile data to child components
 * - ClinicalTrialsProvider - Provides clinical trials data
 * - DigitalProvider - Provides digital presence data
 * 
 * @tabs
 * - Overview: General profile information and summary
 * - Scientific: Research activities and publications
 * - Digital: Online presence and social media
 * 
 * @api
 * - getById: Fetches basic profile data (name, specialties, contact info)
 * - overview: Fetches education and affiliations data
 * - scientificProfile: Fetches publications and collaborations
 * - clinicalTrails: Fetches list of all clinical trials associated with the doctor
 * - clinicalTrailsByNctId: Fetches detailed information about a specific clinical trial
 * 
 * @apiResponses
 * - profile: Basic doctor information (contact, specialties, degrees)
 * - overviewData: Education history and current/past affiliations
 * - scientificProfileData: Publications and collaboration network
 * - clinicalData: List of clinical trials and their basic information
 * - clinicalDataByNctId: Detailed information about a specific clinical trial
 * 
 * @context
 * - clinicalTrailsByNctId: Fetches detailed clinical trial data by NCT ID
 * - overview: Fetches education and affiliations
 * - ap
 * - clinicalTrails: Fetches clinical trials data
 * 
 * @example
 * // Usage in router
 * <Route path="/profile/:profileId" element={<ProfilePage />} />
 * 
 * @returns {JSX.Element} A complete profile page with tabbed navigation and content sections
 */

const ProfilePage = () => {
  const { encryptedProfileId } = useParams();
  const recordIdSecret = import.meta.env.VITE_RECORDID_SECRET
  const decryptRecordId = (encryptedRecordId) => {
    const bytes = CryptoJS.AES.decrypt(encryptedRecordId, recordIdSecret);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  const profileId = decryptRecordId(encryptedProfileId);

  const {scientific,clinical,location,digital} = useSelector((state) => state.filter)



  // console.log(profileId);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [scientificProfileData, setScientificProfileData] = useState(null)
  const [clinicalDataByNctId, setClinicalDataByNctId] = useState(null);
  const [clinicalData, setClinicalData] = useState(null);
  const [doctorCongressData, setDoctorCongressData] = useState([])
  const [CTRIData, setCTRIData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');




  {/* API for doctors profile */ }
  useEffect(() => {
    let isMounted = true;
    const fetchProfileData = async () => {
      if (!profileId) return;
      try {
        setLoading(true)
        setError(null);
        const profileData = await apiService.profiles.getById(profileId);
        console.log("Profile data received:", profileData); // Changed to proper logging

        // Handle if API returns an array
        if (isMounted) {
          console.log("-------------------->",Array.isArray(profileData))
          const data = Array.isArray(profileData) ? profileData[0] : profileData;
          setProfile(data);
          console.log("Profile data set:", data); // Changed to proper logging
          setLoading(false);
        }

      } catch (err) {
        if (isMounted) {
          setError(`Failed to load profile data: ${err.message}`);
          setLoading(false);
          console.error(err);
        }

      }
    }
    fetchProfileData();
    return () => {
      isMounted = false;
    }
  }, [encryptedProfileId])

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.toString().split(" ");
    return { day, month, year };
  };

  {/* API for doctor congress data */ }
  useEffect(() => {
    const fetchDoctorCongressData = async () => {
      try {
        const response = await apiService.profiles.doctorCongressData(profileId);
        console.log("response with the full name inside scientific Activities V3 page", response);
        if (response.status === 200) {
          const formattedData = response.congress_data.map(item => ({
            ...item,
            date: parseDate(item.Date_of_the_Event),
          }));
          //  if(congressCount){
          //   congressCount(formattedData.length);
          //  }

          setDoctorCongressData(formattedData);
          setErrorMessage('');
        } else {
          setErrorMessage(response.message || 'Unexpected error occurred');
        }

      } catch (error) {
        console.error('Error fetching doctor congress data:', error);
      }
    }
    fetchDoctorCongressData();
  }, [profileId]);

  {/* API for CTRI data */ }
  useEffect(() => {
    const fetchCtriData = async () => {
      try {
        const response = await apiService.profiles.CTRIData(profileId);
        setCTRIData(response);
        console.log("CTRI data response:", response)
      } catch (error) {
        console.error("Error fetching CTRI data:", error.message);
      }
    }
    fetchCtriData();
  }, [profileId]);


  {/* API for publications and collabrations */ }
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await apiService.profiles.scientificProfile(profileId);
        setScientificProfileData(response)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [encryptedProfileId])

  {/* API for clinical trails */ }
  useEffect(() => {
    const fetchClinicalData = async () => {
      try {
        const response = await apiService.profiles.clinicalTrails(profileId);

        setClinicalData(response);

      } catch (error) {
        console.error("Error fetching clinical data:", error.message);
      }
    }

    fetchClinicalData();
  }, [encryptedProfileId]);

  // Function to handle clinical data when the button is clicked
  const handleClinicalData = useCallback(async (nctId) => {
    console.log(nctId + " here is the nctId inside profile page")
    try {
      const response = await apiService.profiles.clinicalTrailsByNctId(profileId, nctId);
      console.log("Clinical data for NCT ID:", nctId, response);
      setClinicalDataByNctId(response.data);
    } catch (error) {
      console.error("Error fetching clinical data:", error.message);
    }
  }, [profileId])

  const handleTabChange = useCallback((index) => {
    setActiveTab(index);
  }, [])


  const renderTabContent = useMemo(() => {

    const TabLoadingFallback = () => (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl">Loading tab content...</p>
      </div>
    )
    return (
      <Suspense fallback={<TabLoadingFallback />}>
        {(() => {
          switch (activeTab) {
            case 0:
              return <DoctorProfileProvider value={{ doctorProfile: profile }}>
                <ScientificProfileDataProvider value={{ scientificProfileData, loading }}>
                  <DoctorCongressProvider value={{ doctorCongress: doctorCongressData, errorMessage, setErrorMessage }} >


                    <OverviewPage profile={profile} />
                  </DoctorCongressProvider>
                </ScientificProfileDataProvider>
              </DoctorProfileProvider>
            case 1:
              return <DoctorProfileProvider value={{ doctorProfile: profile }}>
                <DoctorCongressProvider value={{ doctorCongress: doctorCongressData, errorMessage, setErrorMessage }} >
                  <ScientificActivitiesPageV3 loading={loading}
                    scientificProfileData={scientificProfileData}
                    CTRIData={CTRIData}
                  />
                </DoctorCongressProvider>
              </DoctorProfileProvider>
            case 2:
              return <DigitalProvider><DigitalPage /></DigitalProvider>

            case 3:
              return <InteractionsPage />
            case 4:
              return <ScientificProfileDataProvider value={{ scientificProfileData, loading }}>
                <DoctorProfileProvider value={{ doctorProfile: profile }}>
                  <CollaboratorsPage />
                </DoctorProfileProvider>

              </ScientificProfileDataProvider>
            default:
              return null;
          }
        })()}
      </Suspense>
    )


  }, [activeTab, profile, scientificProfileData, loading]);

  return (
    <div className="mt-[5rem]">
      {/* <Header /> */}
      <Suspense fallback={<div>Loading Profile Details...</div>}>
        <ScientificProfileDataProvider value={{ scientificProfileData }}>
          <ProfileDetails profile={profile} scientificProfileData={scientificProfileData} clinicalData={clinicalData} />
        </ScientificProfileDataProvider>
      </Suspense>
      {error ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl text-red-500">{error}</p>
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center h-64 gap-2">
          {/* <ShimmerEffect type="profile" /> */}
          <h1>loading ..</h1>
        </div>
      ) :


        (
          <>



            <TabNavigation
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
            <ClinicalTrialsProvider value={{ clinicalData, handleClinicalData, clinicalDataByNctId }}>
              {renderTabContent}
            </ClinicalTrialsProvider>

          </>
        )}
    </div>
  );
};

export default ProfilePage;