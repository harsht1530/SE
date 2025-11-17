import React, {useState, Suspense } from 'react';
import { VariableSizeList as List } from 'react-window'; // Changed
import { getAssetPath } from '../utils/imageUtils';
const NewsfeedPage = React.lazy(() => import('../Pages/NewsfeedPage'));
import { useSelector } from 'react-redux';
import ShimmerEffect from './ShimmerEffect';
import { setFilteredDoctors } from "../utils/filteredDoctorsSlice";
import { getSelectedFilterCount } from '../utils/filterSlice';
import HighlightedText from './HighlightedText.jsx';

const ScientificContentTab = ({ filteredDoctors, isFromSearch = false, isFromSideSearch = false }) => {
    const [expandedStates, setExpandedStates] = useState({});
    const filter = useSelector((state) => state.filter);
    const filtersSelected = useSelector(getSelectedFilterCount);
    // const filteredDoctors = useSelector((state) => state.filteredDoctors);

    console.log("Scientific Filtered Doctors in the scientificContent tab ",filteredDoctors)
    // console.log("activeFilterCount in scientific content tab", activeFilterCount);
    
    const scientificFilter = useSelector((state) => state.filter.scientific)
    const locationFilter = useSelector((state) => state.filter.location)
    const clinicalFilter = useSelector((state) => state.filter.clinical)
    const digitalFilter = useSelector((state) => state.filter.digital);

    const isFiltersEmptied = () => {
        return scientificFilter === "" && 
               locationFilter === "" && 
               clinicalFilter === "" && 
               digitalFilter === "";
    };
    const toggleCoauthors = (index) => {
        setExpandedStates(prevState => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };

    // First, add a check for initial state
    const isInitialState = !isFromSearch && !isFromSideSearch;
    
    // Replace the existing condition
    if (isInitialState || (isFromSideSearch && isFiltersEmptied())) {
        return (
            <Suspense fallback={<ShimmerEffect type="publication"/>}>
                <NewsfeedPage hadHiddenHeader={true} hadHiddenFavorites={true} />
            </Suspense>
        );
    }

    const ScientificItem = ({ data, index, expandedStates, toggleCoauthors }) => {
        const publication = data;
        const maxVisibleCoauthors = 5;
        const isExpanded = expandedStates[index] || false;

        const coauthorsToShow = isExpanded
            ? publication.coauthors
            : publication.coauthors?.slice(0, maxVisibleCoauthors);

        return (
            <div className='hover:bg-gray-50' >
                <div className="flex flex-col md:flex-row lg:flex-row items-start gap-4">
                    <div className="flex justify-between w-full items-center md:flex-col md:items-start md:w-auto  lg:flex-col lg:items-start lg:w-auto">
                        <div className="bg-[#800080] w-24 h-24 rounded-lg flex items-center justify-center text-white text-lg font-semibold px-2">
                            Publication
                        </div>
                        <div className="mt-2 text-gray-600">
                            {publication["publication_date"]}
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2 line-clamp-4">
                            <HighlightedText text={publication["title"]} />
                        </h3>
                        {publication["link"] && (
                            <a href={publication["link"]}
                                className="text-blue-600 hover:underline mb-3 block truncate"
                                target='_blank' rel="noopener noreferrer">
                                {publication["link"]}
                            </a>
                        )}

                        <div className="flex flex-wrap gap-2 mt-2">
                            {coauthorsToShow?.map((author, idx) => (
                                <div
                                    key={idx}
                                    className="border border-gray-300 rounded-md p-2 flex items-center gap-2"
                                >
                                    <img
                                        src={getAssetPath("/profileImg1.png")}
                                        alt={author}
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <div>
                                        <p className="text-sm font-medium">{author}</p>
                                    </div>
                                </div>
                            ))}

                            {publication.coauthors?.length > maxVisibleCoauthors && (
                                <button
                                    onClick={() => toggleCoauthors(index)}
                                    className="text-blue-500 text-sm"
                                >
                                    {isExpanded
                                        ? "Show Less"
                                        : `Show More (${publication.coauthors.length - maxVisibleCoauthors})`}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {(isFromSideSearch && !isFromSearch && !(isFiltersEmptied())) && (
                <div className="w-full max-h-[80vh] overflow-y-auto">
                    {(filteredDoctors?.length > 0 ? (
                        // Show filtered doctors if filters are applied and results found
                        filteredDoctors.map((publication, index) => (
                            <div className='flex flex-col gap-8  px-2 pb-4 mb-4 py-2 border rounded-md shadow-md border-gray-300 ' key={index}>
                                <ScientificItem data={publication} index={index} expandedStates={expandedStates} toggleCoauthors={toggleCoauthors} />
                            </div>
                        ))
                    ) : (
                        // Show message if filters are applied but no results
                        <div className='flex justify-center '>
                            <p className='font-medium'>No profiles found for the selected filters.</p>
                        </div>
                    ))}
                     
                </div>
            )}
            
        </>
    );
};

export default React.memo(ScientificContentTab);