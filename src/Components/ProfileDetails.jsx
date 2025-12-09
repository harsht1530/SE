import React, { useState, memo, useEffect, useRef, useCallback } from "react";
import { CiLocationOn } from "react-icons/ci";
import { MdOutlineMail } from "react-icons/md";
import { LuBarcode } from "react-icons/lu";
import { BsTwitterX } from "react-icons/bs";
import { GoogleMap, MarkerClusterer, Marker, useLoadScript, InfoWindow } from '@react-google-maps/api';
import { FaBrain } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CryptoJS from "crypto-js";

import { RiGeminiFill, RiGeminiLine } from "react-icons/ri";
import { OpenAI } from "openai";
import { useDispatch, useSelector } from "react-redux";
import { SiOpenai } from "react-icons/si";
import DoctorCV from "./DownloadCv";
import { favoritesApi } from "../services/api";
import { addFavorites, removeFavorites } from "../utils/favoriteSlice";
import apiService from "../services/api";
import axios from 'axios';



import {
  FaLinkedin,
  FaFacebookF,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa";
import { getAssetPath } from "../utils/imageUtils";
import "../index.css"; // Import your CSS file for styles
import { useScientificProfileData } from "../Context/ScientificProfileDataContext";
import HighlightedText from "./HighlightedText";
import ".././index.css";
import { useParams } from "react-router-dom";
const tabsSummary = [
  "DOCTOR PROFILE SUMMARY",
  "PUBMED SUMMARY",
  "DIGITAL SUMMARY",
];


// const reachFlag = useSelector((state) => state.reachFlag.value);


// useEffect(() => {
//   console.log("Current ReachFlag***%%%%%%%^^^^^^^^^^^^^^^^^^______:", reachFlag);
// }, [reachFlag]);


const ProfileDetails = memo(({ profile, clinicalData }) => {
  const [reachFlag, setReachFlag] = useState("Local");
  const [regions, setRegions] = useState({})
  const REACT_APP_GOOGLE_MAPS_API_KEY = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;
  const [markers, setMarkers] = useState([]);
  

  const [isAnimating, setIsAnimating] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(tabsSummary[0]);
  const [aiSummary, setAiSummary] = useState("");
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [favorites, setFavorites] = useState([])
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(false)
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false)
  const [showFullDegree, setShowFullDegree] = useState(false);
  const menuRef = useRef(null);
  const aiMenuRef = useRef(null); // Add new ref for live AI summary modal
  const recordIdSecret = import.meta.env.VITE_RECORDID_SECRET
  const { encryptedProfileId } = useParams();

  const decryptRecordId = (encryptedRecordId) => {
    const bytes = CryptoJS.AES.decrypt(encryptedRecordId, recordIdSecret);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  const profileId = decryptRecordId(encryptedProfileId);
  // console.log("888888888888888888********************", reachFlag);

   const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: REACT_APP_GOOGLE_MAPS_API_KEY,
    });

  useEffect(() => {
    const fetchCoAuthorsLocations = async () => {
      try {
        const response = await apiService.profiles.scientificProfile(profileId);
        // console.log("^^^^^^^^^^^^^ scientific profile response in profile details page", response);

        let countryCount = {};

        if (response && response.top_10_coauthors) {
          const locationPromises = response.top_10_coauthors.map(async (coAuthor) => {
            const address = coAuthor.affiliations && coAuthor.affiliations[0];

            if (!address) {
              console.log('No valid address for:', coAuthor.name);
              return null;
            }

            const response = await axios.get(
              `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${REACT_APP_GOOGLE_MAPS_API_KEY}`
            );

            if (response.data.results.length > 0) {
              const result = response.data.results[0];
              const countryComponent = result.address_components?.find(
                component => component.types?.includes("country")
              );

              if (countryComponent) {
                // console.log("==============================001", countryComponent.long_name);
                const countryName = countryComponent.long_name;
                countryCount[countryName] = (countryCount[countryName] || 0) + 1;
              }

              return {
                position: result.geometry.location,
                name: coAuthor.name,
                institution: coAuthor.affiliations[0]
              };
            }
            return null;
          });


          const locations = (await Promise.all(locationPromises)).filter(loc => loc !== null);
          setMarkers(locations);
          setRegions(countryCount);
          // console.log("Countries count from co-authors' locations:------********", countryCount);
        }
      } catch (error) {
        console.error('Error fetching co-authors:', error);
      } 
    };

    fetchCoAuthorsLocations();
  }, [profileId]);


    const calculateReachFlag = useCallback(() => {
      const countryCount = Object.keys(regions).length;
      if (countryCount >= 5) return "GLOBAL";
      if (countryCount > 1) return "REGIONAL";
      if (countryCount === 1) return "NATIONAL";
      return "Local";
    }, [regions]);
  
    useEffect(() => {
    const newReachFlag = calculateReachFlag();
    setReachFlag(newReachFlag);
  }, [regions, calculateReachFlag, ]);
  
  
    useEffect(() => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('reachFlagUpdated', { 
          detail: { reachFlag } 
        }));
      }
    }, [reachFlag]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsModalOpen]);

  useEffect(() => {
    const fetchFavorites = async () => {
      setIsFavoritesLoading(true);
      try {
        const response = await favoritesApi.getFavorites();
        console.log("favorite profiles ", response.data)
        setFavorites(response.data);
      } catch (e) {
        console.log("error in the useEffect of the getting favorites api", e);
      } finally {
        setIsFavoritesLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  useEffect(() => {
    function handleAiClickOutside(event) {
      if (aiMenuRef.current && !aiMenuRef.current.contains(event.target)) {
        setAiModalOpen(false);
      }
    }
    document.addEventListener("mousedown", handleAiClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleAiClickOutside);
    };
  }, [setAiModalOpen]);

  const { scientificProfileData, loading } = useScientificProfileData();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsModalOpen]);

  // const dispatch = useDispatch();

  // const favoritesList = useSelector((state) => state.favorites.doctors);

  if (!profile) return null;

  let isFavorite = favorites?.some(
    (fav) => fav.Record_Id === profile.Record_Id
  );

  // const handleAddToFavorites = () => {
  //   dispatch(addFavorites([profile]));
  // };

  const handleAddToFavorites = async () => {
    setIsAddingToFavorites(true);
    try {
      // Extract Record_Ids from selected profiles
      // const doctorIds = selectedProfiles.map(profile => profile.Record_Id);

      // Add to favorites without a group initially
      await favoritesApi.addFavorites([profile.Record_Id], null, false);
      // Show success toast notification
      setFavorites(prevFavoritites => [...prevFavoritites, profile])
      toast.success("Successfully added to favorites!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Clear selection and navigate to favorites page
      // navigate("/favourites", {
      //   state: {
      //     showCreateGroup: true,
      //     selectedDoctors: selectedProfiles,
      //   },
      // });


    } catch (error) {
      console.log("error add to favorites", error.object, error.status)
      if (error.message === "401") {
        toast.error("Your session has expired.Please log in again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
        // navigate("/");

      } else {
        toast.error(`error adding to Favorites!!  ${error?.message}`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      }

      console.error("Error adding doctors to favorites:", error);
      // Handle error (show notification, etc.)
    } finally {
      setIsAddingToFavorites(false);
    }
  };

  // const handleRemoveFromFavorites = () => {
  //   dispatch(removeFavorites([profile.Record_Id]));
  // };

  const handleRemoveFromFavorites = async () => {
    const toastId = toast.loading("Removing from favorites...")
    try {
      // console.log("selected profiles before removing ", selectedProfiles);
      // const selectedIds = selectedProfiles.map(profile => profile.Record_Id);

      await favoritesApi.removeFavorites([profile.Record_Id]);


      // setProfiles(prev =>
      //   prev.filter(profile => !selectedIds.includes(profile.Record_Id))
      // );

      // setSelectedProfiles(prev =>
      //   prev.filter(p => !selectedIds.includes(p.Record_Id))
      // );
      setFavorites(prevFavorites => prevFavorites.filter(fav => {
        return fav.Record_Id !== profile.Record_Id
      }))

      // setSelectAll(false);
      toast.update(toastId, {
        render: `removed from favorites`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      console.log(error);
      toast.update(toastId, {
        render: "Failed to remove from segment",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  let url = `https://www.google.com/maps?q=${profile["Latitude_1"]},${profile["Longitude_1"]}`;

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsModalOpen(true);
      setAiModalOpen(false);
      setIsAnimating(false);
    }, 300); // Match your animation duration
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleCloseAiModal = () => {
    setAiModalOpen(false);
  };

  const generateAISummary = async () => {
    if (!profile) return;
    setIsGenerating(true);
    const prompt = `Generate a compelling and insightful 200-word professional overview of the healthcare expert described in the JSON data below into 3 separate paragraphs. The summary should help pharmaceutical sales representatives, medical affairs professionals, and marketing teams quickly understand the HCP's background, focus areas, and scientific influence to support effective engagement and personalized outreach.
 
**STRICTLY ADHERE TO THE PROVIDED DATA.**
 
**Key Instructions:**
 
1. **Concise Narrative Format:** Write a clear, well-structured paragraph-style summary (no bullet points) that reads smoothly and professionally.
 
2. **Information Source:** Use **ONLY** the information available in the 'Doctor Profile' and 'Scientific Profile' JSON provided below. Do **NOT** assume, extrapolate, or create any additional details.
 
3. **Avoid Hallucination:**
   - Do not infer or invent qualifications, titles, research topics, or professional roles.
   - If certain information (e.g., clinical trials, advisory roles, certifications) is not explicitly present in the data, **omit it without mentioning the absence**.
   - Use 'actively_published_years' ONLY to indicate research activity duration—not as a substitute for total clinical experience.
 
// 4. **Include the Following Where Available (Integrate Seamlessly):**
//    - **Current Role & Education:** Mention the doctor’s title, degrees (e.g., MBBS, MS), and institutional affiliations.
//    - **Specializations & Location:** Highlight clinical specialties and city or hospital they are associated with.
//    - **Research Interests:** Derive from publication titles, keywords, or topics.
//    - **Notable Publications:** Reference 1–2 impactful papers, including journal name and year.
//    - **Scientific Metrics:** Integrate available statistics such as 'total_articles', 'total_citations', 'average_citations_per_article', and 'average_coauthors_per_article'.
//    - **Coauthor Network:** Name 1–2 key collaborators from the 'top_10_coauthors' to underscore collaboration strength.
 
// **Target Use Case:** This profile will help commercial and medical teams tailor their engagement approach, identify scientific alignment opportunities, and build informed relationships.
 
**Healthcare Professional's Profile Data:**

${JSON.stringify(
      Object.fromEntries(
        Object.entries(profile).filter(([key]) => key !== "hcp_summary")
      ),
      null,
      2
    )}

**Healthcare Professional's Scientific Information:**
${JSON.stringify(
      {
        ...scientificProfileData,
        top_5_cited_artciles: scientificProfileData.top_5_cited_artciles.slice(
          0,
          2
        ),
      },
      null,
      2
    )}
`;
    try {
      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        //  tools: [ { type: "web_search_preview" } ],
        messages: [
          {
            role: "system",
            content:
              "You are a professional medical profile writer specializing in creating comprehensive, factual, and concise summaries for medical professionals based strictly on provided data. Always adhere to instructions regarding missing information.",
          },
          {
            role: "user",
            content: prompt,
            // The entire content is now a single string using template literals.
            // JSON.stringify(..., null, 2) makes the JSON pretty-printed with 2-space indentation,
            // which helps the AI parse it better.
          },
        ],
        max_tokens: 1024,
        temperature: 0,
      });

      setAiSummary(response.choices[0].message.content);
    } catch (error) {
      console.error("Error generating AI summary:", error);
      setAiSummary("Failed to generate summary. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAISummaryClick = () => {
    generateAISummary();
    setAiModalOpen(true);
    setIsModalOpen(false);
  };

  const handleAiCloseModal = () => {
    setAiModalOpen(false);
  };

  return (
    <div className="w-full flex flex-col items-start md:flex md:flex-row md:items-center lg:flex lg:flex-row lg:items-center gap-4 md:gap-10 lg:gap-10 p-4 md:p-10 lg:p-10 ">
      {/* Profile image and social links */}
      <div className="flex flex-row md:flex-col lg:flex-col gap-4 cursor-pointer ">
        <img
          src={
            profile?.Profile_Pic_Link &&
              profile.Profile_Pic_Link !== "NaN" &&
              profile.Profile_Pic_Link !== "null"
              ? profile.Profile_Pic_Link
              : getAssetPath("profileImg1.png")
          }
          className="rounded-full h-50 w-50 object-cover"
          alt={`${profile?.Full_Name || "User"}'s profile`}
          loading="lazy"
        />
        <div className="flex flex-col items-center gap-2">
          <div className="flex bg-[#800080] text-white rounded-md mx-auto h-9">
            {false && (
              <a
                href={profile.Facebook_URL !== "Nan" ? profile.Facebook_URL : ""}
                target="_blank"
                rel="noopener noreferrer"
                className="m-2">
                <FaFacebookF size={20} aria-label="Facebook" />
              </a>
            )}
            {profile.Instagram !== "NaN" && (
              <a
                href={profile.Instagram !== "NaN" && profile.Instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="m-2">
                <FaInstagram size={20} aria-label="Instagram" />
              </a>
            )}
            {false && (
              <a
                href={profile.Youtube_URL !== "NaN" && profile.Youtube_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="m-2">
                <FaYoutube size={20} aria-label="YouTube" />
              </a>
            )}
            {profile.Twitter_Url !== "NaN" && (
              <a
                href={profile.Twitter_Url !== "NaN" && profile.Twitter_Url}
                target="_blank"
                rel="noopener noreferrer"
                className="m-2">
                <BsTwitterX size={20} aria-label="Twitter" />
              </a>
            )}
            {profile.LinkedIn_Url !== "NaN" && (
              <a
                href={profile.LinkedIn_Url !== "NaN" && profile.LinkedIn_Url}
                target="_blank"
                rel="noopener noreferrer"
                className="m-2">
                <FaLinkedin size={20} aria-label="LinkedIn" />
              </a>
            )}
          </div>

        </div>
      </div>

      <div className="flex-1 gap-2 mr-10 doctor-profile-section">
        {/* Profile header */}
        <div className="flex justify-between ">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-medium text-black">
              {profile.Full_Name}
            </h1>
{(() => {
  const degrees = [
    profile["Degree_1"],
    profile["Degree_2"],
    profile["Degree_3"],
    profile["Degree_4"],
    profile["Degree_5"],
  ].filter((degree) => degree && degree !== "NaN");

  const fullText = degrees.join(", ");

  const shortText =
    fullText.length > 50 ? fullText.slice(0, 50) + "..." : fullText;

  return (
    <p className="">
      {showFullDegree ? fullText : shortText}

      {fullText.length > 50 && (
        <span
          className="text-blue-600 cursor-pointer ml-2"
          onClick={() => setShowFullDegree((prev) => !prev)}
        >
          {showFullDegree ? "See less" : "See more"}
        </span>
      )}
    </p>
  );
})()}


          </div>
          {/*cv, summary and favourites buttons */}
          <div className="hidden lg:flex gap-6 items-center relative">
            <DoctorCV profile={profile} scientificProfileData={scientificProfileData} clinicalData={clinicalData} />
            {/* <img src={getAssetPath('AIImage.png')} alt="AI Summary" className="h-6 w-6" /> */}
            {/* <RiGeminiLine size={20} />
              AI Summary
            {/* Modal */}
            {isModalOpen && (
              <div
                ref={menuRef}
                className="absolute  top-15 right-0   z-10 w-200">
                <div
                  className=" bg-white p-6 rounded-lg shadow-lg bubble-box"
                  style={{ position: "relative" }}>
                  <p className="text-lg font-medium pb-2">Summary</p>
                  <p>{profile.hcp_summary}</p>

                  <div className="flex justify-end">
                    <button
                      className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-[#800080]"
                      onClick={handleCloseModal}>
                      Close
                    </button>
                  </div>

                  {/* Tail of the speech bubble */}
                  <div
                    className="shadow-lg rounded-md"
                    style={{
                      position: "absolute",
                      top: "-10px",
                      right: "210px", // Center the tail horizontally
                      width: 0,
                      height: 0,
                      borderLeft: "10px solid transparent",
                      borderRight: "10px solid transparent",
                      borderBottom: "10px solid #ccc", // White tail
                      // Soft shadow
                      zIndex: 2,
                    }}></div>
                </div>
              </div>
            )}
            <div className="flex flex-row items-center justify-center Ai-summary">

              <RiGeminiFill className="text-[#800080] text-2xl animate-spin-slow" />
              <button
                className={`
              bg-gray-200 text-black font-medium rounded-md p-2 flex items-center gap-2 hover:bg-[#800080] hover:text-white
            `}
                onClick={handleAISummaryClick}
                aria-label="Show AI Summary"
                title="Show AI Summary">
                {/* <FaBrain className="h-6 w-6" /> Sparkles icon for AI */}
                {/* <img src={getAssetPath('AIImage.png')} alt="AI Summary" className="h-6 w-6" /> */}
                {/* <RiReactjsLine size={20} /> */}
                Scientific Expert Summary
              </button>
            </div>
            {/* Modal */}
            {aiModalOpen && (
              <div
                ref={aiMenuRef}
                className="absolute top-15 right-0 z-10 w-200">
                <div
                  className="bg-white p-6 rounded-lg shadow-lg bubble-box"
                  style={{ position: "relative" }}>
                  <div className="flex items-center gap-2 mb-4">
                    <RiGeminiFill className="text-[#800080] text-2xl animate-spin-slow" />
                    <p className="text-lg font-medium text-gray-800">Summary</p>
                  </div>
                  <p
                    className="text-gray-700 leading-relaxed tracking-wide text-justify whitespace-pre-line
                    prose prose-lg max-w-none px-4 py-3 rounded-lg bg-gray-50">
                    {aiSummary}
                  </p>

                  <div className="flex justify-end items-center gap-3">
                    {/* <div className="flex items-center"> */}
                    <div className="flex items-center justify-center flex-row ">
                      <SiOpenai
                        className="text-[#800080] text-2xl cursor-pointer hover:scale-110 hover:animate-spin-slow m-4 mb-0"
                        onClick={handleAISummaryClick}
                        title="Regenerate Summary"
                      />
                      {/* </div> */}
                      <button
                        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-[#800080]"
                        onClick={handleAiCloseModal}>
                        Close
                      </button>
                    </div>
                  </div>

                  {/* Tail of the speech bubble */}
                  <div
                    className="shadow-lg rounded-md"
                    style={{
                      position: "absolute",
                      top: "-10px",
                      right: "210px", // Center the tail horizontally
                      width: 0,
                      height: 0,
                      borderLeft: "10px solid transparent",
                      borderRight: "10px solid transparent",
                      borderBottom: "10px solid #ccc", // White tail
                      // Soft shadow
                      zIndex: 2,
                    }}></div>
                </div>
              </div>
            )}

            {isFavorite ? (
              <button
                className="text-white bg-[#7c0f7c] button rounded-md hover:bg-[#693865]"
                aria-label="Add to segment"
                onClick={handleRemoveFromFavorites}>
                REMOVE FROM Segment
              </button>
            ) : (
              <button
                className="text-white bg-[#800080] button rounded-md hover:bg-[#693865]"
                aria-label="Add to segment"
                onClick={handleAddToFavorites}>
                ADD TO Segment
              </button>
            )}
          </div>
        </div>

        <hr className="text-gray-400" />

        {/* Profile details */}
        <div className="mt-2">
          {profile.Clinic_Name_1 !== "NaN" && (
            <p className="text-[#696969]"><HighlightedText text={profile.Clinic_Name_1} /></p>
          )}
          {profile["HCP_Speciality_1"] !== "NaN" && (
            <p className="text-[#545454]"><HighlightedText text={profile["HCP_Speciality_1"]} /></p>
          )}
          {/* <p className="text-[#545454]">Physician</p> */}

          <div className="w-full flex items-center gap-2 mt-2">
            <a href={url} target="_blank">
              {profile.Latitude_1 &&
                profile.Longitude_1 &&
                profile.Address_1 !== "NaN" && (
                  <CiLocationOn
                    size={20}
                    aria-hidden="true"
                    className="bg-[#de76e3] hover:bg-[#bf60b7]"
                  />
                )}
            </a>
            {profile.Address_1 !== "NaN" && (
              <p className="text-[#545454]"><HighlightedText text={profile.Address_1} /></p>
            )}
          </div>

          <div className="flex w-full gap-6 mt-3 cursor-pointer">
            {profile?.HCP_Email_1 &&
              profile.HCP_Email_1 !== "NaN" &&
              profile.HCP_Email_1 !== "null" && (
                <div className="flex items-center gap-2">
                  <MdOutlineMail
                    size={20}
                    className="text-[#545454]"
                    aria-hidden="true"
                  />
                  <a
                    href={`mailto:${profile.HCP_Email_1}`}
                    className="text-blue-500 hover:underline">
                    {profile.HCP_Email_1}
                  </a>
                </div>
              )}

            {profile.Phone !== "NaN" && (
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#545454]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                {profile.Phone !== "NaN" && (
                  <span className="text-[#545454]">{profile.Phone}</span>
                )}
              </div>
            )}

            <div className="flex items-center gap-2">
              <LuBarcode
                size={20}
                className="text-[#545454]"
                aria-hidden="true"
              />
              <span className="text-[#545454]">MID {profile.Record_Id}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">

            {/* {profile["reach_flag"] !== "NaN" && (
              <button className="global-reach-button">
                {profile?.reach_flag?.toUpperCase()} REACH
              </button>
            )} */}

              <button className="global-reach-button">
                {reachFlag} REACH
              </button>
            {
              profile["Emerging_Expert"] && (
                <button className="global-reach-button">
                  Emerging Expert
                </button>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProfileDetails;
