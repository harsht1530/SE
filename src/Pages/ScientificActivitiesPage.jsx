
import { useState } from "react";
import { Search } from "lucide-react";
import DualRangeSlider from "../Components/DualRangeSlider";

const marks = [
    { value: 0, label: "Older" },
    { value: 10, label: "2014" },
    { value: 20, label: "2015" },
    { value: 30, label: "2016" },
    { value: 40, label: "2017" },
    { value: 50, label: "2018" },
    { value: 60, label: "2019" },
    { value: 70, label: "2020" },
    { value: 80, label: "2021" },
    { value: 90, label: "2022" },
    { value: 100, label: "2023" },
    { value: 110, label: "2024" },
    { value: 120, label: "2025" },
    { value: 130, label: "2026" }
];

const ScientificActivitiesPage = () => {
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [yearRange, setYearRange] = useState([0, 130]); // Default: Older - 2026

    const options = ["All(434)", "Congress Contributions(407)", "Publications(314)", "Clinical Trials(21)", "Guidelines(10)", "Media Mentions(12)"];

    const handleFilterToggle = (option) => {
        setSelectedFilters((prev) =>
            prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
        );
    };
    return (
        <div className="p-10 flex flex-col ">
            <h1>Scientific Activities</h1>   

            <div className="flex flex-wrap gap-4 mt-4">
                {options.map((option) => (
                    <label key={option} className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={selectedFilters.includes(option)}
                            onChange={() => handleFilterToggle(option)}
                            className="hidden peer"
                        />
                        <div
                            className={` border-2 rounded-full flex items-center justify-center transition-colors ${selectedFilters.includes(option)
                                ? "border-blue-600 bg-blue-600"
                                : "border-gray-500"
                                }`}
                        >
                            <div
                                className={`w-3 h-3 bg-blue-500 border-1 border-white rounded-full transition-opacity ${selectedFilters.includes(option) ? "opacity-100" : "opacity-0"
                                    }`}
                            ></div>
                        </div>
                        <span className="ml-2 text-gray-700">{option}</span>
                    </label>
                ))}
            </div>
            <div className="relative w-full max-w-lg mt-8">
                {/* Search Icon */}
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />

                {/* Input Field */}
                <input
                    type="text"
                    placeholder="Enter drug, condition or biomarker"
                    className="w-full py-2 pl-10 pr-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Browse All Link */}
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 cursor-pointer hover:underline">
                    Browse all
                </span>
                
            </div>
            <p>Search in scientific activities</p>

            {/* DualRangeSlider Component */}
            <DualRangeSlider 
                yearRange={yearRange}
                setYearRange={setYearRange}
                marks={marks}
            />

            <div>
                <div className="flex justify-between shadow-lg p-4 rounded-lg mt-6">
                    <div>
                    <h2>Co-author of new guideline</h2>
                    <p className="text-blue-500">6th and 7th International Consensus Guidelines for the Management of advanced breast cancer(ABC guidelines 6 and 7)</p>
                    </div>
                    <div>
                        <p className="text-gray-500">published on Aug1, 2024</p>
                    </div>
                </div>
                <div className="flex justify-between shadow-lg p-4 rounded-lg mt-6">
                    <div>
                    <h2>Co-author of new article in Annals of oncology: official journal of the European Society for Medical Oncology</h2>
                    <p className="text-blue-500">Neratinib and ado-trastuzumab emtansina in the treatment of HER2-positive advanced breast cancer</p>
                    </div>
                    <div>
                        <p className="text-gray-500">published on Jul 6, 2024</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ScientificActivitiesPage;
