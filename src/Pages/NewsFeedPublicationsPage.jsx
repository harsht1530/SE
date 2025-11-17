import React, { useState } from 'react';
import { getAssetPath } from '../utils/imageUtils';
import HighlightedText from '../Components/HighlightedText.jsx';

const NewsFeedPublicationsPage = ({publications,}) => {
  const [expandedCards, setExpandedCards] = useState({});

  const toggleAbstract = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

   const Experts = ({ authors }) => {
      const [showAllAuthors, setShowAllAuthors] = useState(false);
    
      const displayedAuthors = showAllAuthors ? authors : authors.slice(0, 5);
    
      return (
        <div>
          
          <div className="flex items-center flex-wrap gap-2">
            {displayedAuthors.map((author, index) => (
              <div
              key={index}
              className="border border-gray-300 rounded-md p-2 flex items-center gap-2"
            >
              <img
                src={getAssetPath('profileImg1.png')}
                alt="author-profile-img"
                className="w-4 h-4 md:w-8 md:h-8 lg:w-8 lg:h-8 rounded-full"
              />
              <div>
                <p className="text-xs md:text-sm lg:text-sm font-medium">{author}</p>
                
              </div>
            </div>
            ))}
          </div>
    
          {authors.length > 5 && (
            <button
              onClick={() => setShowAllAuthors(!showAllAuthors)}
              className="mt-2 text-blue-600 hover:underline text-sm"
            >
              {showAllAuthors ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      );
    };

  return (
    <div className='p-1 md:p-5 lg:p-5  mr-1 overflow-y-auto h-[100vh]'>
        {publications.map((guideline) => (
        <div
          key={guideline.id}
          className="bg-white rounded-lg shadow-md mb-6 p-4 "
        >
          <div className="flex flex-col md:flex md:flex-row lg:flex lg:flex-row  gap-4 w-full">
            {/* Left side with category badge */}
            <div className="w-25 h-20 md:h-30 lg:h-30 bg-[#800080] rounded-md p-2 flex flex-col gap-1 md:gap-4 lg:gap-4">
              
                <div className="text-white  font-semibold">
                  Publication
                </div>
                
              <div className="text-white text-xs pt-2 font-semibold">
                {guideline.publication_date}
              </div>
            </div>
  
            {/* Right side with content */}
            <div className="flex-1">
              <div className="mb-2">
                <p className="text-md md:text-lg lg:text-lg font-medium text-black mb-2  ">
                  <HighlightedText text={guideline.title} />
                </p>
                {/* <h3 className="text-lg font-medium text-blue-500 hover:underline cursor-pointer">
                  {guideline.abstract}
                </h3> */}
                <div className="mb-2">
                <h3
                  className={`text-sm md:text-md lg:text-md font-medium text-gray-600 hover:underline cursor-pointer ${
                    expandedCards[guideline.id] ? "" : "line-clamp-2"
                  }`}
                >
                  <HighlightedText text={guideline.abstract} />
                </h3>
  
                {guideline.abstract==="" ? (<p className="text-sm text-gray-500">No abstract available</p>) :(<button
                  className="text-sm text-blue-600 mt-1"
                  onClick={() => toggleAbstract(guideline.id)}
                >
                  {expandedCards[guideline.id] ? "See less" : "See more"}
                </button>)}
                </div>
                
                <a
                  href={guideline.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm md:text-base lg:text-base text-blue-600 cursor-pointer hover:underline"
                >
                  {guideline.link}
                </a>
                <p className="text-sm text-gray-600 font-semibold pt-2">
                  Publishing date: {guideline.publication_date}
                </p>
              </div>
  
              {/* Authors */}
              
              <Experts authors={guideline.authors} />
  
            </div>
          </div>
        </div>
      ))}

    </div>
  )
}

export default NewsFeedPublicationsPage