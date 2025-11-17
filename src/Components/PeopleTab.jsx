import React, { memo, useState, useCallback, useEffect } from "react";
import { MdStarBorder } from "react-icons/md";
import { FixedSizeList as List } from "react-window";
import { useDispatch, useSelector } from "react-redux";
import { addFavorites } from "../utils/favoriteSlice";
import { useNavigate } from "react-router-dom";
import { getAssetPath } from "../utils/imageUtils";
// import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShimmerEffect from "./ShimmerEffect";
import CryptoJS from "crypto-js";
import { favoritesApi } from "../services/api";
import { getSelectedFilterCount } from "../utils/filterSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HighlightedText from "./HighlightedText";

import { setFilterPage, setCurrentPage } from "../utils/sideSearchResultsSlice";
const PeopleTab = ({
  profiles,
  filteredDoctors,
  loading,
  // currentPage,
  // totalPages,
  // totalLocationResults,
  onPageChange,
  // totalDocotors,

  isFromVectorSearch,
}) => {
  // console.log(filtersSelected)
  // Profile item renderer for virtualized list
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false);
  const filter = useSelector((state) => state.filter);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const filtersSelected = useSelector(getSelectedFilterCount);
  const currentPage = useSelector(
    (state) => state.sideSearchResults.currentPage
  );
  const filterPage = useSelector((state) => state.sideSearchResults.filterPage);
  const totalFilterPages = useSelector(
    (state) => state.sideSearchResults.totalFilterPages
  );
  const totalPages = useSelector((state) => state.sideSearchResults.totalPages);
  const totalLocationResults = useSelector(
    (state) => state.sideSearchResults.totalLocationResults
  );
  const totalDoctors = useSelector(
    (state) => state.sideSearchResults.totalDoctors
  );

  const recordIdSecret = import.meta.env.VITE_RECORDID_SECRET


  const handleProfileSelect = useCallback((profile) => {
    setSelectedProfiles((prev) => {
      const isProfileSelected = prev.some(
        (p) => p.Record_Id === profile.Record_Id
      );
      if (isProfileSelected) {
        return prev.filter((p) => p.Record_Id !== profile.Record_Id);
      } else {
        return [...prev, profile];
      }
    });
  }, []);

  const handleProfileClick = useCallback(
    (recordId) => {
      const encryptedRecordId = CryptoJS.AES.encrypt(recordId, recordIdSecret).toString()
      const encodedProfileId = encodeURIComponent(encryptedRecordId);
      navigate(`/profile/${encodedProfileId}`);
    },
    [navigate]
  );

  const handleAddToFavorites = useCallback(async () => {
    setIsAddingToFavorites(true);
    try {
      // Extract Record_Ids from selected profiles
      const doctorIds = selectedProfiles.map(profile => profile.Record_Id);

      // Add to favorites without a group initially
      await favoritesApi.addFavorites(doctorIds, null, false);
      // Show success toast notification
      toast.success("Successfully added doctors to favorites!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Clear selection and navigate to favorites page
      setSelectedProfiles([]);
      navigate("/favourites", {
        state: {
          showCreateGroup: true,
          selectedDoctors: selectedProfiles,
        },
      });


    } catch (error) {
      console.log("error add to favorites", error.object, error.status)
      if (error.status === "401") {
        toast.error("Your session has expired.Please log in again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
        navigate("/");

      } else {
        toast.error("Error adding doctors to favorites. Please try again.", {
          position: "top-right",
          autoClose: 3000,
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
  }, [selectedProfiles, navigate]);

  const handleButtonClick = (e) => {
    e.preventDefault();
    const isFiltered = filtersSelected > 0 ? true : false;

    if (e.target.textContent === "Previous") {
      if (isFiltered) {
        onPageChange(filterPage - 1);
      } else {
        onPageChange(currentPage - 1);
      }
      console.log("Previous button clicked");
    } else if (e.target.textContent === "Next") {
      if (isFiltered) {
        // Ensure filter page update happens
        onPageChange(filterPage + 1);
      } else {
        // Ensure current page update happens
        onPageChange(currentPage + 1);
      }
      console.log("Next button clicked");
    }
  };
  const handleSelectAll = useCallback(() => {
    const isFiltered = filtersSelected > 0 ? true : false;
    const currentData = isFiltered ? filteredDoctors : profiles;

    if (selectAll) {
      setSelectedProfiles([]);
    } else {
      setSelectedProfiles([...currentData]);
    }
    setSelectAll(!selectAll);
  }, [selectAll, profiles, filteredDoctors, filtersSelected]);

  const getBars = (score) => {
    if (!score) {
      return {
        gold: "",
        gray: "|".repeat(5),
      }
    }
    const rounded = Math.round(score);
    const bars = "|".repeat(rounded);
    return {
      gold: bars,
      gray: "|".repeat(5 - rounded),
    }
  }

  const ProfilesList = ({ data }) => {
    return (
      <div className="max-h-[70vh] overflow-y-auto">
        {data.map((profile, index) => (
          <div
            key={index}
            className="border-b border-gray-200 last:border-b-0 mx-auto">
            <div className="flex items-center gap-2 p-3 md:p-5 lg:p-5 ">
              <input
                type="checkbox"
                className="w-4 h-4 rounded-md mr-2 accent-fuchsia-700 cursor-pointer"
                checked={selectedProfiles.some(
                  (p) => p.Record_Id === profile.Record_Id
                )}
                onChange={() => handleProfileSelect(profile)}
              />

              <img
                src={
                  profile["Profile_Pic_Link"] &&
                    profile["Profile_Pic_Link"] !== "NaN"
                    ? profile["Profile_Pic_Link"]
                    : getAssetPath("profileImg1.png")
                }
                alt="profile"
                className="w-15 h-15 rounded-full"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-8">
                  <p
                    onClick={() => handleProfileClick(profile.Record_Id)}
                    className="text-[#800080] font-semibold text-lg hover:underline cursor-pointer">
                    {profile.Full_Name}{" "}
                    {profile["Degree_1"] !== "NaN" && profile["Degree_1"]}{" "}
                    {profile["Degree_2"] !== "NaN" && profile["Degree_2"]}{" "}
                    {profile["Degree_3"] !== "NaN" && profile["Degree_3"]}
                  </p>

                  {/* <p className="text-[#8C7B2B] font-bold text-lg">
                                {getBars(profile["Scientific_Score"]).gold}
                            </p> */}
                  {/* <p>{profile["Scientific_Score"]}</p> */}

                  <h1 className=" font-bold text-lg">
                    <span className="text-[#8C7B2B] ">{getBars(profile["Scientific_Score"]).gold}</span>
                    <span className="text-gray-300">{getBars(profile["Scientific_Score"]).gray}</span>
                  </h1>
                </div>

                <p className="text-md">
                  {profile.Clinic_Name_1 !== "NaN" && <HighlightedText text={profile.Clinic_Name_1} />}
                </p>
                <p className="text-sm"><HighlightedText text={profile.HCP_Speciality_1} /></p>
              </div>
              {/* <div>
              <p>{profile["Scientific_Score"]}</p>
            </div> */}
            </div>

          </div>
        ))}
      </div>
    );
  };

  const Pagination = () => {
  const isFiltered = filtersSelected && filtersSelected > 0;
  const currentData = isFiltered ? filteredDoctors : profiles;

  if (!currentData || currentData.length === 0) return null;

  const total = isFiltered ? totalFilterPages : totalPages;
  const current = isFiltered ? filterPage : currentPage;

  const [gotoValue, setGotoValue] = useState("");

  const handleGoTo = (e) => {
    if (e.key === "Enter") {
      const page = parseInt(gotoValue);
      if (page >= 1 && page <= total) {
        onPageChange(page);
      }
      setGotoValue("");
    }
  };

  // DYNAMIC SLIDING PAGINATION
  const getPages = () => {
    let pages = [];

    // Always show first
    pages.push(1);

    // Left ellipsis
    if (current > 4) {
      pages.push("dot-left");
    }

    // Window around current page: (current-1, current, current+1)
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Right ellipsis
    if (current < total - 3) {
      pages.push("dot-right");
    }

    // Always show last
    if (total > 1) {
      pages.push(total);
    }

    return pages;
  };

  const pages = getPages();

  return (
    <div className="flex items-center gap-2 mt-6 mb-4 justify-center">

      {/* Prev Arrow */}
      <button
  onClick={() => {
    if (current > 1) onPageChange(current - 1);
  }}
  disabled={current === 1}
  className={`px-3 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 
      ${current === 1 && "opacity-40 cursor-not-allowed"}`}
>
  &lt;
</button>


      {/* Pages */}
      {pages.map((p, idx) => {
        if (p === "dot-left" || p === "dot-right") {
          return (
            <div
              key={idx}
              className="px-4 py-2 border rounded-lg bg-gray-50 text-gray-600"
            >
              ...
            </div>
          );
        }

        return (
          <button
            key={idx}
            onClick={() => onPageChange(p)}
            className={`px-4 py-2 border rounded-lg 
              ${current === p
                ? "bg-fuchsia-900 text-white"
                : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            {p}
          </button>
        );
      })}

      {/* Next Arrow */}
      <button
  onClick={() => {
    if (current < total) onPageChange(current + 1);
  }}
  disabled={current === total}
  className={`px-3 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 
      ${current === total && "opacity-40 cursor-not-allowed"}`}
>
  &gt;
</button>


      {/* Go To */}
      <div className="flex items-center gap-1 ml-2">
        <span className="text-sm text-gray-600">Go to</span>

        <input
          type="number"
          min="1"
          max={total}
          value={gotoValue}
          onChange={(e) => setGotoValue(e.target.value)}
          onKeyDown={handleGoTo}
          placeholder="Page"
          className="w-16 px-2 py-1 border rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400"
        />
      </div>
    </div>
  );
};

  // if(profiles.length === 0){
  //     return <h1>No profiles found</h1>
  //flex justify-between items-center border-b border-gray-200 rounded-md pb-3 ml-10 mr-10 mb-4
  // }
  console.log(profiles, " filteredDoctors")
  return (
    <div className="flex flex-col w-full md:w-[calc(100%-400px)] lg:w-[calc(100%-400px)]  ">
      <div className="flex justify-between items-center border-b border-gray-200 rounded-md pb-3 mt-4 md:mt-0 lg:mt-0 mb-2 md:mb-3 lg:mb-3 mx-2 md:mx-10 lg:mx-10">
        {isFromVectorSearch && <p>Vector Search Results: {profiles.length}</p>}
        {!isFromVectorSearch && (
          <p>
            <span className="font-semibold text-lg">
              {filtersSelected > 0 ? totalLocationResults : totalDoctors}{" "}
            </span>{" "}
            results for{" "}
            <span className="font-medium text-lg">{filtersSelected}</span>{" "}
            selected filter :
          </p>
        )}

        <button
          className={`flex items-center gap-1 px-4 py-1 rounded-md ${selectedProfiles.length > 0
            ? "bg-fuchsia-700 text-white cursor-pointer"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          disabled={selectedProfiles.length === 0}
          onClick={handleAddToFavorites}>
          <MdStarBorder size={20} />
          Add to Favorites
        </button>
      </div>
      <div className="flex items-center gap-2 ml-2 md:ml-10 lg:ml-10 pb-2">
        <input
          type="checkbox"
          className="w-4 h-4 rounded-md cursor-pointer accent-fuchsia-700"
          checked={
            filtersSelected > 0
              ? filteredDoctors?.length > 0 &&
              filteredDoctors.every((p) =>
                selectedProfiles.some((sp) => sp.Record_Id === p.Record_Id)
              )
              : profiles.length > 0 &&
              profiles.every((p) =>
                selectedProfiles.some((sp) => sp.Record_Id === p.Record_Id)
              )
          }
          onChange={handleSelectAll}
        />
        <p>Select Displayed Profiles</p>
      </div>
      <div className="flex-1 border border-gray-200 rounded-md p-5 mx-2 md:mx-10 lg:mx-10">
        <p className="text-lg font-semibold mb-4">Profiles</p>

        {loading ? (
          <div className="w-[calc(100%-400px)] flex justify-center items-center p-10 gap-2">
            <div className="spinner"></div>
            <span className="text-lg text-gray-600">Loading...</span>

            {/* <ShimmerEffect type='people'/> */}
          </div>
        ) : profiles && filtersSelected === 0 ? (
          <>
            <ProfilesList data={Array.isArray(profiles) ? profiles : []} />
            {!isFromVectorSearch && <Pagination />}
          </>
        ) : filteredDoctors &&
          filtersSelected > 0 &&
          filteredDoctors.length > 0 ? (
          // Show filtered doctors if filters are applied and results found
          <>
            <ProfilesList
              data={Array.isArray(filteredDoctors) ? filteredDoctors : []}
            />
            {!isFromVectorSearch && <Pagination />}
          </>
        ) : (
          // Show message if filters are applied but no results
          <p>No profiles found for the selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default memo(PeopleTab);
