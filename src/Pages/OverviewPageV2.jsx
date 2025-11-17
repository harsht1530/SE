import React,{useState,useContext,useEffect} from 'react'
import { FaUser, FaRegFileAlt } from 'react-icons/fa'
import { useClinicalTrials } from '../Context/ClinicalTrialsContext.js';
import ClinicalTrailsPage from './ClinicalTrailsPage.jsx';
import DigitalPage from './DigitalPage.jsx';
import { DigitalContext } from '../Context/DigitalContext';
import { BiLike } from "react-icons/bi";
import { GoEye } from "react-icons/go";
import CongressContributions from '../Components/CongressContributions.jsx';
import { useScientificProfileData } from '../Context/ScientificProfileDataContext.js'
import { FaRegCommentAlt } from "react-icons/fa";
import { useParams } from 'react-router-dom';
import HighlightedText from '../Components/HighlightedText.jsx';

import CongressPage from './CongressPage.jsx';
import apiService from '../services/api.js';
import CryptoJS from 'crypto-js';
import { useDoctorProfile } from '../Context/DoctorProfileContext.js';
import FullDashboard from '../Components/FullDashboard.jsx';


const overViewTabs =["Publications","Clinical Trials","Congress Contributions","Digital","Guidelines", "Pharma"]

/**
 * @component OverviewPageV2
 * @description An enhanced overview page component that displays various professional activities
 * including publications, clinical trials, congress contributions, digital content, and collaborators
 * in a tabbed interface.
 * 
 * @param {Object} props
 * @param {Object} props.scientificProfileData - Scientific profile data containing:
 *   @param {Array} props.scientificProfileData.top_5_cited_artciles - Top cited articles
 *   @param {Array} props.scientificProfileData.top_10_coauthors - Top collaborating authors
 * 
 * @context
 * - ClinicalTrialsContext: Provides clinical trials data
 * - DigitalContext: Manages digital content state
 * - DoctorProfileContext: Provides doctor's profile information
 * 
 * @state
 * - activeTab: Current selected main tab
 * - activeTab1: Current selected digital content tab
 * - doctorCongressData: Congress participation data
 * - errorMessage: Error state for congress data fetching
 * 
 * @subcomponents
 * - CollaboratorCard: Displays individual collaborator information
 * - ClinicalTrailsPage: Shows clinical trials data
 * - CongressContributions: Displays congress participation
 * - DigitalPage: Shows digital content and videos
 * 
 * @tabs
 * - Publications: Shows top cited articles
 * - Clinical Trials: Displays clinical research involvement
 * - Congress Contributions: Shows conference participations
 * - Digital: Displays video content (Popular and Shorts)
 * - Collaborators: Shows research collaborators
 * 
 * @api
 * - apiService.profiles.doctorCongressData: Fetches congress participation data
 * 
 * @effects
 * - Fetches doctor's congress data on component mount
 * - Updates digital content based on tab selection
 * 
 * @example
 * ```jsx
 * <OverviewPageV2 
 *   scientificProfileData={{
 *     top_5_cited_artciles: [...],
 *     top_10_coauthors: [...]
 *   }}
 * />
 * ```
 * 
 * @returns {JSX.Element} A tabbed interface showing various professional activities
 */
const OverviewPageV2 = () => {

  const {doctorProfile} = useDoctorProfile();
  // console.log("doctor profile in ovp2",doctorProfile);
  const { scientificProfileData} = useScientificProfileData();
  const [activeTab, setActiveTab] = useState(overViewTabs[0]);
  // const [doctorName,setDoctorName] = useState("")
  const[doctorCongressData, setDoctorCongressData] = useState([])
  const [errorMessage, setErrorMessage] = useState('');
  const { clinicalData, clinicalDataByNctId, handleClinicalData } = useClinicalTrials();
  const { digitalData, setDigitalData, loading, errorMsg } = useContext(DigitalContext);
   const [activeTab1, setActiveTab1] = useState('Popular');
   const tabs = [ 'Popular', 'Shorts'];

  // useEffect(() => {
  //   if (!digitalData) {
  //     console.error("Digital data is not available in the context.");
  //   }
  // }, [digitalData]);
  const {encryptedProfileId} = useParams();
  const recordIdSecret = import.meta.env.VITE_RECORDID_SECRET
  const decryptRecordId = (encryptedRecordId) => {
    const bytes = CryptoJS.AES.decrypt(encryptedRecordId, recordIdSecret);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  const profileId = decryptRecordId(encryptedProfileId);

  const doctorName = doctorProfile?.Full_Name;
  

  // console.log("Digital Data in overviewV2 Page from context",digitalData) 
    const topTwoArticles =
    Array.isArray(scientificProfileData?.top_5_cited_artciles) 
      ? scientificProfileData.top_5_cited_artciles.slice(0, 2)
      : [];
    
    const topTwoGuidelines =
    Array.isArray(scientificProfileData?.guidelines) 
      ? scientificProfileData.guidelines.slice(0, 2)
      : [];

    const maxVisibleCollaborators = 3;
    const [isExpanded,setIsExpanded] = useState(false);
    const visibleCollaborators = isExpanded ? scientificProfileData?.top_10_coauthors : scientificProfileData?.top_10_coauthors?.slice(0,maxVisibleCollaborators);

    

    const toggleCoauthors = ()=>{
      setIsExpanded(!isExpanded);
    }

    const CollaboratorCard = ({ collaborator }) => {
        // Add default values to prevent errors when properties don't exist
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

    useEffect(() => {
     const fetchDoctorCongressData = async () =>{
      try{
        const response = await apiService.profiles.doctorCongressData(profileId);
        // console.log("response with the full name",response);
        console.log("doctor congress data",response.data);
        if (response.status ===200){
          setDoctorCongressData(response.congress_data);
          setErrorMessage(''); 
        }else{
          setErrorMessage(response.message || 'Unexpected error occurred');
        }
        
      }catch(error){
        console.error('Error fetching doctor congress data:',error);
      }
     } 
     fetchDoctorCongressData();
    },[doctorName])
        
  const renderTabContent = () => {
    switch(activeTab){
      case overViewTabs[0]:
        return(
          <div className="rounded-lg p-2  md:p-6 lg:p-6 h-full">
      
            <div className="space-y-4">
              {topTwoArticles.length>0 ?  (topTwoArticles.map((profile, index) => (
                  <div key={index} className="flex flex-col md:flex-row lg:flex-row justify-between gap-10 shadow-md px-2 md:px-6 lg:px-6 py-5 rounded-lg border-l-4 border-blue-500 bg-white">
                    <div className='flex flex-col gap-1 w-[80%]'>
                      <h2 className='text-lg font-semibold text-gray-800'><HighlightedText text={profile.title} /></h2>
                      <a href={profile.link} target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:text-blue-800 transition-colors'>{profile.link}</a>
                      <p className="text-gray-600"><HighlightedText text={profile.journal} /></p>
                      <p className='text-gray-700 font-medium'>Count of Citation: <span className='text-[#000] font-bold'>{profile.citation_count === 0 ? "NaN" : profile.citation_count}</span></p>
                    </div>
                    <div>
                      <p className="text-gray-500 pr-2">Published on {profile.publication_date}</p>
                    </div>
                  </div>
                ))) : (
                <p className="text-gray-500 italic">No popular articles found for this profile.</p>
              )
              }
            </div>
        </div>
        )
      case overViewTabs[1]:
        return(
        
          <ClinicalTrailsPage 
            limit={2}
          />
         
        )
        case overViewTabs[2]:
          return (
            // <CongressPage 
            //   doctorCongressData={doctorCongressData}
            //   fromOverview={true}
            //   mainFlag={false}
            //   errorMessage={errorMessage}
            // />
            <CongressContributions />
          );
        
      case overViewTabs[3]:
        return (
        <DigitalPage limit={2}/>)
          
        
      // case overViewTabs[4]:
      //   return(
      //     <div className=" rounded-lg p-6 h-full mt-6">

      //       <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
      //         {
      //           Array.isArray(scientificProfileData?.top_10_coauthors) && scientificProfileData.top_10_coauthors.length > 0 ? (
      //             <>
      //             {visibleCollaborators?.map((profile, index) => (
      //               <CollaboratorCard 
      //                 key={index} 
      //                 collaborator={profile} 
      //               />
      //             ))} 
      //             <button
      //                       onClick={() => toggleCoauthors()}
      //                       className="text-blue-500 text-sm"
      //                   >
      //                       {isExpanded
      //                       ? "Show Less"
      //                       : `Show More (${scientificProfileData?.top_10_coauthors.length - maxVisibleCollaborators})`}
      //                   </button>

                  
      //             </>
      //           ) : (
      //             <p className="text-gray-500 italic">No collaborator information available.</p>
      //           )
      //         }
      //       </div>
      //   </div>
      //   )
      
      case overViewTabs[4]:
        return (
          <div>
            {topTwoGuidelines.length > 0 ? (
              <div className="bg-gray-50 rounded-lg p-0 md:p-6 lg:p-6 h-full">
                {/* <h1 className='text-2xl font-semibold text-gray-800 mb-6 border-b pb-2'>Guidelines</h1> */}
                <ul className="list-disc pl-1 md:pl-5 lg:pl-5 space-y-2">
                  {topTwoGuidelines.map((guideline, index) => (
                    <div key={index} className="flex flex-col md:flex-row lg:flex-row justify-between gap-2 md:gap-10 lg:gap-10 shadow-md px-2 md:px-6 lg:px-6 py-5 rounded-lg border-l-4 border-blue-500 bg-white">
                    <div className='flex flex-col gap-1 w-full md:w-[80%] lg:w-[80%]'>
                      <h2 className='text-lg font-semibold text-gray-800'><HighlightedText text={guideline.title} /></h2>
                      <a href={guideline.link} target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:text-blue-800 transition-colors'>{guideline.link}</a>
                      <p className="text-gray-600"><HighlightedText text={guideline.journal} /></p>
                      <p className='text-gray-700 font-medium'>Count of Citation: <span className='text-blue-600 font-semibold'>{guideline.citation_count=== 0 ? "NaN" : guideline.citation_count}</span></p>
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

        )
        case overViewTabs[5]:
        return (
            // <CongressPage 
            //   doctorCongressData={doctorCongressData}
            //   fromOverview={true}
            //   mainFlag={false}
            //   errorMessage={errorMessage}
            // />
            <FullDashboard />
          );

    
    }
  }
  return (
    <div>
            <div className="flex items-center gap-4 md:gap-10 lg:gap-10  pb-5 overflow-x-scroll md:overflow-x-hidden lg:overflow-x-hidden">
            {overViewTabs.map((tab, index) => (
              <div
                key={index}
                className={`cursor-pointer h-10 w-auto whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-[#b349a5] text-white px-4 py-2 rounded-full"
                    : "border border-[#9f2c8e] text-[#b619b3] px-4 py-2 rounded-full"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                <p>{tab}</p>
              </div>
            ))}
          </div>
        {/*Arctiles*/}
        {/* <div className="bg-gray-50 rounded-lg p-6 h-full">
            <h1 className='text-2xl font-semibold text-gray-800 mb-6 border-b pb-2'>Top Two Articles</h1>
            <div className="space-y-4">
              {topTwoArticles.length>0 ?  (topTwoArticles.map((profile, index) => (
                  <div key={index} className="flex justify-between gap-10 shadow-md px-6 py-5 rounded-lg border-l-4 border-blue-500 bg-white">
                    <div className='flex flex-col gap-1 w-[80%]'>
                      <h2 className='text-lg font-semibold text-gray-800'>{profile.title}</h2>
                      <a href={profile.link} target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:text-blue-800 transition-colors'>{profile.link}</a>
                      <p className="text-gray-600">{profile.journal}</p>
                      <p className='text-gray-700 font-medium'>Count of Citation: <span className='text-blue-600 font-semibold'>{profile.citations === 0 ? "NaN" : profile.citations}</span></p>
                    </div>
                    <div>
                      <p className="text-gray-500 pr-2">Published on {profile.publication_date}</p>
                    </div>
                  </div>
                ))) : (
                <p className="text-gray-500 italic">No popular articles found for this profile.</p>
              )
              }
            </div>
        </div> */}

        {/*Collaborators*/}
        {/* <div className="bg-gray-50 rounded-lg p-6 h-full mt-6">
            <h1 className='text-2xl font-semibold text-gray-800 mb-6 border-b pb-2'>Collaborator Information</h1>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
              {
                Array.isArray(scientificProfileData?.top_10_coauthors) && scientificProfileData.top_10_coauthors.length > 0 ? (
                  scientificProfileData.top_10_coauthors.slice(0,2).map((profile, index) => (
                    <CollaboratorCard key={index} collaborator={profile} />
                  ))
                ) : (
                  <p className="text-gray-500 italic">No collaborator information available.</p>
                )
              }
            </div>
        </div> */}

        {renderTabContent()}
    </div>
  )
}

export default OverviewPageV2