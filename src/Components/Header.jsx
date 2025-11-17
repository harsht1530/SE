import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Search } from "lucide-react";
import { ImNewspaper } from "react-icons/im";
import { TiStarOutline } from "react-icons/ti";
import { FaArrowTrendUp } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice.js";
import { IoApps } from "react-icons/io5";
import { RxDividerVertical } from "react-icons/rx";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { GiHamburgerMenu } from "react-icons/gi";
import "react-circular-progressbar/dist/styles.css";
import { useLocation, useNavigate } from "react-router-dom";
import SearchModal from "./SearchModal";
import { IoMdArrowRoundBack } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import { getAssetPath } from "../utils/imageUtils";
import { useProductTour } from "../Context/ProductTourContext";
import { FaPersonWalkingArrowLoopLeft } from "react-icons/fa6";
import { persistor } from "../utils/appStore.js";
import { resetSidesearchResults } from "../utils/sideSearchResultsSlice.js"
import { resetFilter } from "../utils/filterSlice.js"
import { resetStore } from "../utils/appStore.js";
import axios from "axios";
import apiService from "../services/api";

const Header = React.memo(({ onStartTour }) => {
  const [percentage, setPercentage] = useState(80);
  const [showMenu, setShowMenu] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formModel, setFormModel] = useState(false);
  const [isModelVisible, setIsModelVisible] = useState(false);
  const searchContainerRef = useRef(null);
  const [showMediumScreenMenu, setShowMediumScreenMenu] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const mediumScreenMenuRef = useRef(null);

  const dispatch = useDispatch();

  const userEmail = localStorage.getItem("userEmail");
  const [userProfileData, setUserProfileData] = useState({
    firstName: null,
    lastName: null,
    email: userEmail,
    department: null,
    jobTitle: null,
    profileImage: null,
  });
  const API_BASE_URL = "https://ai.multipliersolutions.in";

  const menuRef = useRef(null);
  const editProfileRef = useRef(null);
  const { run, setRun } = useProductTour();

  const user = useSelector((state) => state.user);
  // console.log("User from Header:", user);

  const departmentOptions = ["Sales", "Marketing", "Medical", "Operations"];
  const handleEditProfileClick = useCallback(() => {
    setShowMenu(false);

    setEditProfile((prev) => !prev);
  }, []);

  // Add useEffect to handle clicks outside medium screen menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        mediumScreenMenuRef.current &&
        !mediumScreenMenuRef.current.contains(event.target)
      ) {
        setShowMediumScreenMenu(false);
      }
    }

    if (showMediumScreenMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMediumScreenMenu]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }

      if (
        editProfileRef.current &&
        !editProfileRef.current.contains(event.target)
      ) {
        setEditProfile(false);
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = useCallback(() => {
    setShowMenu((prev) => !prev);
  }, []);

  const toggleMenuDropdown = () => {
    setShowMediumScreenMenu((prev) => !prev);
  };

  const handleLogout = useCallback(() => {
    // Clear both localStorage and Redux store
    localStorage.clear();
    persistor.purge();

    navigate("/");
  }, [navigate]);

  const handleCloseModal = () => {
    setIsModelVisible(false);
  };

  // Check current path to determine active tab
  const isNewsFeedActive = location.pathname === "/newsFeed";
  const isFavoritesActive = location.pathname === "/favourites";
  const isTrendsActive = location.pathname === "/trends";

  // --- Event Handlers ---

  // Update search term and ensure model is visible while typing
  const handleInputChange = useCallback((event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    // Keep model visible if user is typing, even if they typed then deleted
    // Or you might only want it visible if newSearchTerm.length > 0
    setIsModelVisible(true);
  }, []);

  // Show model when input is focused (clicked or tabbed into)
  const handleInputFocus = () => {
    setIsModelVisible(true);
  };

  // --- Effect for Click Outside ---
  useEffect(() => {
    // Function to handle clicks anywhere in the document
    function handleClickOutside(event) {
      // Check if the ref exists and if the clicked target is NOT inside the ref'd element
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsModelVisible(false); // Click was outside, so close the model
      }
    }

    // Add the event listener when the component mounts
    // 'mousedown' is often used instead of 'click' for this purpose,
    // as it fires slightly earlier and can prevent issues with focus shifting before the check.
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup function: Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }); // Empty dependency array ensures this effect runs only once on mount and cleans up on unmount

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!userProfileData.firstName) {
      toast.error("Please enter a first name");
      return;
    }
    if (!userProfileData.lastName) {
      toast.error("Please enter a last name");
      return;
    }
    if (!userProfileData.department) {
      toast.error("Please enter a department");
      return;
    }
    if (!userProfileData.jobTitle) {
      toast.error("Please enter a job title");
      return;
    }
    if (!userProfileData.profileImage) {
      console.log(userProfileData.department, " inside the validations");
      toast.error("Please upload a profile image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("firstName", userProfileData.firstName);
      formData.append("lastName", userProfileData.lastName);
      formData.append("email", userEmail);
      formData.append("department", userProfileData.department);
      formData.append("jobTitle", userProfileData.jobTitle);
      console.log("profileImage", userProfileData.profileImage);
      formData.append("profileImage", userProfileData.profileImage);
      console.log("formdata image ", formData.get("profileImage"));
      console.log("Form Data in user update:", formData.get("profileImage"));

      console.log("User Profile Data:", userProfileData);
      // console.log("here is ths the data to be send to the backend" + JSON.stringify({
      //   firstName:userProfileData.firstName,
      //   lastName:userProfileData.lastName,
      //   email:user.email,
      //   department:userProfileData.department,
      //   jobTitle:userProfileData.jobTitle,
      // }))
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/updateUser`,
        formData
      );
      console.log(response);
      // if(response){
      //   setProfileImageUrl(response.data);
      // }

      if (response.data) {
        console.log("Profile updated successfully:", response.data.message);
        const userDetails = response.data.data;
        dispatch(addUser({ ...(user || {}), ...userDetails }));

        toast.success("Profile updated successfully!");
        setProfileImageUrl(response.data.data["profile_pic"]);
        setEditProfile(false); // Close the form after successful update
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error.response?.data?.message ||
        "Failed to update profile. Please try again."
      );
    }
  };

  const startTour = () => {
    // Navigate to newsFeed first since it's the starting point
    navigate("/newsFeed");
    // Add small delay to ensure elements are mounted
    setTimeout(() => {
      setRun(true);
    }, 1000);
  };

  return (
    <div className=" ">
      <ToastContainer />
      <header className="fixed top-0 mb-6 left-0 right-0 bg-white shadow ">
        <div
          onClick={() => {
            navigate("/newsFeed");
          }}
          className="cursor-pointer mx-0">
          <img
            src={getAssetPath("multiplier_logo.png")}
            alt="logo"
            className="h-12 sm:h-16 md:h-20 lg:h-20 w-auto"
          />
        </div>

        <div
          className="relative flex-1 max-w-sm md:max-w-sm lg:max-w-md z-50 mx-3 md:mx-0 lg:mx-0"
          ref={searchContainerRef}
          onClick={handleInputFocus}>
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black"
            size={20}
          />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            aria-label="Search Items"
            className="header"
          />
          <span
            onClick={(e) => {
              e.stopPropagation();
              if (location.pathname === "/scientific-profiles") {
                dispatch(resetSidesearchResults());
                dispatch(resetFilter());
              } else {
                navigate("/scientific-profiles");
              }

            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#800080] cursor-pointer hover:underline">
            Advanced
          </span>

          {/* Render the SearchModal */}
          {isModelVisible && (
            <>
              {/* MASK (starts below header) */}
              <div
                className="fixed top-[97px] left-0 right-0 bottom-0 z-40 modal-overlay w-full"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                onClick={(e) => {
                  if (e.target.classList.contains("modal-overlay"))
                    handleCloseModal();
                }}
              />

              {/* MODAL (attached to input) */}
              <div className="absolute left-0 right-0 top-full mt-3 z-50 bg-white shadow-xl rounded-xl max-h-[80vh] min-w-[50vw] overflow-y-auto overflow-x-hidden border border-gray-200 thin-scrollbar">
                <div className="px-6 py-4">
                  <SearchModal
                    searchTerm={searchTerm}
                    onClose={handleCloseModal}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-6">
          {location.pathname !== "/scientific-profiles" && (
            <button
              onClick={() => navigate("/scientific-profiles")}
              className=" text-[#800080] border border-[#800080] rounded-md flex items-center gap-2 p-2 cursor-pointer hover:bg-[#931e93] hover:text-white">
              <IoMdArrowRoundBack />
              <span>Back to explore</span>
            </button>
          )}
          <div
            className={`step-newsfeed text-gray-500 flex flex-col items-center cursor-pointer ${isNewsFeedActive ? "border-b-2 border-[#800080]" : ""
              }`}
            onClick={() => navigate("/newsFeed")}>
            <ImNewspaper
              size={20}
              className={isNewsFeedActive ? "text-[#800080]" : ""}
            />
            <p className={isNewsFeedActive ? "text-[#800080]" : ""}>NewsFeed</p>
          </div>
          <div
            className={`step-favourites text-gray-500 flex flex-col items-center cursor-pointer ${isFavoritesActive ? "border-b-2 border-[#800080]" : ""
              }`}
            onClick={() => navigate("/favourites")}>
            <TiStarOutline
              size={20}
              className={isFavoritesActive ? "text-[#800080]" : ""}
            />
            <p className={isFavoritesActive ? "text-[#800080]" : ""}>
              Favorites
            </p>
          </div>
          <div
            className={`text-gray-500 flex flex-col items-center cursor-pointer ${isTrendsActive ? "border-b-2 border-[#800080]" : ""
              }`}
            onClick={() => navigate("/trends")}>
            <FaArrowTrendUp
              size={20}
              className={isTrendsActive ? "text-[#800080]" : ""}
            />
            <p className={isTrendsActive ? "text-[#800080]" : ""}>Trends</p>
          </div>

          {/* <div className="relative inline-block text-left"> */}
          {/* Profile image with circular progress */}
          <div
            className="relative w-12 h-12 cursor-pointer"
            onClick={toggleMenu}>
            <CircularProgressbar
              value={percentage}
              text={`${percentage}%`}
              styles={buildStyles({
                textSize: "26px",
                pathColor: "#4285F4",
                textColor: "#4285F4",
                trailColor: "#d6d6d6",
              })}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={user?.profile_pic || getAssetPath("profileImg1.png")}
                alt="Profile"
                className="rounded-full w-8 h-8 object-cover"
              />
            </div>
            {editProfile && (
              <div
                ref={editProfileRef}
                className="absolute top-full right-0 mt-2 w-120  py-5 mb-5 bg-white rounded shadow-lg z-100 p-6 flex flex-col gap-6">
                <h1 className="flex items-center justify-center font-bold">
                  Add Details:
                </h1>
                <form onSubmit={(e) => handleProfileSubmit(e)}>
                  <div className="flex flex-col gap-4">
                    <input
                      value={userProfileData.firstName}
                      onChange={(e) =>
                        setUserProfileData({
                          ...userProfileData,
                          firstName: e.target.value,
                        })
                      }
                      type="text"
                      placeholder="First Name"
                      className="border border-gray-300 rounded-md p-2"
                    />
                    <input
                      type="text"
                      value={userProfileData.lastName}
                      onChange={(e) =>
                        setUserProfileData({
                          ...userProfileData,
                          lastName: e.target.value,
                        })
                      }
                      placeholder="Last Name"
                      className="border border-gray-300 rounded-md p-2"
                    />
                    <input
                      type="email"
                      value={userEmail || ""}
                      placeholder={userEmail || "Email"}
                      disabled
                      className="border border-gray-300 rounded-md p-2 bg-gray-50"
                    />
                    <input
                      type="text"
                      value={userProfileData.jobTitle}
                      onChange={(e) =>
                        setUserProfileData({
                          ...userProfileData,
                          jobTitle: e.target.value,
                        })
                      }
                      placeholder="Job Title"
                      className="border border-gray-300 rounded-md p-2"
                    />
                    <label
                      for="departments"
                      className="opacity-80 text-gray-800">
                      Choose your Department:
                    </label>
                    <select
                      name="departments"
                      id="departments"
                      value={userProfileData.department}
                      onChange={(e) =>
                        setUserProfileData({
                          ...userProfileData,
                          department: e.target.value,
                        })
                      }
                      className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-md
                      bg-white text-gray-800
                      focus:outline-none focus:ring-2 focus:border-transparent
                 
                      cursor-pointer
                      transition-colors duration-200">
                      {departmentOptions.map((department, index) => (
                        <option key={index}>
                          <p className="text-gray-800 rounded-md p-4">
                            {department}
                          </p>
                        </option>
                      ))}
                    </select>
                    <label
                      for="imageUpload"
                      className="opacity-80 text-gray-800">
                      Upload Profile Image:
                    </label>
                    <input
                      type="file"
                      id="imageUpload"
                      name="imageUpload"
                      accept="image/*"
                      // value={userProfileData.profileImage}
                      className="
                      block
                      w-full
                      text-sm
                      text-gray-600
                      file:mr-4            /* margin right for native button */
                      file:py-2            /* padding for native button */
                      file:px-4
                      file:rounded-md
                      file:border
                      file:border-gray-300
                      file:text-gray-700
                      file:bg-white
                      file:cursor-pointer
                      file:hover:bg-purple-100
                      file:transition-colors
                      file:duration-200
                      rounded-md
                      border
                      border-gray-300
                      focus:outline-none
                      focus:ring-2
                      focus:ring-purple-600
                      focus:border-transparent
                      cursor-pointer"
                      onChange={(e) =>
                        setUserProfileData({
                          ...userProfileData,
                          profileImage: e.target.files[0],
                        })
                      }
                    />

                    <button
                      type="submit"
                      className="mb-2 p-2 rounded-md bg-[#800080] text-white hover:opacity-80">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            )}
            {/* Dropdown Menu */}
            {showMenu && (
              <div
                ref={menuRef}
                className="absolute right-0 mt-2 w-80 bg-white rounded shadow-lg z-10 p-6 flex flex-col gap-6">
                {/* <button className="p-2 border rounded-md" onClick={()=> !formModel}>Add user details</button> */}
                <h4>Version 25R4.1.1</h4>
                <button
                  className="p-2 rounded-md bg-[#800080] font-medium flex items-center text-white gap-2 justify-center"
                  onClick={() => {
                    console.log("Start Tour button clicked");
                    onStartTour();
                  }}>
                  <FaPersonWalkingArrowLoopLeft size={20} />
                  Start Tour
                </button>
                <button
                  className="p-2 rounded-md bg-gray-400 text-white hover:opacity-80"
                  onClick={() =>
                    window.open(
                      "https://docs.google.com/forms/d/e/1FAIpQLSfPdOOYHQTtq05RvRI4KZI_v2gTQcBu6TGi06xKmDKH45tb2g/viewform?usp=header",
                      "_blank"
                    )
                  }>
                  Add Doctors
                </button>
                <button
                  className="p-2 rounded-md bg-gray-400 text-white hover:opacity-80"
                  onClick={handleEditProfileClick}>
                  Edit Profile
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    handleLogout();
                  }}
                  className=" px-4 py-2   bg-red-500 rounded-md">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/*medium and mobile screens with menu icon*/}
        <div className="relative lg:hidden flex items-center gap-6">
          <GiHamburgerMenu
            size={30}
            className="text-[#800080] lg:hidden cursor-pointer"
            onClick={toggleMenuDropdown}
          />

          {showMediumScreenMenu && (
            <div ref={mediumScreenMenuRef} className="absolute top-full right-0  mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
              <div className="flex flex-col p-4 gap-2">
                {/*NewsFeed */}
                <div
                  className={`text-gray-500 flex gap-2 items-center cursor-pointer ${isNewsFeedActive ? " border-[#800080]" : ""
                    }`}
                  onClick={() => navigate("/newsFeed")}>
                  <ImNewspaper
                    size={20}
                    className={isNewsFeedActive ? "text-[#800080]" : ""}
                  />
                  <p className={isNewsFeedActive ? "text-[#800080]" : ""}>
                    NewsFeed
                  </p>
                </div>

                {/*Favorites */}
                <div
                  className={`text-gray-500 flex gap-2 items-center cursor-pointer ${isFavoritesActive ? "border-[#800080]" : ""
                    }`}
                  onClick={() => navigate("/favourites")}>
                  <TiStarOutline
                    size={20}
                    className={isFavoritesActive ? "text-[#800080]" : ""}
                  />
                  <p className={isFavoritesActive ? "text-[#800080]" : ""}>
                    Favorites
                  </p>
                </div>

                {/*Trends */}
                <div
                  className={`text-gray-500 flex gap-2 items-center cursor-pointer ${isTrendsActive ? " border-[#800080]" : ""
                    }`}
                  onClick={() => navigate("/trends")}>
                  <FaArrowTrendUp
                    size={20}
                    className={isTrendsActive ? "text-[#800080]" : ""}
                  />
                  <p className={isTrendsActive ? "text-[#800080]" : ""}>
                    Trends
                  </p>
                </div>

                {/* Profile image with circular progress */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-500 p-1 rounded-md hover:bg-red-500 hover:text-white ">
                  <CiLogout size={20} className="" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
    </div>
  );
});

export default Header;
