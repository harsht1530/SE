import React,{useState,useEffect} from 'react'
import { getAssetPath } from '../utils/imageUtils';
import ShimmerEffect from './ShimmerEffect';

const HomeSearchScientificContent = ({mainPublications}) => {

     const [expandedStates, setExpandedStates] = useState({});
     const [loading, setLoading] = useState(true);

     const toggleCoauthors = (index) => {
        setExpandedStates(prevState => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };

    useEffect(() => {
        if (mainPublications && mainPublications.length > 0) {
          setLoading(false);
        } else {
          // Simulate loading delay (you can remove this if real API sets loading appropriately)
          const timeout = setTimeout(() => setLoading(false), 1500);
          return () => clearTimeout(timeout);
        }
      }, [mainPublications]);


   

    const ScientificItem = ({ data, index, expandedStates, toggleCoauthors }) => {
        const publication = data;
        const maxVisibleCoauthors = 5;
        const isExpanded = expandedStates[index] || false;

        const coauthorsToShow = isExpanded
            ? publication.coauthors
            : publication.coauthors?.slice(0, maxVisibleCoauthors);

        return (
            <div className='hover:bg-gray-50' >
                <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                        <div className="bg-[#800080] w-24 h-24 rounded-lg flex items-center justify-center text-white text-lg font-semibold px-2">
                            Publication
                        </div>
                        <div className="mt-2 text-gray-600">
                            {publication["publication_date"]}
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2 line-clamp-4">
                            {publication["title"]}
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
    <div>
        <div className="w-full max-h-[80vh] overflow-y-auto">
                    {loading ? (
                    <div className="space-y-6 my-6">
                        {Array.from({ length: 3 }).map((_, index) => (
                        <ShimmerEffect key={index} />
                        ))}
                    </div>
        ) :(mainPublications?.length > 0 ? (
                        // Show filtered doctors if filters are applied and results found
                        mainPublications.map((publication, index) => (
                            <div className='flex flex-col gap-4 my-6 py-6 border-b border-gray-300 ' key={index}>
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
    </div>
  )
}

export default HomeSearchScientificContent