import React, { useState } from 'react';
import { TbExternalLink } from "react-icons/tb";
import { MdCancel } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { useClinicalTrials } from '../Context/ClinicalTrialsContext.js';
import { useParams } from "react-router-dom";
import { Resizable } from "re-resizable";
import 'react-resizable/css/styles.css';
import ShimmerEffect from '../Components/ShimmerEffect.jsx';
import HighlightedText from '../Components/HighlightedText.jsx';

const ClinicalTrailsPage = ({ limit=false,
  fromNewsFeed=false,
  newsFeedClinicalData,
  newsFeedClinicalDataByNctId,
  newsFeedHandleClinicalData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSummaryModelOpen, setIsSummaryModelOpen] = useState(false);
  const [isLoadingClinicalDataByNctId, setIsLoadingClinicalDataByNctId] = useState(false);
  // const { clinicalData, clinicalDataByNctId, handleClinicalData } = useClinicalTrials();
  const [isNoDataModalOpen, setIsNoDataModalOpen] = useState(false);
  const contextData = useClinicalTrials();

  const clinicalData = fromNewsFeed?newsFeedClinicalData:contextData.clinicalData;

  const clinicalDataByNctId = fromNewsFeed?
  newsFeedClinicalDataByNctId:contextData.clinicalDataByNctId;

const handleClinicalData = async (nctId, recordId) => {
  setIsLoadingClinicalDataByNctId(true);

  const response = await (fromNewsFeed
    ? newsFeedHandleClinicalData(nctId, recordId)
    : contextData.handleClinicalData(nctId, recordId));

  setIsLoadingClinicalDataByNctId(false);

  // If API returned nothing → open "No data" modal
  if (!response || Object.keys(response).length === 0) {
    setIsNoDataModalOpen(true);
  }
};


  // console.log(clinicalDataByNctId, " Here is the clinical data by nct id");
  const { profileId } = useParams();

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
    setIsLoadingClinicalDataByNctId(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openSummaryModel = () => {
    setIsSummaryModelOpen(true);
  }

  const closeSummaryModel = () => {
    setIsSummaryModelOpen(false);
  }

  return (
    <div className={`${!limit?'min-h-screen' : ''}} p-5`}>


      {/* Clinical Trial Section */}
      {clinicalData.length > 0 ? (
        <>
          {!fromNewsFeed && <h1 className="text-xl font-semibold pb-2">Clinical Trails</h1>}
          {(limit ? clinicalData.slice(0, 2) : clinicalData).map((item, index) => (
            <div key={index} className="bg-white flex flex-col justify-start gap-4 items-start md:flex md:justify-between md:items-center md:flex-row lg:flex lg:flex-row   p-3 md:p-4 lg:p-4 rounded-lg shadow-md my-4">
              <div className="text-base md:text-lg lg-text-lg text-gray-800 mt-0 md:mt-2 lg:mt-2 flex flex-col gap-1 md:gap-4 lg:gap-4 w-full sm:w-full md:w-[80%] lg:w-[80%]">
                <p className='text-[#800080] font-semibold'><HighlightedText text={item.title} /></p>
                <p className="text-sm md:text-sm lg:text-sm font-medium text-gray-600 mt-1">NCT ID: {item.nctId}</p>
              </div>

              <div className='flex items-center gap-2'>
              {/* <button onClick={openSummaryModel} className='bg-gray-400 p-2 rounded-md hover:bg-[#800080] hover:text-white'>View Summary</button> */}
              <button
                // onClick={() => {
                //   openModal();
                //   handleClinicalData(item.nctId,item.Record_Id);
                // }}

                onClick={async () => {
  openModal();
  await handleClinicalData(item.nctId, item.Record_Id);

  // If no data → close main modal
  if (!clinicalDataByNctId || Object.keys(clinicalDataByNctId).length === 0) {
    setIsModalOpen(false);
  }
}}

                className="flex items-center gap-2  px-1 py-1 md:px-2 md:py-2 lg:px-2 lg-py-2 bg-gray-400 text-white rounded-md hover:bg-[#800080] transition cursor-pointer"
              >
                View More <TbExternalLink size={20} />
              </button>
              </div>
            </div>
          ))}
        </>
      ) : (
        <h1 className='text-red-500 italic'>No latest clinical trails found for this profile.</h1>
      )}

      {/* Summary Modal */}
      {/* {isSummaryModelOpen  && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[80%] max-w-3xl">
          <p>Summary of these clinical Trials</p>
          <button>
            <MdCancel size={30} className='cursor-pointer hover:fill-red-600' onClick={closeSummaryModel} />
          </button>
          </div>
        </div>
        )} */}
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



     
      {isModalOpen && !isLoadingClinicalDataByNctId && clinicalDataByNctId && (
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
                    <h2 className="text-xl font-semibold text-[#800080]"><HighlightedText text={clinicalDataByNctId.title} /></h2>
                    <p className='pt-3'>NCT ID: {clinicalDataByNctId.nctId}</p>
                    </div>

                    {/* Study Summary */}
                            <p className="mt-4 text-lg">Study Summary</p>
                            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-1  border-b border-gray-300 py-2">
                            <p className='text-blue-600'>
                            <strong className='font-semibold text-black'>Phase:</strong>{' '}
                            {Array.isArray(clinicalDataByNctId?.phase) ? clinicalDataByNctId.phase.join(', ') : 'Not Available'}
                            </p>

                            <p className='text-blue-600'><strong className='font-semibold text-black'>Study Type:</strong> {clinicalDataByNctId.studyType || 'N/A'}</p>
                            <p className='text-blue-600'><strong className='font-semibold text-black'>Sponsor:</strong> {clinicalDataByNctId.sponser || 'N/A'}</p>
                            <p className='text-blue-600'><strong className='font-semibold text-black'>Condition:</strong> <HighlightedText text={clinicalDataByNctId.condition || 'N/A'} /></p>
                            <p className='text-blue-600'><strong className='font-semibold text-black'>Start Date:</strong> {clinicalDataByNctId.startDate || 'N/A'}</p>
                            <p className='text-blue-600'><strong className='font-semibold text-black'>Completion:</strong> {clinicalDataByNctId.completionDate || 'N/A'}</p>
                            </div>

                            <div className='flex flex-col gap-4 '>
                            {/* Trail Locations */}
                    <div>
                      <h1 className='py-2 font-medium'>Trail Locations</h1>
                      {clinicalDataByNctId.trail_locations?.length > 0 ? (
                        clinicalDataByNctId.trail_locations.map((location, index) => (
                          <div className='flex gap-2 items-center p-2' key={index}>
                            <CiLocationOn size={25} className='text-gray-600' />
                            <div>
                              <h2 className='text-blue-600'>
                                {location.facility} - {location.city}, {location.state}, {location.country}
                              </h2>
                              {location.contacts?.[0]?.name && (
                                <p className='text-gray-600'>Contact: {location.contacts[0].name}</p>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <h2 className='text-blue-600 border border-gray-300 p-4 rounded-b-md'>Not available</h2>
                      )}
                    </div>

                    {/* Endpoints */}
                    <div className='border-t border-gray-300 mt-2'>
                    <h1 className='p-2 font-medium'>Endpoints</h1>
                    <div className=' p-2'>
                            <p className='text-blue-600'>Primary Endpoint</p>
                            <div 
                            // className='h-[15vh] overflow-y-auto'
                            >
                            {clinicalDataByNctId.Endpoints?.primaryOutcomes?.length > 0 ? (
                            clinicalDataByNctId.Endpoints.primaryOutcomes.map((outcome, index) => (
                            <ul key={index} className='list-disc pl-8'>
                                    <li className='text-gray-600'>{outcome.measure}</li>
                            </ul>
                            ))
                            ) : (
                            <p className='text-red-600'>Not available</p>
                            )}
                            </div>

                            <p className='text-blue-600 mt-4'>Secondary Endpoint</p>
                            <div 
                            // className='h-[15vh] overflow-y-auto'
                            >
                            {clinicalDataByNctId.Endpoints?.secondaryOutcomes?.length > 0 ? (
                            clinicalDataByNctId.Endpoints.secondaryOutcomes.map((outcome, index) => (
                            <ul key={index} className='list-disc pl-8'>
                                    <li className='text-gray-600'><HighlightedText text={outcome.measure} /></li>
                            </ul>
                            ))
                            ) : (
                            <p className='text-red-600 text-md pl-8'>Not available</p>
                            )}
                            </div>
                    </div>
                    </div>
                    </div>

                    {/* Publications */}
                    <div className='mt-4 mb-10'>
                    <h1 className='text-lg font-medium pb-1'>Related Publications / Results</h1>
                    <div className='border-t  border-gray-300 py-2'>
                    <div 
                    // className='h-[20vh] overflow-y-auto'
                    >
                            {clinicalDataByNctId.publications && clinicalDataByNctId.publications !== "Not Available" && Array.isArray(clinicalDataByNctId.publications) && clinicalDataByNctId.publications.length > 0 ? (
                            clinicalDataByNctId.publications.map((publication, index) => (
                            <div key={index} className='flex flex-col  shadow-md px-2 py-2 my-6 rounded-md'>
                            <p className='text-gray-600'><span className='text-black font-semibold'>Title:</span> <HighlightedText text={publication.citation} /></p>
                            </div>
                            ))
                            ) : (
                            <p className='text-red-600'>{clinicalDataByNctId?.publications === "Not Available" ? "No publications available" : "Publications data is not available"}</p>
                            )}
                    </div>
                    </div>
                    </div>

                    {/* <div className='flex items-center gap-4 justify-center p-4'>
                    <button className='border border-blue-500 text-blue-500 rounded-md p-2 cursor-pointer'>View Full Trial</button>
                    <button className='border border-blue-500 text-blue-500 rounded-md p-2 cursor-pointer'>Share Summary with HCP</button>
                    </div> */}
                    </div>
                    </Resizable>
                    
        </div>
      )}

      {isNoDataModalOpen && (
  <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md text-center">
      <h2 className="text-xl font-semibold text-red-600 mb-4">
        Data Not Available
      </h2>
      <p className="text-gray-700 mb-6">
        No clinical trial details found for this record.
      </p>
      <button
        onClick={() => setIsNoDataModalOpen(false)}
        className="px-4 py-2 bg-[#800080] text-white rounded-md hover:bg-purple-700"
      >
        Close
      </button>
    </div>
  </div>
)}

  
    </div>)
    
};
export default ClinicalTrailsPage;
