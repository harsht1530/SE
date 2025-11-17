import React, {
  useState,
  useEffect,
  useCallback,
  lazy,
  Suspense,
  useMemo,
} from "react";
import { Search } from "lucide-react";
import { IoMenuSharp } from "react-icons/io5";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdStarBorder } from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";
import Header from "../components/Header";
// import DualRangeSlider from "../components/DualRangeSlider";
import TabNavigation from "../Components/TabNavigation";
import { getSelectedFilterCount } from "../utils/filterSlice";
import { useSelector, useDispatch } from "react-redux";
import {
  resetFilteredDoctors,
  setFilteredDoctors,
} from "../utils/filteredDoctorsSlice";
import ShimmerEffect from "../Components/ShimmerEffect";
import {
  setscientificTotalPages,
  setTotalFilterPages,
  setTotalLocationResults,
  setTotalPubmedResults,
  setCurrentPage,
  setFilterPage,
  setTotalPages,
  setScientificCurrentPage,
  setTotalDoctors,
  setProfiles,
} from "../utils/sideSearchResultsSlice";
import { SiTaketwointeractivesoftware } from "react-icons/si";

// Replace with this
const ScientificContentTab = lazy(() =>
  import("../Components/ScientificContentTab")
);
const FilterPanel = lazy(() => import("../Components/FilterPanel"));
const PeopleTab = lazy(() => import("../Components/PeopleTab"));
const CongressPage = lazy(() => import("./CongressPage"));
const tabs = ["Scientific Experts", "Congresses", "Scientific Content"];

/**
 * @component ScientificProfileListPage
 * @description Main scientific profile listing page with tabbed interface for viewing healthcare professionals,
 * congresses, and scientific content. Features filtering capabilities and lazy-loaded components.
 *
 * @state
 * - activeTab {string} - Current active tab ("People", "Congresses", "Scientific Content")
 * - profiles {Array} - List of all healthcare professional profiles
 * - loading {boolean} - General loading state
 * - loadingProfiles {boolean} - Specific loading state for profiles
 * - error {string|null} - Error state for API calls
 * - selectedProfiles {Array} - List of selected profiles for bulk actions
 * - isFromSideSearch {boolean} - Flag indicating if profiles are fetched from a side search
 *
 * @methods
 * - handleTabChange: Changes the active tab
 * - handleSelectAll: Toggles selection of all profiles
 * - handleBrowseAll: Performs a filtered search based on criteria
 *
 * @effects
 * - useEffect: Fetches profiles on initial render
 * - useEffect: Fetches profiles based on search criteria on activeTab change
 *
 *
 * @api 
 * - profiles.getAll: Fetches all healthcare professional profiles
 * - profiles.sideSearch: Performs filtered search based on criteria
 *   Returns: {
 *     location_results: Array<Doctor>,
 *     pubmed_results: Array<Publication>
 *   }
 *
 * @subcomponents
 * - Header: Navigation header
 * - TabNavigation: Props: {
 *     tabs: string[],
 *     activeTab: number,
 *     onTabChange: Function
 *   }
 * - FilterPanel: Props: {
 *     handleBrowseAll: Function
 *   }
 * - PeopleTab: Props: {
 *     profiles: Array,
 *     loading: boolean,
 *     error: string,
 *     filtersSelected: number
 *   }
 * - ScientificContentTab: Props: {
 *     publicationsData: Array,
 *     filtersSelected: number,
 *     isFromSideSearch: boolean
 *   }
 * - CongressPage: Congress information display
 *
 * @redux
 * - filteredDoctors: Stores filtered search results
 * - setFilteredDoctors: Action to update filtered results
 *
 * @lazyLoading
 * - ScientificContentTab
 * - FilterPanel
 * - PeopleTab
 *
 * @tabs
 * - People: Healthcare professional listings
 * - Congresses: Medical congress information
 * - Scientific Content: Research publications and content
 *
 * @example
 * <ScientificProfileListPage />
 *
 * @returns {JSX.Element} A page with tabbed interface for scientific profile management
 */

const ScientificProfileListPage = () => {
  const [activeTab, setActiveTab] = useState("Scientific Experts");

  const [selectAll, setSelectAll] = useState(false);
  // const [profiles, setProfiles] = useState([]);
  const profiles = useSelector((state) => state.sideSearchResults.profiles);
  const [loading, setLoading] = useState(false);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [isFromSideSearch, setIsFromSideSearch] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const currentPage = useSelector(
    (state) => state.sideSearchResults.currentPage
  );
  const filterPage = useSelector((state) => state.sideSearchResults.filterPage);
  const totalFilterPages = useSelector(
    (state) => state.sideSearchResults.totalFilterPages
  );

  const totalPages = useSelector((state) => state.sideSearchResults.totalPages);

  const filteredDoctors = useSelector(
    (state) => state.filteredDoctors.filteredDoctors
  );
  const scientificTotalPages = useSelector(
    (state) => state.sideSearchResults.scientificTotalPages
  );
  const scientificCurrentPage = useSelector(
    (state) => state.sideSearchResults.scientificCurrentPage
  );
  const totalDoctors = useSelector(
    (state) => state.sideSearchResults.totalDoctors
  );
  const totalLocationResults = useSelector(
    (state) => state.sideSearchResults.totalLocationResults
  );
  const totalPubmedResults = useSelector(
    (state) => state.sideSearchResults.totalPubmedResults
  );

  // const [totalDocotors, setTotalDoctors] = useState(0);
  // const [totalLocationResults, setTotalLocationResults] = useState(0);
  // const [totalPubmedResults, setTotalPubmedResults] = useState(0);
  const [isFromVectorSearch, setIsFromVectorSearch] = useState(false);
  const [vectorResults, setVectorResults] = useState([]);

  const resultsPerPage = 10;
  const filter = useSelector((state) => state.filter);

  // const activeFilterCount = filter
  //   ? Object.values(filter).filter(
  //     (value) => typeof value === "string" && value.trim() !== ""
  //   ).length
  //   : 0;

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleNextPage = useCallback(() => {
    if (scientificCurrentPage < scientificTotalPages) {
      dispatch(setScientificCurrentPage(scientificCurrentPage + 1));
      handleBrowseAll(filter, scientificCurrentPage + 1);
    }
  }, []);

  const handlePreviousPage = useCallback(() => {
    if (scientificCurrentPage > 1) {
      dispatch(setScientificCurrentPage(scientificCurrentPage - 1));
      handleBrowseAll(filter, scientificCurrentPage - 1);
    }
  }, []);
  const filtersSelected = useSelector(getSelectedFilterCount);

  const handleTabChange = useCallback(
    (index) => {
      setActiveTab(tabs[index]);
    },
    [navigate]
  );

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoadingProfiles(true);
        const data = await apiService.profiles.getAll(currentPage);
        console.log("data from the api", data);
        dispatch(setTotalDoctors(data["total_profiles"]));
        console.log(data);
        dispatch(setProfiles(data["profiles"]));
        dispatch(setTotalPages(Math.ceil(data["total_profiles"] / 10)));
        // setLoading(false);
      } catch (err) {
        setError("Failed to fetch profiles");
        setLoading(false);
        console.error(err);
      } finally {
        setLoadingProfiles(false);
      }
    };
    fetchProfiles();
  }, [currentPage]);

  useEffect(() => {
    if (filtersSelected <= 0) {
      dispatch(resetFilteredDoctors([]));
      dispatch(setTotalFilterPages(0));
      dispatch(setScientificCurrentPage(1));
      dispatch(setFilterPage(1));
      dispatch(setTotalLocationResults(0));
      dispatch(setTotalPubmedResults(0));
    }
  }, [filtersSelected]);

  const handleBrowseAll = useCallback(
    async (filter, newPage = 1) => {
      // setFiltersSelected((prev) => prev + 1);

      console.log(
        "scientific current page changed and ",
        scientificCurrentPage
      );
      setIsFromSideSearch(true);
      setIsFromVectorSearch(false);

      try {
        setLoading(true);
        const pageToUse = filtersSelected && newPage;
        // console.log("filter page inside the browseall ", filterPage)
        const profiles = await apiService.profiles.sideSearch(
          filter,
          pageToUse,
          activeTab
        );
        // const profiles = await apiService.profiles.sideSearch(filter, filterPage);
        console.log("Profiles based on search term :", profiles);
        // setTotalResults(profiles.total_pubmed_results);
        const totalPagesReq = Math.ceil(
          profiles.total_pubmed_results / resultsPerPage
        );
        dispatch(setscientificTotalPages(totalPagesReq));
        dispatch(setFilteredDoctors(profiles));
        dispatch(
          setTotalFilterPages(
            Math.ceil(profiles["total_location_results"] / 10)
          )
        );
        dispatch(setTotalLocationResults(profiles["total_location_results"]));
        dispatch(setTotalPubmedResults(profiles["total_pubmed_results"]));
      } catch (err) {
        console.error("Search failed:", err);
        dispatch(setFilteredDoctors([]));
      } finally {
        setLoading(false);
      }
    },
    [filterPage, currentPage, filtersSelected, scientificCurrentPage]
  );

  // useEffect(() => {

  //   dispatch(setFilterPage(1))
  // }, [filter]);

  console.log("isFromVectorSearch", isFromVectorSearch);

  const handleVectorSearch = useCallback(
    async (searchTerm) => {
      try {
        setLoading(true);
        setIsFromVectorSearch(true);
        const vectorProfiles = await apiService.profiles.vectorSearch(
          searchTerm
        );
        console.log("Profiles based on search term :", vectorProfiles);
        setVectorResults(vectorProfiles.results);

        // dispatch(setFilteredDoctors(profiles.results));
      } catch (err) {
        console.error("Search failed:", err);
        dispatch(setFilteredDoctors([]));
      } finally {
        setLoading(false);
      }
    },
    [searchTerm]
  );

  // IT gets the new page from the people tab and calls the handleBrowseAll function with the new page number
  const handleOnPageChange = useCallback((newPage) => {
    console.log("new page number in handleOnpagechagen is: ", newPage);


    if (filtersSelected > 0) {
      dispatch(setFilterPage(newPage));
      handleBrowseAll(filter, newPage);
    } else if (filtersSelected <= 0 && newPage !== currentPage) {
      dispatch(setCurrentPage(newPage));
      // handleBrowseAll(filter,newPage)
    }
  }, [dispatch, filtersSelected, currentPage, handleBrowseAll, scientificCurrentPage]);
  const handleScientificPageChange = useCallback((newPage) => {
    console.log("new page number in handleOnpagechagen is: ", newPage);

    if (filtersSelected > 0) {
      dispatch(setScientificCurrentPage(newPage));
      handleBrowseAll(filter, newPage);
    }
  }, [dispatch, filtersSelected, currentPage, handleBrowseAll, scientificCurrentPage]);

  return (
    <>

      <div className="mt-[7rem]">
        <TabNavigation
          tabs={tabs}
          activeTab={tabs.indexOf(activeTab)}
          onTabChange={handleTabChange}
        />
      </div>

      <div className="flex flex-col md:flex md:flex-row lg:flex lg:flex-row mt-0">
        {/* Filters */}
        <Suspense
          fallback={
            <div className="w-[calc(100%-400px)] flex justify-center items-center p-10 gap-2 ">
              <div className="spinner"></div>
              <span className=" text-lg text-gray-600">Loading Filters</span>
            </div>
          }>
          <FilterPanel
            handleBrowseAll={handleBrowseAll}
            handleVectorSearch={handleVectorSearch}
          />
        </Suspense>

        {/* displaying the content of the active Tab*/}
        {activeTab === "Scientific Experts" &&
          (loadingProfiles ? (
            <div className="w-full  md:w-[calc(100%-400px)] lg:w-[calc(100%-400px)] flex justify-center items-center p-10 gap-2">
              <div className="w-8 h-8 border-4 border-[#800080] border-dashed rounded-full animate-spin"></div>
              <span className=" text-lg text-gray-600">
                Loading People data...
              </span>
            </div>
          ) : (
            //  <div className="w-[calc(100%-400px)] flex flex-col  p-10 gap-2">
            //    <ShimmerEffect type="people" />
            //  </div>

            // <Suspense
            //   fallback={<ShimmerEffect type="profileCard" />}
            // >

            <PeopleTab
              profiles={profiles}
              vectorProfiles={vectorResults}
              filteredDoctors={filteredDoctors["location_results"]}
              loading={loading}
              error={error}
              isFromVectorSearch={isFromVectorSearch}
              totalDocotors={totalDoctors}
              totalLocationResults={totalLocationResults}
              onPageChange={handleOnPageChange}
              noResultsMessage={
                filtersSelected &&
                  (!filteredDoctors["location_results"] ||
                    filteredDoctors["location_results"].length === 0) &&
                  filter &&
                  !Object.values(filter).every((value) => !value || value === "")
                  ? "No profiles found for the selected filters"
                  : !profiles || profiles.length === 0
                    ? "No profiles available"
                    : ""
              }
            />

            // </Suspense>
          ))}

        {activeTab === "Congresses" && (
          <CongressPage
            filteredCongressData={filteredDoctors["congress_results"]}
            activeFilterCount={filtersSelected}
          />
        )}

        {/* Scientific Content */}
        {activeTab === "Scientific Content" &&
          (loading ? (
            <div className="w-[calc(100%-400px)] flex justify-center items-center p-10 gap-2">
              <div className="w-8 h-8 border-4 border-[#800080] border-dashed rounded-full animate-spin"></div>
              <span className=" text-lg text-gray-600">
                Loading Scientific data...
              </span>
            </div>
          ) : (
            <Suspense fallback={<ShimmerEffect type="publication" />}>
              <div className="w-full md:w-[calc(100%-400px)] lg:md:w-[calc(100%-400px)] px-2 md:px-4 lg:px-4">
                <p className="border-b px-2 pb-2 mb-4">
                  <span className="font-semibold text-lg">
                    {filtersSelected > 0 ? totalPubmedResults : 5}{" "}
                  </span>{" "}
                  results for{" "}
                  <span className="font-medium text-lg">{filtersSelected}</span>{" "}
                  selected filter :
                </p>
                <ScientificContentTab
                  filteredDoctors={filteredDoctors["pubmed_results"]}
                  // filtersSelected={filtersSelected}
                  isFromSideSearch={isFromSideSearch}
                  isFromSearch={false}
                />

                {/* Below butttons will be show cased when the active tab is publications in side search */}

                {isFromVectorSearch ? null : (
                  <div className="flex items-center justify-center space-x-4 mt-2 mb-4">
                    <button
                      onClick={handlePreviousPage}
                      disabled={scientificCurrentPage === 1}
                      className={`px-4 py-2 rounded-md border border-gray-300 text-sm font-medium 
                      ${scientificCurrentPage === 1
                          ? "bg-purple-100 text-purple-600 cursor-not-allowed"
                          : "bg-white hover:bg-gray-300 text-black"
                        }
                    `}>
                      Prev
                    </button>

                    {/* <span className="text-sm font-medium text-gray-700">
                      Page <span className="font-bold">{scientificCurrentPage}</span> of {filtersSelected >0?scientificTotalPages:1}
                    </span> */}

                    <div className="px-4 py-2">
                      Page
                      <select
                        className="text-center border rounded-md mx-2"
                        value={scientificCurrentPage}
                        onChange={(e) =>
                          handleScientificPageChange(parseInt(e.target.value))
                        }>
                        {Array.from(
                          {
                            length:
                              filtersSelected > 0 ? scientificTotalPages : 1,
                          },
                          (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          )
                        )}
                      </select>
                      of {filtersSelected > 0 ? scientificTotalPages : 1}
                    </div>

                    <button
                      onClick={handleNextPage}
                      disabled={
                        scientificCurrentPage ===
                        (filtersSelected > 0 ? scientificTotalPages : 1)
                      }
                      className={`px-4 py-2 rounded-md border border-gray-300 text-sm font-medium 
                      ${scientificCurrentPage === scientificTotalPages
                          ? "bg-purple-100 text-purple-600 cursor-not-allowed"
                          : "bg-white hover:bg-gray-300 text-black"
                        }
                    `}>
                      Next
                    </button>
                  </div>
                )}
              </div>
            </Suspense>
          ))}
      </div>
    </>
  );
};

export default ScientificProfileListPage;
