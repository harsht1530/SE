import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFilter } from "../utils/filterSlice";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdArrowDropright } from "react-icons/io";
import { Search } from "lucide-react";
import apiService from "../services/api";
import axios from "axios"; // ✅ missing import

import { debounce } from "lodash";
import { setFilteredDoctors } from "../utils/filteredDoctorsSlice";

const FilterPanel = ({ handleBrowseAll, handleVectorSearch }) => {
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.filter);
  const [locationSuggestions, setLocationSuggestions] = useState([]);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [showActivitiesFilters, setShowActivitiesFilters] = useState(false);
  const [vectorTerm, setVectorTerm] = useState("");
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  

  // Fetch countries
  const getCountryData = async () => {
    try {
      let response = await axios.get(
        "https://crio-location-selector.onrender.com/countries"
      );
      setCountryData(response.data);
    } catch (error) {
      console.log("Error while fetching the Countries", error);
    }
  };

  // Fetch states for selected country
  const getStateData = async (country) => {
    try {
      let response = await axios.get(
        `https://crio-location-selector.onrender.com/country=${country}/states`
      );
      setStateData(response.data);
      setCityData([]);
      setSelectedState("");
      setSelectedCity("");
    } catch (error) {
      console.log("Error while Fetching the States: ", error);
    }
  };

  // Fetch cities for selected state
  const getCityData = async (country, state) => {
    try {
      let response = await axios.get(
        `https://crio-location-selector.onrender.com/country=${country}/state=${state}/cities`
      );
      setCityData(response.data);
      setSelectedCity("");
    } catch (error) {
      console.log("Error while Fetching the Cities: ", error);
    }
  };

  useEffect(() => {
    getCountryData();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      getStateData(selectedCountry);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      getCityData(selectedCountry, selectedState);
    }
  }, [selectedState]);

  const LOCATIONS = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
    "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
    "Mumbai", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata",
    "Surat", "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Visakhapatnam",
    "Indore", "Thane", "Bhopal", "Patna", "Vadodara", "Ghaziabad", "Ludhiana",
    "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Varanasi", "Srinagar",
    "Aurangabad", "Dhanbad", "Amritsar", "Navi Mumbai", "Allahabad", "Howrah",
    "Ranchi", "Gwalior", "Jabalpur", "Coimbatore", "Vijayawada", "Madurai",
    "Jodhpur", "Raipur", "Kota", "Guwahati", "Solapur", "Hubli-Dharwad",
    "Bareilly", "Mysore", "Moradabad", "Gurugram", "Aligarh", "Jalandhar",
    "Tiruchirappalli", "Bhubaneswar", "Salem", "Warangal", "Guntur",
    "Halle", "wurzburg", "Munich", "Lyon", "Villejuif", "Yokohama",
    "Fukuoka", "Xuan Wu Qu", "Beijing"
  ];

  const getLocationSuggestions = (input) => {
    if (!input) return [];
    const inputLower = input.toLowerCase();
    return LOCATIONS.filter((location) =>
      location.toLowerCase().includes(inputLower)
    );
  };

  const handleLocationChange = useCallback((e) => {
    const value = e.target.value;
    dispatch(setFilter({ location: value }));
    const suggestions = getLocationSuggestions(value);
    setLocationSuggestions(suggestions);
    setShowSuggestions(suggestions.length > 0);
  }, [dispatch]);

  const handleSuggestionClick = (location) => {
    dispatch(setFilter({ location }));
    setShowSuggestions(false);
    handleBrowseAll(filter);
  };

  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleScientific = useCallback((e) => {
    console.log("Changing: ", e.target.name, e.target.value);
    dispatch(setFilter({ [e.target.name]: e.target.value }));
  }, [dispatch]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleBrowseAll(filter);
      }
    },
    [filter, handleBrowseAll]
  );


  return (
    <div className="w-auto md:w-[400px] lg:w-[400px] border border-gray-200 rounded-md p-2 mb-4 md:p-5 lg:p-5 ml-2 md:ml-10 lg:ml-10">
      <h2 className=" font-bold pb-4">Filter Results</h2>
      {/*Filter Topics */}
      <div>
        {/* Toggle Button */}
        <p
          onClick={() => setShowFilters((prev) => !prev)}
          className="flex items-center gap-1 cursor-pointer"
        >
          {showFilters ? (
            <IoMdArrowDropdown size={20} />
          ) : (
            <IoMdArrowDropright size={20} />
          )}
          Topics
        </p>

        {/* Filter Input */}
        {showFilters && (
          <>
            {/* Scientific */}
            <div className="mt-3 scientific">
              <div className="flex items-center justify-between">
                <p>Scientific:</p>
                <button
                  className="text-[#800080] border-none hover:bg-[#800080] hover:text-[#fff] hover:font-medium p-2 rounded-md"
                  onClick={() => handleBrowseAll(filter)}
                >
                  Search
                </button>
              </div>
              <input
                className="w-full border border-gray-400 rounded-md p-2 mt-1"
                type="text"
                name="scientific"
                value={filter.scientific}
                placeholder="eg. radiotherapy,breast cancer..."
                onChange={handleScientific}
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* Digital */}
            <div className="mt-3 digital">
              <div className="flex items-center justify-between">
                <p>Digital:</p>
                <button
                  onClick={() => handleBrowseAll(filter)}
                  className="text-[#800080] hover:bg-[#800080] hover:text-[#fff] p-2 rounded-md"
                >
                  Search
                </button>
              </div>
              <input
                className="w-full border border-gray-400 rounded-md p-2 mt-1"
                type="text"
                name="digital"
                value={filter.digital}
                placeholder="eg. Diseases, Drug Classes..."
                onChange={handleScientific}
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* Clinical */}
            <div className="mt-3 clinical">
              <div className="flex items-center justify-between">
                <p>Clinical Trials:</p>
                <button
                  className="text-[#800080] hover:bg-[#800080] hover:text-[#fff] p-2 rounded-md"
                  onClick={() => handleBrowseAll(filter)}
                >
                  Search
                </button>
              </div>
              <input
                className="w-full border border-gray-400 rounded-md p-2 mt-1"
                type="text"
                name="clinical"
                value={filter.clinical}
                placeholder="eg. Biomakers, Melanoma, Antibodies.."
                onChange={handleScientific}
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* Location */}
            <div className="mt-3 location">
              <div className="flex items-center justify-between">
                <p>Location:</p>
                <button
                  className="text-[#800080] hover:bg-[#800080] hover:text-[#fff] p-2 rounded-md"
                  onClick={() => handleBrowseAll(filter)}
                >
                  Search
                </button>
              </div>
              <input
                className="w-full border border-gray-400 rounded-md p-2 mt-1"
                type="text"
                name="location"
                placeholder="eg. Hyderabad, Kerala"
                value={filter.location}
                onChange={handleLocationChange}
                onClick={(e) => {
                  e.stopPropagation();
                  if (filter.location) setShowSuggestions(true);
                }}
                onKeyDown={handleKeyDown}
              />
              {showSuggestions && locationSuggestions.length > 0 && (
                <div
                  className="absolute w-[350px] bg-[#fff] border border-gray-200 rounded-md mt-1 max-h-48 overflow-y-auto z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  {locationSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-[#d684d6] hover:text-[#800080] cursor-pointer"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Speciality */}
            <div className="mt-3 digital">
              <div className="flex items-center justify-between">
                <p>Speciality:</p>
                <button
                  onClick={() => handleBrowseAll(filter)}
                  className="text-[#800080] hover:bg-[#800080] hover:text-[#fff] p-2 rounded-md"
                >
                  Search
                </button>
              </div>
              <input
                className="w-full border border-gray-400 rounded-md p-2 mt-1"
                type="text"
                name="speciality"
                value={filter.speciality}
                placeholder="eg. Cardiologist, Dermatologist..."
                onChange={handleScientific}
                onKeyDown={handleKeyDown}
              />
            </div>

            

            {/* Final selection */}
            {selectedCountry && selectedState && selectedCity && (
              <h3 className="text-sm text-gray-700">
                You selected:{" "}
                <span className="font-semibold text-purple-700">{selectedCity}</span>,{" "}
                {selectedState}, {selectedCountry}
              </h3>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(FilterPanel);
