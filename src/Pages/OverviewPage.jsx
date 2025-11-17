import React, { useState, useEffect } from "react";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { FiExternalLink } from "react-icons/fi";
import { LuBarcode } from "react-icons/lu";
import ScientificActivitiesPage from "./ScientificActivitiesPage.jsx";
import axios from "axios";
import OverviewPageV2 from "./OverviewPageV2.jsx";
import apiService from "../services/api.js";
import { useParams } from "react-router-dom"; // Add this import at the top
import { DigitalProvider } from "../Context/DigitalContext.jsx";
import HighlightedText from '../Components/HighlightedText.jsx';
import CryptoJS from "crypto-js"
// const scientificLeaderTopics = [
//   "cancer", "tumor", "metastasis", "chemotherapy", "radiotherapy",
//         "immunotherapy", "carcinoma", "oncogene", "biopsy", "precision medicine"   
// ];

const digitalLeaderTopics = [
  "Systemic Cancer Therapy",
  "Medicines Shortages",
  "Cancer Therapy",
  "Adenocarcinoma",
  "Solid Tumors / Hematologic Malignancies (Oncology)",
  "Advanced / Metastatic Breast Cancer",
  "Anti-HER2 Drugs",
  "Breast Cancer",
  "Breast Carcinoma In Situ",
  "Cancer Chemotherapy",
  "Capecitabine",
  "Carcinoma",
];

const overViewTabs = [
  "Publications",
  "Clinical Trials",
  "Congress Contributions",
  "Digital",
];

/**
 * @component OverviewPage
 * @description A comprehensive profile overview page that displays various professional details
 * including affiliations, education, and activities of a healthcare professional.
 * 
 * @param {Object} props
 * @param {Object} props.scientificProfileData - Scientific profile information of the healthcare professional
 * @param {Object} props.overviewData - Detailed overview data containing affiliations and education
 * @param {Object} props.profile - Basic profile information including license details
 * 
 * @property {Object} overviewData
 * @property {string} overviewData.Clinic_Name_[1-5] - Names of affiliated clinics
 * @property {string} overviewData.Address_[1-5] - Addresses of affiliated clinics
 * @property {string} overviewData.State_[1-5] - States of affiliated clinics
 * @property {string} overviewData.Degree_[1-4] - Educational degrees
 * @property {string} overviewData.College_[1-4] - Educational institutions
 * @property {string} overviewData.Graduation_Year_[1-4] - Graduation years
 * 
 * @property {Object} profile
 * @property {string} profile.License_Number - Medical license number
 * @property {string} profile.Licensing_Body - State medical council name
 * @property {string} profile.Licensing_Year - Year of registration
 * 
 * @state {string} activeTab - Currently active tab in the overview page
 * 
 * @context
 * - Uses DigitalProvider context for digital engagement data
 * 
 * @subcomponents
 * - OverviewPageV2 - Enhanced version of overview display, It display the top two activities from every section of Publications, Clinical Data, Congress Contributions, Digital, Collaborators.
 * 

 * 
 * @sections
 * - Affiliations: Displays professional affiliations and clinic details
 * - Education: Shows academic qualifications and institutions
 * - License Information: Medical registration and council details
 * 
 * 
 * @example
 * ```jsx
 * <OverviewPage 
 *
 *   overviewData={overviewDetails}
 *   profile={profileInfo}
 * />
 * ```
 * 
 * @returns {JSX.Element} A structured overview page with professional details
 */

function OverviewPage({ profile }) {
  // Add loading state
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(overViewTabs[0]);
  const [overviewData, setOverviewData] = useState(null);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const { encryptedProfileId } = useParams();
  const recordIdSecret = import.meta.env.VITE_RECORDID_SECRET

  const decryptRecordId = (encryptedRecordId) => {
    const bytes = CryptoJS.AES.decrypt(encryptedRecordId, recordIdSecret);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  const profileId = decryptRecordId(encryptedProfileId);
  // Update useEffect to handle loading state
  useEffect(() => {
    const fetchOverviewData = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.profiles.overview(profileId);
        setOverviewData(response);
        setError(null);
      } catch (error) {
        console.error("Error fetching overview data:", error);
        setError("Failed to load overview data");
      } finally {
        setIsLoading(false);
      }
    };

    if (profileId) {
      fetchOverviewData();
    }
  }, [encryptedProfileId]);

  const scientificLeaderTopics = {};

  if (overviewData) {
  for (let i = 1; i <= 12; i++) {
    const topickey = `topic_${i}`;
    const scorekey = `topic_${i}_score`;

    const topic = overviewData[topickey];
    const score = overviewData[scorekey];

    // Check if topic is defined and not null
    if (topic !== undefined && topic !== null) {
      scientificLeaderTopics[topic] = score; // could be 0, null, or ""
    }
  }
}

  // console.log("scientificLeaderTopics", scientificLeaderTopics);

  const getBars = (score) => {
    const rounded = Math.round(score);
    const totalBars = 10;
    const violetBars = "|".repeat(rounded);
    const grayBars = "|".repeat(totalBars - rounded);

    return {
      violet: violetBars,
      gray: grayBars,
    };
  };

  // Add loading state UI

  console.log("overviewData inside the overview page", overviewData);
  const getValue = (key) =>
    overviewData && overviewData[key] !== "NaN" ? overviewData[key] : null;

  // const [overviewData,setOverviewData] = useState(null);
  // const {profileId} = useParams();
  // Show either first 4 or all sponsorships
  const visibleSponsorships = showAll
    ? overviewData?.clinical_results ?? []
    : (overviewData?.clinical_results ?? []).slice(0, 4);

  // Affiliations Data
  const clinicName1 = getValue("Clinic_Name_1");
  const address1 = getValue("Address_1");
  const state1 = getValue("State_1");

  const clinicName2 = getValue("Clinic_Name_2");
  const address2 = getValue("Address_2");
  const state2 = getValue("State_2");

  const clinicName3 = getValue("Clinic_Name_3");
  const address3 = getValue("Address_3");
  const state3 = getValue("State_3");

  const clinicName4 = getValue("Clinic_Name_4");
  const address4 = getValue("Address_4");
  const state4 = getValue("State_4");

  const clinicName5 = getValue("Clinic_Name_5");
  const address5 = getValue("Address_5");
  const state5 = getValue("State_5");

  const hasAffiliation1 = clinicName1 !== null;
  const hasAffiliation2 = clinicName2 !== null;
  const hasAffiliation3 = clinicName3 !== null;
  const hasAffiliation4 = clinicName4 !== null;
  const hasAffiliation5 = clinicName5 !== null;

  const hasAnyAffiliation =
    hasAffiliation1 ||
    hasAffiliation2 ||
    hasAffiliation3 ||
    hasAffiliation4 ||
    hasAffiliation5;

  // Education Data
  const degree1 = getValue("Degree_1");
  const college1 = getValue("College_1");
  const graduationYear1 = getValue("Graduation_Year_1");

  const degree2 = getValue("Degree_2");
  const college2 = getValue("College_2");
  const graduationYear2 = getValue("Graduation_Year_2");

  const degree3 = getValue("Degree_3");
  const college3 = getValue("College_3");
  const graduationYear3 = getValue("Graduation_Year_3");

  const degree4 = getValue("Degree_4");
  const college4 = getValue("College_4");
  const graduationYear4 = getValue("Graduation_Year_4");

  const hasEducation =
    degree1 !== null ||
    degree2 !== null ||
    degree3 !== null ||
    degree4 !== null;

  // Education data and affliations
  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const response = await apiService.profiles.overview(profileId);
        // Handle the response data here
        setOverviewData(response);
        console.log("Overview data:", response);
      } catch (error) {
        console.error("Error fetching overview data:", error);
        // Handle error appropriately
      }
    };

    if (profileId) {
      fetchOverviewData();
    }
  }, [encryptedProfileId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Add error state UI
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-red-500">
        <p>{error}</p>
      </div>
    );
  }
  return (
    <div className="box-sizing: border-box px-2 md:px-4 lg:px-4 py-4">
      {/* <div className="bg-gray-100">
        <div className="bg-white rounded-tr-sm rounded-tl-sm shadow-md mb-0">
          <div className="p-6">
            <h1 className="text-xl font-medium mb-4">Activities</h1>
            <div className="flex items-center gap-10 mt-4">
              <p className="flex items-center gap-2">
                <span className="custom-golden-bar font-bold">|||||||</span>
                Congress Contributions
              </p>
              <p className="flex items-center gap-2">
                <span className="custom-golden-bar font-bold">||||</span>
                Publications
              </p>
              <p className="flex items-center gap-2">
                <span className="custom-golden-bar font-bold">|||</span>
                Guidelines
              </p>
              <p className="flex items-center gap-2">
                <span className="custom-golden-bar font-bold">||</span>
                Clinical Trials
              </p>
              <p className="flex items-center gap-2">
                <span className="custom-golden-bar font-bold">||||</span>
                Digital Engagement
              </p>
            </div>
          </div>
        </div>
      </div> */}
      <div className="p-0">
        <div className="bg-white rounded-md shadow-md p-2 md:p-6 lg:p-6">
          <h2 className="text-xl font-medium mb-6">Top Activities</h2>

          {/* Filter Buttons */}
          {/* <div className="flex space-x-3 mb-6">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm">
              Media Mentions
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm">
              Congress Contributions
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm">
              Scientific Work
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm">
              Digital Engagements
            </button>
          </div> */}
          {/* <div className="flex items-center gap-10  pb-5 ">
            {overViewTabs.map((tab, index) => (
              <div
                key={index}
                className={`cursor-pointer ${
                  activeTab === tab
                    ? "bg-blue-600 text-white px-4 py-2 rounded-full"
                    : "border border-blue-300 text-blue-600 px-4 py-2 rounded-full"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                <p>{tab}</p>
              </div>
            ))}
          </div> */}

          <DigitalProvider>
            <OverviewPageV2 />
          </DigitalProvider>

          {/* News Mention */}
          {/* <div className="mb-6">
            <div className="flex items-center mb-2">
              <IoMdInformationCircleOutline
                className="text-gray-500 mr-2"
                size={20}
              />
              <p className="text-gray-600">Is mentioned on a news website</p>
            </div>

            <div className="border border-gray-200 rounded-md p-4">
              <div className="flex">
                <img
                  src="../../public/Overview/brainScan.png"
                  alt="Brain Scan"
                  className="w-32 h-32 object-cover rounded-md mr-4"
                />
                <div>
                  <div className="flex items-center">
                    <a
                      href="#"
                      className="text-blue-500 font-medium mb-2 hover:underline"
                    >
                      Study of immunotherapy for brain cancer metastases shows
                      promising results
                    </a>
                    <FiExternalLink className="ml-2 text-blue-500" />
                  </div>
                  <p className="text-gray-700 text-sm mb-2">
                    In a phase 2 clinical trial of the immune checkpoint
                    inhibitor pembrolizumab, investigators found that 42 percent
                    of patients with metastatic brain cancer benefited from the
                    therapy, with seven patients in the trial surviving longer
                    than two years.
                  </p>
                  <div className="flex items-center mt-2">
                    <span className="bg-blue-100 text-xs px-1 py-0.5 rounded-sm text-blue-800">
                      N
                    </span>
                    <span className="text-gray-500 text-xs ml-1">
                      News Medical | Jun 2, 2023
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          {/* Mentioned Publication */}
          {/* <div className="mb-4">
            <p className="text-gray-500 mb-2">Mentioned publication</p>
            <a href="#" className="text-blue-500 hover:underline">
              Pembrolizumab in brain metastases of diverse histologies: phase 2
              trial results
            </a>
          </div> */}

          {/* Show More Button */}
          {/* <div className="text-center">
            <button className="text-blue-500 font-medium">SHOW MORE</button>
          </div> */}
        </div>
      </div>

      {/* Affiliations Section */}
      {/* <div className="px-4 py-5">
        <h3 className="text-black-600 font-medium mb-4">Affiliations</h3>
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <ul className="list-disc pl-6">
            <li className="mb-3">
          
              <span className="font-semibold">Johns Hopkins Hospital</span> –
      
              Senior Consultant, Oncology Department
            </li>
            <li className="mb-3">
              <span className="font-semibold">American Cancer Society</span> –
              Research Advisor on Integrative Cancer Treatments
            </li>
            <li className="mb-3">
              <span className="font-semibold">Mayo Clinic</span> – Visiting
              Faculty, Precision Medicine Program
            </li>
            <li className="mb-3">
              <span className="font-semibold">
                Stanford University Medical Center
              </span>{" "}
              – Associate Professor of Internal Medicine
            </li>
            <li className="mb-3">
              <span className="font-semibold">
                World Health Organization (WHO)
              </span>{" "}
              – Contributor to Global Cancer Prevention Initiatives
            </li>
          </ul>
        </div>
      </div>*/}
      <div>
        {/* Affiliations Section (using the variables declared above) */}
        <div className="px-4 py-5">
          <h3 className="text-black-600 font-medium mb-4">Affiliations</h3>
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            {hasAnyAffiliation ? (
              <ul className="list-disc pl-6">
                {hasAffiliation1 && (
                  <li className="mb-3">
                    <span className="font-semibold">{clinicName1}</span>
                    {address1 && state1
                      ? ` – ${address1}, ${state1}`
                      : address1
                      ? ` – ${address1}`
                      : state1
                      ? ` – ${state1}`
                      : ""}
                  </li>
                )}
                {hasAffiliation2 && (
                  <li className="mb-3">
                    <span className="font-semibold">{clinicName2}</span>
                    {address2 && state2
                      ? ` – ${address2}, ${state2}`
                      : address2
                      ? ` – ${address2}`
                      : state2
                      ? ` – ${state2}`
                      : ""}
                  </li>
                )}
                {hasAffiliation3 && (
                  <li className="mb-3">
                    <span className="font-semibold">{clinicName3}</span>
                    {address3 && state3
                      ? ` – ${address3}, ${state3}`
                      : address3
                      ? ` – ${address3}`
                      : state3
                      ? ` – ${state3}`
                      : ""}
                  </li>
                )}
                {hasAffiliation4 && (
                  <li className="mb-3">
                    <span className="font-semibold">{clinicName4}</span>
                    {address4 && state4
                      ? ` – ${address4}, ${state4}`
                      : address4
                      ? ` – ${address4}`
                      : state4
                      ? ` – ${state4}`
                      : ""}
                  </li>
                )}
                {hasAffiliation5 && (
                  <li className="mb-3">
                    <span className="font-semibold">{clinicName5}</span>
                    {address5 && state5
                      ? ` – ${address5}, ${state5}`
                      : address5
                      ? ` – ${address5}`
                      : state5
                      ? ` – ${state5}`
                      : ""}
                  </li>
                )}
              </ul>
            ) : (
              <p>Data not available</p>
            )}
          </div>
        </div>

        {/* Education Section (using the variables declared below) */}
        <div className="p-4 m-2 bg-white rounded-md shadow-md">
          <h1 className="text-lg font-semibold text-gray-800 mb-3">
            Education
          </h1>
          {hasEducation ? (
            <div className="space-y-3">
              {degree1 && (
                <div className="grid grid-cols-3 gap-x-4 py-2 border-b border-gray-200">
                  <div className="font-medium text-gray-700">{degree1}</div>
                  <div className="text-gray-600">{graduationYear1}</div>
                  <div className="text-gray-600">{college1}</div>
                </div>
              )}

              {degree2 && (
                <div className="grid grid-cols-3 gap-x-4 py-2 border-b border-gray-200">
                  <div className="font-medium text-gray-700">{degree2}</div>
                  <div className="text-gray-600">{graduationYear2}</div>
                  <div className="text-gray-600">{college2}</div>
                </div>
              )}

              {degree3 && (
                <div className="grid grid-cols-3 gap-x-4 py-2 border-b border-gray-200">
                  <div className="font-medium text-gray-700">{degree3}</div>
                  <div className="text-gray-600">{graduationYear3}</div>
                  <div className="text-gray-600">{college3}</div>
                </div>
              )}

              {degree4 && (
                <div className="grid grid-cols-3 gap-x-4 py-2 border-b border-gray-200">
                  <div className="font-medium text-gray-700">{degree4}</div>
                  <div className="text-gray-600">{graduationYear4}</div>
                  <div className="text-gray-600">{college4}</div>
                </div>
              )}
            </div>
          ) : (
            <p className="p-4 text-gray-500">Education details not available</p>
          )}
        </div>
      </div>

      {/*Topics Section*/}
      <div className="p-4 mx-2 my-4 bg-white rounded-md shadow-md">
        <h3 className="text-black-600 font-medium mb-4">Topics</h3>
        <div>
          <p className="  mb-4">Scientific Leader Topics</p>
          <div className="grid grid-cols-1 md:grid md:grid-cols-3 lg:grid lg:grid-cols-3 gap-4 border-t  border-gray-200 py-4">
            {Object.entries(scientificLeaderTopics).map(([topic, score],index) => {
              const bars = getBars(score);
              return (
                <div key={index} className="flex items-center gap-2">
                  <h1 className="font-bold text-xl flex">
                    <span className="text-[#800080]">{bars.violet}</span>
                    <span className="text-gray-300">{bars.gray}</span>
                  </h1>
                  <p className="pt-2 text-base text-gray-800 capitalize">
                    <HighlightedText text={topic} />
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* <div>
            <p className=" mt-4 mb-2">Digital Leader Topics</p>
            <div className="grid grid-cols-3 gap-4  border-b border-gray-200 pb-4">
              {digitalLeaderTopics.map((topic,index)=>(
                <div className="flex items-center gap-2" key={index}>
                <h1 className="text-gray-300 font-bold text-xl"><span className="text-[#800080]">|</span>|||||||||</h1>
                <p className="pt-2">{topic}</p>
              </div>

              ))}
            
              
            </div>
          </div>
          */}
      </div>

      {/*Company Collaborations*/}
      {/* <div className="p-4 mx-2 my-4 bg-white rounded-md shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-black-600 font-medium">Company Collaborations</h2>
        <select className="border border-gray-300 rounded-md p-2 cursor-pointer">
          <option value="all">All time</option>
          <option value="year">This year</option>
          <option value="month">This month</option>
          <option value="week">This week</option>
          <option value="day">Today</option>
        </select>
      </div>

      <h3 className="pb-2 font-medium">TRANSFER OF VALUE</h3>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-2 px-4">Company</th>
            <th className="py-2 px-4">Total Transfer Value</th>
            <th className="py-2 pl-10">Breakdown</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-200">
            <td className="py-2 px-4">Merck Sharp & Dohme (MSD)</td>
            <td className="py-2 px-4 text-[#A7D158]">$906,171.60</td>
            <td className="py-2 pl-10">
              <p>99.96% Research ($905,787.40)</p>
              <p className="text-gray-500">&lt;1% Conference Speaking ($384.20)</p>
            </td>
          </tr>

          <tr className="border-b border-gray-200" >
            <td className="py-2 px-4">Genentech</td>
            <td className="py-2 px-4 text-[#A7D158]">$519,333.65</td>
            <td className="py-2 pl-10">
              <p>99.12% Research ($514,747.38)</p>
              <p className="text-gray-500">&lt;1% Consulting and Advisory Services ($2,520.00)</p>
              <p className="text-gray-500">&lt;1% Conference Speaking ($1,115.37)</p>
              <p className="text-gray-500">&lt;1% Conference Attendance ($950.90)</p>
            </td>
          </tr>

          <tr className="border-b border-gray-200">
            <td className="py-2 px-4">Pfizer</td>
            <td className="py-2 px-4 text-[#A7D158]">$129,511.53</td>
            <td className="py-2 pl-10">
              <p>98.9% Research ($128,090.00)</p>
              <p className="text-gray-500">1.01% Conference Speaking ($1,310.00)</p>
              <p className="text-gray-500">&lt;1% Conference Attendance ($111.53)</p>
            </td>
          </tr>

          <tr className="border-b border-gray-200">
            <td className="py-2 px-4">Roche</td>
            <td className="py-2 px-4 text-[#A7D158]">$75,483.14</td>
            <td className="py-2 pl-10">
              <p>57.93% Conference Speaking ($43,726.79)</p>
              <p className="text-gray-500">20.11% Research ($15,176.38)</p>
              <p className="text-gray-500">19.93% Consulting and Advisory Services ($15,046.86)</p>
            </td>
          </tr>
        </tbody>
        
      </table>
      <p className="text-blue-600 font-medium text-center mt-4 ">SHOW ALL 15 PAYMENTS</p>
    </div> */}
      {/* License Number */}
      {profile && (
        <div>
          <div className="p-4 m-2 bg-white rounded-md shadow-md">
            <div className="flex justify-between items-center mb-4  ">
              <h2 className="font-medium text-gray-700">MCI Number :</h2>
              <h4 className="text-gray-600 mr-[15%]">
                {profile["License_Number"]}
              </h4>
            </div>
            <div className="flex justify-between items-center mb-4 ">
              <h2 className="font-medium text-gray-700">
                State Medical Council :
              </h2>
              <h4 className="text-gray-600 mr-[15%]">
                {profile["Licensing_Body"]}
              </h4>
            </div>
            <div className="flex justify-between items-center mb-4 ">
              <h2 className="font-medium text-gray-700">Registration Year :</h2>
              <h4 className="text-gray-600 mr-[15%]">
                {profile["Licensing_Year"]}
              </h4>
            </div>
          </div>
        </div>
      )}

      {/*sponsorship collaborations */}
      <div className="p-2 md:p-4 mx-2 my-4 bg-white rounded-md shadow-md">
        <h3 className="text-black-600 font-medium mb-4">
          Sponsorship Collaborations
        </h3>
        <table className="w-full text-left border-collapse mb-4">
          
        </table>
        <table className="w-full text-left border-collapse">
          <tbody>

          </tbody>
          
          <tbody>
            {overviewData &&
            Array.isArray(overviewData.clinical_results) &&
            visibleSponsorships.length > 0 ? (
              visibleSponsorships.map((sponsorship, index) => (
                <tr className=" border-b border-gray-200" key={index}>
                  <td className="pb-3">
                    <div className="flex flex-col w-full   md:w-[90%]">
                      {/* <p className="font-bold text-xl text-gray-300"><span className="text-[#8C7B2B] font-bold text-xl">|||||||||</span></p> */}
                      <h1 className="text-lg text-[#800080] font-medium">
                        {" "}
                        {sponsorship.leadSponsor}
                      </h1>
                      <p><HighlightedText text={sponsorship.title} /></p>
                      <p className="text-gray-800">
                        nctId : {sponsorship.nctId}
                      </p>
                    </div>
                  </td>
                  <td className="pb-3 w-[calc(100%-90%)] hidden md:table-cell">
                    Sponsored clinical trials
                  </td>
                </tr>
              ))
            ) : (
              <p className="mb-2">No sponsorship clinical Trials for these doctor</p>
            )}
             {/* CTRI row if ctri object exists */}
            {overviewData?.ctri && (
              <tr className="border-b border-gray-200">
                <td className="pb-3">
                  <div className="flex flex-col w-full md:w-[90%]">
                    <h1 className="text-lg text-[#800080] font-medium">
                      {overviewData.ctri.sponser}
                    </h1>
                    <p><HighlightedText text={overviewData.ctri.title} /></p>
                    <p className="text-gray-800">
                      ctri_number : {overviewData.ctri.ctri_number}
                    </p>
                  </div>
                </td>
                <td className="pb-3 w-[calc(100%-90%)] hidden md:table-cell">
                  Sponsored CTRI clinical trials
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Show All / Show Less toggle */}
        {Array.isArray(overviewData?.clinical_results) &&
          overviewData.clinical_results.length > 4 && (
            <p
              onClick={() => setShowAll(!showAll)}
              className="text-blue-600 font-medium text-center mt-4 cursor-pointer hover:underline">
              {showAll
                ? "SHOW LESS COLLABORATIONS"
                : `SHOW ALL ${overviewData.clinical_results.length} COLLABORATIONS`}
            </p>
          )}
      </div>
      {/*Topics Section*/}
      {/* <div className="p-4 mx-2 my-4 bg-white rounded-md shadow-md">
        <h3 className="text-black-600 font-medium mb-4">Topics</h3>
        <div>
          <p className="  mb-4">Scientific Leader Topics</p>
          <div className="grid grid-cols-3 gap-4 border-t border-b border-gray-200 py-4">
            {scientificLeaderTopics.map((topic,index)=>(
               <div className="flex items-center gap-2" key={index}>
               <h1 className="text-[#800080] font-bold ">||||||||||</h1>
               <p className="pt-2">{topic}</p>
             </div>

            ))}
           
            
          </div>
          </div>
        </div> */}

      {/*Grant Awards */}
      {/* <div className="p-4 mx-2 my-4 bg-white rounded-md shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-black-600 font-medium">Grant</h2>
        <select className="border border-gray-300 rounded-md p-2 cursor-pointer">
          <option value="all">All time</option>
          <option value="year">This year</option>
          <option value="month">This month</option>
          <option value="week">This week</option>
          <option value="day">Today</option>
        </select>
      </div>
      <table className="w-full text-left border-collapse">
        <thead></thead>
        <tbody>
          <tr className="border-b border-gray-200 ">
            <td className="py-2 px-4">
               Cancer Center Growth
            </td>
            <td className="py-2 px-4">26 projects</td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="py-2 px-4">
               Dana-Farber/Hardvard Cancer CeCenter Breast Cancer SPORE Cancer
            </td>
            <td className="py-2 px-4">26 projects</td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="py-2 px-4">
               Dana-Farber/Hardvard Cancer CeConfirmational Breast Cancer SPORE Cancer
            </td>
            <td className="py-2 px-4">26 projects</td>
          </tr>
        </tbody>
      </table>


      </div> */}
    </div>
  );
}

export default OverviewPage;
