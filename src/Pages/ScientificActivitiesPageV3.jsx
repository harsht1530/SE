import React, { useState, useEffect, useMemo } from 'react';
import apiService from '../services/api';
import { useParams } from 'react-router-dom';
import { FaUser, FaRegFileAlt } from 'react-icons/fa';
import ClinicalTrailsPage from './ClinicalTrailsPage';
import CongressContributions from '../Components/CongressContributions.jsx';
import { PiSortAscendingBold } from "react-icons/pi";
import { PiSortDescendingBold } from "react-icons/pi";
import { useClinicalTrials } from '../Context/ClinicalTrialsContext.js';
import { useDoctorCongress } from '../Context/DoctorCongressContext.js';
import { FiExternalLink } from "react-icons/fi";
import { MdCancel } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";

import { IoLocationSharp } from 'react-icons/io5';
import { useDoctorProfile } from '../Context/DoctorProfileContext.js';
import CryptoJS from "crypto-js";
import { Resizable } from "re-resizable";
import 'react-resizable/css/styles.css';
import ShimmerEffect from '../Components/ShimmerEffect.jsx';
import HighlightedText from '../Components/HighlightedText.jsx';



/**
 * @component ScientificActivitiesPageV3
 * @description Displays comprehensive scientific activities of a healthcare professional
 * including publications, clinical trials, collaborators, and congress contributions.
 * Features a tabbed interface with statistical cards showing key metrics.
 * 
 * @props
 * - loading {boolean} - Loading state indicator for data fetching
 * - scientificProfileData {Object} - Scientific profile data including:
 *   - top_5_cited_artciles {Array} - Top cited publications
 *   - top_10_coauthors {Array} - Leading collaborators
 *   - Statistical metrics (citations etc...)
 * 
 * @subcomponents
 * - CollaboratorCard - Displays individual collaborator information
 * - ClinicalTrailsPage - Shows clinical trials data
 * - CongressContributions - Displays congress participation data
 * 
 * @visualElements
 * - Statistical Cards: Colorful cards showing key metrics
 * - Tabbed Interface: Navigation between different scientific activities
 * - Publication Cards: Detailed view of top publications
 * - Collaborator Grid: Grid layout of collaborator information
 * - clinical Trials
 * - Congress Contributions
 * 
 * @states
 * - activeTab {string} - Currently selected tab from available options
 * 
 * @tabs
 * - Publications: Shows top 5 cited articles with citation counts
 * - Clinical Trails: Displays clinical research involvement
 * - Collaborators: Shows top 10 research collaborators
 * - Congress Contributions: Lists conference participations
 * 
 * 
 * @example
 * <ScientificActivitiesPageV3 
 *   loading={false}
 *   scientificProfileData={scientificData}
 * />
 * 
 * @returns {JSX.Element} A page displaying various scientific activities with interactive tabs
 */
const ScientificActivitiesPageV3 = ({ loading, scientificProfileData,CTRIData }) => {
  const [activeTab, setActiveTab] = useState("Publications");
  const [sortOption, setSortOption] = useState("new");
  const [showAllPublications, setShowAllPublications] = useState(false)
  const [congressLength, setCongressLength] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingClinicalDataByNctId, setIsLoadingClinicalDataByNctId] = useState(false);
  const [CtriDataById,setCtriDataById] = useState('');
  const contextData = useClinicalTrials();
  const { doctorCongress } = useDoctorCongress();
  // const { profileId } = useParams();
 
  console.log("CTRI Data in scientifiActivities data:", CTRIData);
      

  var tabs = [{ name: "Publications", count: scientificProfileData?.top_5_cited_artciles?.length || 0 }, {name:"Clinical Trails",count:contextData?.clinicalData?.length ||0}, {name:"Congress Contributions",count:doctorCongress?.length || 0}, { name: "Guidelines", count: scientificProfileData?.guidelines?.length || 0 },{ name: "CTRI", count: CTRIData && Object.keys(CTRIData).length > 0 ? 1 : 0 }];


 

  const sortedArticles = useMemo(() => {
    if (!Array.isArray(scientificProfileData?.top_5_cited_artciles)) return [];

    return [...scientificProfileData.top_5_cited_artciles].sort((a, b) => {
      if (sortOption === "new") {
        return new Date(b.publication_date) - new Date(a.publication_date);
      } else if (sortOption === "old") {
        return new Date(a.publication_date) - new Date(b.publication_date);
      } else if (sortOption === "asc") {
        return (b.citation_count || 0) - (a.citation_count || 0);
      } else if (sortOption === "dec") {
        return (a.citation_count || 0) - (b.citation_count || 0);
      } else {
        return 0;
      }
    });
  }, [sortOption, scientificProfileData]);

  const publicationsDisplaying = showAllPublications ? sortedArticles : sortedArticles.slice(0, 2)

   // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
    setIsLoadingClinicalDataByNctId(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleClinicalData = async (ctriId) => {
    setIsModalOpen(true)
    setIsLoadingClinicalDataByNctId(true);
    try {
      const ctriData = await apiService.profiles.CTRIDataById(ctriId);
      console.log("CTRI Data By Id in scientifi activites:", ctriData.data);
      setCtriDataById(ctriData.data);

    } catch (error) {
      console.error("Error fetching CTRI data:", error.message);
    }finally{
      setIsLoadingClinicalDataByNctId(false);
    }
  };



  if (loading) {
    return (
      <div className="m-6 flex justify-center items-center h-40">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-blue-200 rounded-full mb-2"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!scientificProfileData) {
    return (
      <div className="m-6 text-red-600 font-semibold">
        No scientific profile data found for ID
      </div>
    );
  }

  const CollaboratorCard = ({ collaborator }) => {
    const name = collaborator.name || 'Unknown';
    const affiliations = collaborator.affiliations || [];
    const count = collaborator.count || 0;

    return (
      <div className="bg-white rounded-lg shadow-md p-5 border border-gray-100 flex flex-col min-h-[180px]">
        <div className="flex gap-3 mb-3">
          {collaborator.profileImg ? (
            <img
              src={collaborator.profileImg}
              alt={name}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <FaUser className="text-gray-500" />
            </div>
          )}
          <div className="flex-1 flex flex-col justify-between gap-3">
            <p className="font-medium text-[#4b7ab8] hover:text-[#4b7ab8] cursor-pointer transition-colors duration-200">{name}</p>
            <p className="text-sm text-[#9d9d9d] mt-1">{affiliations[0] || 'No affiliation'}</p>
            <div className="w-25 flex items-center bg-green-50 hover:bg-green-100 rounded-md px-3 py-1 cursor-pointer transition-colors duration-200">
              <div className="w-10 p-2 h-8 bg-green-500 rounded-md flex items-center justify-center mr-2">
                <FaRegFileAlt className="text-white text-xs" size={20} />
              </div>
              <span className="text-gray-500 text-md font-medium pl-2">{count}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStatCards = () => {
    let entries = Object.entries(scientificProfileData);
    const filteredEntries = entries.filter(([key, value]) => (!Array.isArray(value) && typeof value !== 'object'));
    const bgColors = ['bg-teal-600', 'bg-blue-600', 'bg-indigo-600', 'bg-purple-600', 'bg-pink-600', 'bg-orange-600', 'bg-emerald-600', 'bg-cyan-600'];
    return filteredEntries.map(([key, value], index) => {
      const formattedKey = key.replace(/_/g, " ").split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
      return (
        (formattedKey !== "Not Guideline Count") && <div key={index} className={`rounded-lg shadow-md p-5 w-full h-40 ${bgColors[index % bgColors.length]} flex flex-col justify-between`}>
          <p className='text-white text-sm font-medium tracking-wide uppercase'>{formattedKey}</p>
          <p className='text-white text-3xl font-bold text-center'>{value}</p>
          <div className="h-2"></div>
        </div>
      );
    });
  };

  // const setCongressCount = (count) => {
  //   setCongressLength(count);
  // }


  return (
    <>
      <div className='grid lg:grid-cols-4 gap-4 m-6 md:grid-cols-2 sm:grid-cols-1'>
        {renderStatCards()}
      </div>
      <div className='mx-2 md:mx-10 my-5  pt-5'>


        <h1 className='font-medium text-lg'>Scientific Activities</h1>

        {/*Tabs */}
        <div className="flex items-center gap-10 border-b border-gray-300 pb-5 mt-4 overflow-x-auto">
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={`cursor-pointer h-10 w-auto whitespace-nowrap ${activeTab === tab.name

                  ? "bg-[#800080] text-white px-4 py-2 rounded-full"
                  : "border border-[#800080] text-[#800080] px-4 py-2 rounded-full"
                }`}
              onClick={() => setActiveTab(tab.name)}
            >
              <div className="flex items-center gap-2">
                <p>{tab.name}</p>
                <span className={`text-sm  ${activeTab === tab.name? "text-white-600":"text-gray-600"}`}>({tab.count})</span>
              </div>
            </div>
          ))}
        </div>

        {/*publication Tab content */}
        {activeTab === "Publications" && (
          <div className="bg-gray-50 rounded-lg p-2 md:p-6 lg:p-6 h-full">
            <div className='flex items-center justify-end mb-6 border-b'>
              {/* <h1 className='text-2xl font-semibold text-gray-800   pb-2'>Top Five Articles</h1> */}
              <div className='flex  items-center  gap-4 pb-3'>
                <h2 className='text-xl '>Sort By:</h2>
                <select
                  className='border border-[#800080] rounded-md p-2 mb-2 text-gray-600 cursor-pointer '
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="new">Date: Newest First</option>
                  <option value="old">Date: Oldest First</option>
                  <option value="asc">Citations: High to Low</option>
                  <option value="dec">Citations: Low to High</option>

                </select>
              </div>
            </div>
            <div className="space-y-4">
              {sortedArticles.length > 0 ? (
                publicationsDisplaying.map((profile, index) => (
                  <div key={index} className="flex flex-col md:flex-row lg:flex-row justify-between gap-2 md:gap-10 lg:gap-10 shadow-md px-6 py-5 rounded-lg border-l-4 border-blue-500 bg-white">
                    <div className='flex flex-col gap-1 w-full md:w-[80%] lg:w-[80%]'>
                      <h2 className='text-lg font-semibold text-gray-800'><HighlightedText text={profile.title} /></h2>
                      <a href={profile.link} target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:text-blue-800 transition-colors'>{profile.link}</a>
                      <p className="text-gray-600"><HighlightedText text={profile.journal} /></p>
                      <p className='text-gray-700 font-medium'>Count of Citation: <span className='text-blue-600 font-semibold'>{profile.citation_count === 0 ? "NaN" : profile.citation_count}</span></p>
                    </div>
                    <div>
                      <p className="text-gray-500 pr-2">Published on {profile.publication_date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No popular articles found for this profile.</p>
              )}

            </div>
            {sortedArticles.length > 2 && (
              <div className='flex items-center justify-center mt-6'>
                <button
                  onClick={() => setShowAllPublications(!showAllPublications)}
                  className='p-2 rounded-md border border-[#800080] cursor-pointer hover:bg-[#800080] hover:text-white'>{showAllPublications ? "View Less" : "View More"}</button>
              </div>

            )}
          </div>
        )}

        {/*Clinical Trails Tab content */}
        {activeTab === "Clinical Trails" && (<ClinicalTrailsPage />)}

        {/*Collaborators Tab content */}
        {/* {activeTab === "Collaborators" && (
          <div className="bg-gray-50 rounded-lg p-6 h-full">
            <h1 className='text-2xl font-semibold text-gray-800 mb-6 border-b pb-2'>Collaborator Information</h1>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
              {
                Array.isArray(scientificProfileData?.top_10_coauthors) && scientificProfileData.top_10_coauthors.length > 0 ? (
                  scientificProfileData.top_10_coauthors.map((profile, index) => (
                    <CollaboratorCard key={index} collaborator={profile} />
                  ))
                ) : (
                  <p className="text-gray-500 italic">No collaborator information available.</p>
                )
              }
            </div>
        //   </div> */}
        {/* // )} */}

        {/*Congress Contributions Tab content */}
        {activeTab === "Congress Contributions" && (<CongressContributions />)}



        {/*Guidelines Tab content */}
        {activeTab === "Guidelines" && (
          <div>
            {scientificProfileData?.guidelines.length > 0 ? (
              <div className="bg-gray-50 rounded-lg p-2 md:p-6 lg:p-6 h-full">
                {/* <h1 className='text-2xl font-semibold text-gray-800 mb-6 border-b pb-2'>Guidelines</h1> */}
                <ul className="list-disc pl-0 md:pl-5 lg:pl-5 space-y-2">
                  {scientificProfileData.guidelines.map((guideline, index) => (
                    <div key={index} className="flex flex-col md:flex-row lg:flex-row justify-between gap-2 md:gap-10 lg:gap-10 shadow-md px-6 py-5 rounded-lg border-l-4 border-blue-500 bg-white">

                      <div className='flex flex-col gap-1 w-full  md:w-[80%] lg:w-[80%]'>
                        <h2 className='text-lg font-semibold text-gray-800'><HighlightedText text={guideline.title} /></h2>
                        <a href={guideline.link} target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:text-blue-800 transition-colors'>{guideline.link}</a>
                        <p className="text-gray-600"><HighlightedText text={guideline.journal} /></p>
                        <p className='text-gray-700 font-medium'>Count of Citation: <span className='text-blue-600 font-semibold'>{guideline.citation_count === 0 ? "NaN" : guideline.citation_count}</span></p>
                      </div>
                      <div>
                        <p className="text-gray-500 pr-2">Published on {guideline.publication_date}</p>
                      </div>
                    </div>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="flex justify-center p-4">No guidelines available for this profile.</p>
            )}
          </div>
        )}

        {/*CTRI Tab content */}
        {activeTab === "CTRI" && (
          <div>
            {CTRIData && CTRIData ? (
              
                CTRIData.map((CTRIData, index) =><div  key={index} className="flex justify-between items-center border border-gray-200 rounded-lg my-6 p-2">
                  <div className='flex flex-col  gap-2 w-full md:w-[80%] lg:w-[80%]'>
                    <h1 className='text-lg '><HighlightedText text={CTRIData.public_title_of_study} /></h1>

                    <a href={CTRIData.source_url} target="_blank" className='text-blue-600 hover:text-blue-800 transition-colors'>{CTRIData.source_url}</a>
                    <p className="text-gray-600"><span className='font-medium'>CTRI NO:</span> {CTRIData.ctri_number}</p>
                  </div>
                  <button 
                  onClick={() => {
                  openModal();
                  handleClinicalData(CTRIData.ctri_number);
                }}
                  className='p-2 rounded-md bg-gray-400  hover:bg-[#800080] hover:text-white flex items-center gap-2'>
                    view more <FiExternalLink />
                  </button>
                </div>
             
            )) : (
              <p className="flex justify-center p-4">No CTRI data available for this profile.</p>
            )}


             {isModalOpen && isLoadingClinicalDataByNctId && (
              <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex justify-center items-center z-50">
                <Resizable
                  defaultSize={{
                    width: window.innerWidth > 768 ? '80vw' : '95vw',
                    height: window.innerHeight > 600 ? window.innerHeight - 200 : '90vh',
                  }}
                  minWidth={window.innerWidth > 768 ? 600 : 300}
                  minHeight={600}
                  maxWidth={window.innerWidth - 50}
                  maxHeight={window.innerHeight - 50}
                  enable={{
                    top: true,
                    right: true,
                    bottom: true,
                    left: true,
                    topRight: true,
                    bottomRight: true,
                    bottomLeft: true,
                    topLeft: true,
                  }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden p-4 box-border relative"
                >
                  <ShimmerEffect type="clinicalTrialsDataById" />
                </Resizable>
              </div>
            )}

            {isModalOpen && !isLoadingClinicalDataByNctId && CtriDataById && (
            <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex justify-center items-center z-50">
                        <Resizable
                        defaultSize={{
                          width: window.innerWidth > 768 ? '80vw' : '95vw',  // 80% width on desktop/tablet, 95% on mobile
                          height: window.innerHeight > 600 ? window.innerHeight - 200 : '90vh', // height responsive
                        }}
                        minWidth={window.innerWidth > 768 ? 600 : 300}  // smaller min width on mobile
                        minHeight={600}
                        maxWidth={window.innerWidth - 50}
                        maxHeight={window.innerHeight - 50}
                        // defaultSize={{
                        // width: 800,
                        // height:window.innerHeight - 200,
                        // }}
                        // minWidth={1200}
                        // minHeight={600}
                        // maxWidth={window.innerWidth - 100}
                        // maxHeight={window.innerHeight - 100}
                        enable={{
                        top: true,
                        right: true,
                        bottom: true,
                        left: true,
                        topRight: true,
                        bottomRight: true,
                        bottomLeft: true,
                        topLeft: true,
                        }}
                        className="bg-white rounded-lg shadow-lg overflow-hidden p-4 box-border relative"
                        >
                        <div className='flex justify-between items-center pb-4 sticky top-0 bg-white z-10 w-full'>
                        <h2 className='font-medium text-lg'>Clinical Trail:</h2>
                        <MdCancel size={30} className='cursor-pointer hover:fill-red-600' onClick={closeModal} />
                        </div>
                
                        <div className="bg-white  mb-4  rounded-lg shadow-lg  w-full h-[calc(100%-50px)]  p-1 md:p-6 lg:p-6  overflow-y-auto ">
                        
                        <div className='py-2  border-b border-gray-300'>
                        <h2 className="text-xl font-semibold text-[#800080]"><HighlightedText text={CtriDataById.title} /></h2>
                        <p className='pt-3'>CTRI NO: {CtriDataById.nctId}</p>
                        </div>

                        {/* Study Summary */}
                                <p className="mt-4 text-lg">Study Summary</p>
                                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-1  border-b border-gray-300 py-2">
                                <p className='text-blue-600'>
                                <strong className='font-semibold text-black'>Phase:</strong>{' '}
                                {
                                  Array.isArray(CtriDataById?.phase)
                                    ? CtriDataById.phase.join(', ')
                                    : (typeof CtriDataById?.phase === 'string' && CtriDataById.phase.trim() !== '')
                                      ? CtriDataById.phase
                                      : 'Not Available'
                                }
                                </p>

                                <p className='text-blue-600'><strong className='font-semibold text-black'>Study Type:</strong> {CtriDataById.studyType || 'N/A'}</p>
                                <p className='text-blue-600'><strong className='font-semibold text-black'>Sponsor:</strong> {CtriDataById.sponser || 'N/A'}</p>
                                <p className='text-blue-600'><strong className='font-semibold text-black'>Condition:</strong> {CtriDataById.condition || 'N/A'}</p>
                                <p className='text-blue-600'><strong className='font-semibold text-black'>Start Date:</strong> {CtriDataById.startDate || 'N/A'}</p>
                                <p className='text-blue-600'><strong className='font-semibold text-black'>Completion:</strong> {CtriDataById.completionDate || 'N/A'}</p>
                                </div>

                                <div className='flex flex-col gap-4 '>
                                {/* Trail Locations */}
                            <div>
                              <h1 className='py-2 font-medium'>Trail Locations</h1>
                              {CtriDataById.trail_locations.sites?.length > 0 ? (
                                CtriDataById.trail_locations.sites.map((location, index) => (
                                  <div className='flex gap-2 items-center p-2' key={index}>
                                    <CiLocationOn size={25} className='text-gray-600' />
                                    <div>
                                      <h2 className='text-blue-600'>
                                        {location.site_address}
                                      </h2>
                                      
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <h2 className='text-blue-600 border border-gray-300 p-4 rounded-b-md'>Not available</h2>
                              )}
                            </div>

                       
                        </div>
                        </div>
                        </Resizable>
                        
            </div>
            )}
          </div>
        )}

      </div>
    </>
  );
};

export default ScientificActivitiesPageV3;