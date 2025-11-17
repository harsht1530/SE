import React, { useState } from "react";
import { Home, Search } from "lucide-react";
import { TiStarOutline } from "react-icons/ti";
import { IoMdHome } from "react-icons/io";
import { getAssetPath } from "../../utils/imageUtils";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { GiHamburgerMenu } from "react-icons/gi";
import "react-circular-progressbar/dist/styles.css";
import { useLocation, useNavigate } from "react-router-dom";
import HCOHomeSearch from "./HCOHomeSearch";

const HCOHeader = () => {
  const [percentage, setPercentage] = useState(100);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isModelVisible, setIsModelVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchContainerRef = React.useRef(null);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCloseModal = () => {
    setIsModelVisible(false);
    setSearchTerm("");
  };

  // Check if the current page is the home page
  // This assumes the home page is at the root path "/"


  const isHomePage = location.pathname === "/";
  const isFavoritesActive = location.pathname === "/favourites";

  const isProfileDetailsPage = /^\/profile\/[^/]+$/.test(location.pathname);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  const handleInputFocus = () => {
    setIsModelVisible(true);
  }

  

  return (
    <div className="sticky top-0 z-50 bg-white  ">
      <header className="flex items-center justify-between">
        <div
          onClick={() => {
            navigate("/");
          }}
          className="cursor-pointer">
          <img
            src={getAssetPath("multiplier_logo.png")}
            alt="logo"
            className="h-12 sm:h-16 md:h-20 lg:h-20 w-auto"
          />
        </div>

        <div
          className="relative flex-1 max-w-md z-50"
          ref={searchContainerRef}
          onClick={handleInputFocus}
        >
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
          {!isHomePage && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                navigate("/advanceSearch");
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#800080] cursor-pointer hover:underline">
              Advanced
            </span>
          )}

          {/* Render the SearchModal */}
          {isModelVisible && (
           <> 
          {/* MASK (starts below header) */}
          <div
              className="fixed top-[97px] left-0 right-0 bottom-0 z-40 modal-overlay"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
              onClick={(e) => {
                if (e.target.classList.contains('modal-overlay')) handleCloseModal();
              }}
            />

          {/* MODAL (attached to input) */}
          <div className="absolute left-0 right-0 top-full mt-3 z-50 bg-white shadow-xl rounded-xl max-h-[80vh] w-[40vw] overflow-y-auto overflow-x-hidden border border-gray-200 thin-scrollbar">
              <div className="px-6 py-4">
                <HCOHomeSearch searchTerm={searchTerm} onClose={handleCloseModal} />
              </div>
            </div>
           </>
          )} 
        </div>

        <div className="hidden lg:flex items-cen</div>ter gap-6">
          {/* {location.pathname !== "/scientific-profiles" && (
            <button 
            onClick={() => navigate("/scientific-profiles")}
            className=" text-[#800080] border border-[#800080] rounded-md flex items-center gap-2 p-2 cursor-pointer hover:bg-[#931e93] hover:text-white" >
              <IoMdArrowRoundBack /><span>Back to explore</span>
            </button>
          )} */}
          {/* {isProfileDetailsPage && (
            <button className="border border-gray-300 rounded p-2 cursor-pointer">Back to network</button>
          )} */}

          {isHomePage ? (
            <div className="text-[#800080] flex flex-col items-center cursor-pointer border-b-2 border-[#800080]">
              <IoMdHome size={20} />
              <p>Home</p>
            </div>
          ):(<div 
            onClick={() => navigate("/")}
          className="text-gray-500 flex flex-col items-center cursor-pointer hover:text-[#800080] hover:border-b-2 hover:border-[#800080]">
              <IoMdHome size={20} />
              <p>Home</p>
            </div>)} 
          <div
            className={` flex flex-col items-center cursor-pointer ${ isFavoritesActive ? 'text-[#800080] border-b-2 border-[#800080] font-semibold' : 'text-gray-500 hover:text-[#800080]  hover:border-[#800080]'}`}
            onClick={() => navigate("/favourites")}
          >
            <TiStarOutline
              size={20}
              // className={isFavoritesActive ? "text-[#800080]" : ""}
            />
            <p
            // className={isFavoritesActive ? "text-[#800080]" : ""}
            >
              Favorites
            </p>
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
                src={getAssetPath("profileImg1.png")}
                alt="Profile"
                className="rounded-full w-8 h-8 object-cover"
              />
            </div>
            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-50 bg-gray-200 rounded shadow-lg z-10 p-6">
                {/* <button
                  onClick={() => {
                    setShowMenu(false);
                    handleLogout();
                  }}
                  className="w-full px-4 py-2   bg-red-500 rounded-md">
                  Logout
                </button> */}
                <p>version 25R3.8.1</p>
              </div>
            )}
          </div>
          {/* </div> */}
        </div>
      </header>
    </div>
  );
};

export default HCOHeader;
