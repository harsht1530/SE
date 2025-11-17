import React,{useState, useEffect, use} from 'react'
import { useParams } from 'react-router-dom';
import { Search } from "lucide-react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { getAssetPath } from '../../utils/imageUtils';
import { hospitalApiService } from "../../services/api";
import { TbExternalLink } from "react-icons/tb";
import { Resizable } from "re-resizable";
import { MdCancel } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import 'react-resizable/css/styles.css';
import { IoDocumentTextOutline } from "react-icons/io5";
import { PiLinkBold } from "react-icons/pi";

const HCODocumentsPage = () => {
        const [documents, setDocuments] = useState([]);
        const [clinicalDocuments, setClinicalDocuments] = useState([]);
        const [clinicalDataByNctId, setClinicalDataByNctId] = useState([]);
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [loading, setLoading] = useState(true);
        const { id } = useParams();
        const [activeFilter,setActiveFilter] = useState("Pubmed");
        const [originalDocuments, setOriginalDocuments] = useState([]);
        const [originalClinicalDocuments, setOriginalClinicalDocuments] = useState([]);
        
        
        useEffect(() => {
                const fetchDocuments = async () => {
                try {
                        const response = await hospitalApiService.hospital.getHCOProfileDocuments(id);
                        setOriginalDocuments(response['pubmed']);
                        setOriginalClinicalDocuments(response['clinical']);
                        setDocuments(response['pubmed']);
                        setClinicalDocuments(response['clinical']);
                        console.log("Documents response:", response);
                } catch (error) {
                        console.error("Error fetching documents:", error);
                } finally {
                        setLoading(false);
                }
                };
                
                fetchDocuments();
        }, []);

        const handleClinicalData = async (nctId) => { 
                console.log(nctId + " here is the nctId inside profile page")
                try {
                  const response = await hospitalApiService.hospital.getclinicalDocumentsByID(id,nctId);
                  console.log("Clinical data for NCT ID:", nctId, response);
                  setClinicalDataByNctId(response);
                } catch (error) {
                  console.error("Error fetching clinical data:", error.message);
                }
              }

        const onChangeSearch = (value) => {

        
        if (value) {
                const filteredDocuments = documents.filter((doc) => {
                return (
                doc.title.toLowerCase().includes(value.toLowerCase()) ||
                doc.publication_date.toLowerCase().includes(value.toLowerCase())
                );
                });
                const filteredClinicalDocuments = clinicalDocuments.filter((doc) => {
                return (
                doc.title.toLowerCase().includes(value.toLowerCase()) ||
                doc.nctId.toLowerCase().includes(value.toLowerCase())
                );
                });
                setDocuments(filteredDocuments);
                setClinicalDocuments(filteredClinicalDocuments);
        }else{
                setDocuments(originalDocuments);
                setClinicalDocuments(originalClinicalDocuments);
                
        } 
        };
        


        
          // Function to open the modal
      const openModal = () => {
        setIsModalOpen(true);
      };
    
      // Function to close the modal
      const closeModal = () => {
        setIsModalOpen(false);
      };  
        
        // if (loading) {
        // return <div className='flex justify-center items-center'>Loading...</div>;
        // }

       return (
    <div className='mx-10 mt-4 mb-4 border border-gray-200 rounded-md p-4'>
            <h1 className='font-medium text-lg'>Documents</h1>
            <div className='flex items-center justify-between mt-4'>
            <div className="relative flex-1 max-w-md z-10">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/60" size={20} />
                    <input
                            type="text"
                            placeholder="Search for Documents..."
                            className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm  text-gray-700"
                            onChange = {(e)=> {onChangeSearch(e.target.value)}}
                    />
            </div>
            <div>
                    {/* <select className='border border-gray-300 rounded-md p-2 cursor-pointer'>
                            <option>Data Range</option>
                    </select> */}
                    <select 
                    className='border border-gray-300 rounded-md p-2 ml-2 cursor-pointer w-[150px]'
                    onChange={(e) => setActiveFilter(e.target.value)}
                    >
                            <option value="Pubmed" >Pubmed</option>
                            <option value="Clinical" >Clinical</option>
                            {/* <option>Document Type</option> */}
                    </select>
            </div>
            
            </div>
            {activeFilter === "Pubmed" && (
                <div className=' mt-4 flex flex-col gap-4'>
                {loading ? (<p className='flex justify-center'>Loading...</p>) : Array.isArray(documents) && documents.length > 0 ? documents.map((doc, index) => (

                        <div key={index} className='flex justify-between items-center p-2 rounded-md border border-gray-300'>
                        <div className='flex flex-col gap-1 w-[70%]'>
                                <button className=' flex items-center gap-1 text-[#800080] bg-purple-100 rounded-md px-2 py-1 w-30'><IoDocumentTextOutline size={20}/> publications</button>
                                <h2 className='text-lg'>{doc.title}</h2>
                                <p className=' text-[#800080]'>Author: Department of Endocrinology, XYZ Hospital</p>
                                <p className='text-sm font-medium text-gray-500'>Published: {doc.publication_date}</p>
                        </div>
                        <a href={doc.link} target="_blank" rel="noopener noreferrer">
                        <button className='p-2 rounded-md bg-gray-300 flex items-center  gap-2 cursor-pointer hover:bg-[#800080] hover:text-white transition-colors duration-300'>
                                View More <FaExternalLinkAlt   />
                                </button>
                        </a>
                </div>
                )):(<p className='flex justify-center'>No publications found</p>)}
                
            </div>
            )}

            {activeFilter === "Clinical" && (
                <div className=' mt-4 flex flex-col gap-4'>
                {Array.isArray(clinicalDocuments) && clinicalDocuments.length > 0 ? clinicalDocuments.map((doc, index) => (
                       <div key={index} className="bg-white flex justify-between gap-4 items-center p-4 rounded-lg shadow-md ">
                       <div className="text-lg text-gray-800 mt-2 flex flex-col gap-2 w-[80%]">
                       <button className=' flex items-center gap-1 text-[#800080] bg-purple-100 rounded-md px-2 py-1 w-35'><PiLinkBold /> clinical trails</button>
                         <p className=' font-semibold'>{doc.title}</p>
                         <p className="text-sm font-medium text-gray-600 mt-1">NCT ID: {doc.nctId}</p>
                       </div>
         
                       <div className='flex items-center gap-2'>
                       {/* <button onClick={openSummaryModel} className='bg-gray-400 p-2 rounded-md hover:bg-[#800080] hover:text-white'>View Summary</button> */}
                       <button
                         onClick={() => {
                           openModal();
                           handleClinicalData(doc.nctId);
                         }}
                         className="flex items-center gap-2  px-2 py-2 bg-gray-400 text-white rounded-md hover:bg-[#800080] transition cursor-pointer"
                       >
                         View More <TbExternalLink size={20} />
                       </button>
                       </div>
                     </div>
                )):(<p className='flex justify-center'>No clinical trials found</p>)}
                {isModalOpen && clinicalDataByNctId && (
                   <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex justify-center items-center z-50">
                                <Resizable
                                defaultSize={{
                                width: 800,
                                height:window.innerHeight - 200,
                                }}
                                minWidth={1200}
                                minHeight={600}
                                maxWidth={window.innerWidth - 100}
                                maxHeight={window.innerHeight - 100}
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
                        
                                <div className="bg-white  mb-4  rounded-lg shadow-lg  w-full h-[calc(100%-50px)]  p-6  overflow-y-auto ">
                                
                                <div className='py-2  border-b border-gray-300'>
                                <h2 className="text-xl font-semibold text-[#800080]">{clinicalDataByNctId.title}</h2>
                                <p className='pt-3'>NCT ID: {clinicalDataByNctId.nctId}</p>
                                </div>

                                {/* Study Summary */}
                                        <p className="mt-4 text-lg">Study Summary</p>
                                        <div className="mt-2 grid grid-cols-2 gap-1  border-b border-gray-300 py-2">
                                        <p className='text-blue-600'>
                                        <strong className='font-semibold text-black'>Phase:</strong>{' '}
                                        {Array.isArray(clinicalDataByNctId?.phase) ? clinicalDataByNctId.phase.join(', ') : 'Not Available'}
                                        </p>

                                        <p className='text-blue-600'><strong className='font-semibold text-black'>Study Type:</strong> {clinicalDataByNctId.studyType || 'N/A'}</p>
                                        <p className='text-blue-600'><strong className='font-semibold text-black'>Sponsor:</strong> {clinicalDataByNctId.sponser || 'N/A'}</p>
                                        <p className='text-blue-600'><strong className='font-semibold text-black'>Condition:</strong> {clinicalDataByNctId.condition || 'N/A'}</p>
                                        <p className='text-blue-600'><strong className='font-semibold text-black'>Start Date:</strong> {clinicalDataByNctId.startDate || 'N/A'}</p>
                                        <p className='text-blue-600'><strong className='font-semibold text-black'>Completion:</strong> {clinicalDataByNctId.completionDate || 'N/A'}</p>
                                        </div>

                                        <div className='flex flex-col gap-4 '>
                                        {/* Trail Locations */}
                                        <div className=''>
                                        <h1 className='py-2 font-medium'>Trail Locations</h1>
                                        {clinicalDataByNctId.trail_locations?.length > 0 ? (
                                                <div className='flex gap-2 items-center p-2 '>
                                                <CiLocationOn size={25} className='text-gray-600' />
                                                <div>
                                                <h2 className='text-blue-600'>{clinicalDataByNctId.trail_locations[0].facility} - {clinicalDataByNctId.trail_locations[0].city}, {clinicalDataByNctId.trail_locations[0].state}</h2>
                                                {clinicalDataByNctId.trail_locations?.[0]?.contacts?.[1]?.name && (
                                                        <p className='text-gray-600'>Contact: {clinicalDataByNctId.trail_locations[0].contacts[1].name}</p>)}
                                                </div>
                                                </div>
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
                                                <li className='text-gray-600'>{outcome.measure}</li>
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
                                        <p className='text-gray-600'><span className='text-black font-semibold'>Title:</span> {publication.citation}</p>
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

                </div>
                
            )}
    </div>
)
}

export default HCODocumentsPage