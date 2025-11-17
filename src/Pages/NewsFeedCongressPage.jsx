import React,{useState,useRef,useEffect} from 'react'
import { IoLocationSharp } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import HighlightedText from '../Components/HighlightedText.jsx';

const NewsFeedCongressPage = ({ congressess }) => {
  const [selectedCongress, setSelectedCongress] = useState(null);
  const [isModalOpen,setIsModalOpen] = useState(false)

  // const isCongressOngoing = (endDate) => {
  //   if (!endDate) return false;

  //   // Remove ordinal indicators (th, st, nd, rd) and split the date
  //   const cleanDate = endDate.replace(/(st|nd|rd|th)/, '');
  //   const [day, month, year] = cleanDate.split(' ');

  //   // Create date string in a format JavaScript can parse
  //   const formattedDate = `${month} ${day} ${year}`;
  //   const congressEnd = new Date(formattedDate);
  //   const today = new Date();

  //   return congressEnd >= today;
  // };


  
  const handleSummary = (congress) => {

    setSelectedCongress(congress);
    console.log("selected congress Data", congress)
    setIsModalOpen(true)
  }

  const renderObject = (obj) => (
    <ul className="list-disc pl-5">
      {Object.entries(obj).map(([key, value]) => (
        <li key={key}>
          <span className="font-medium">{key}:</span>{" "}
          {typeof value === "object" && value !== null
            ? renderObject(value)
            : <span className="text-gray-600">{value}</span>}
        </li>
      ))}
    </ul>
  );

  const isCongressOngoing = (endDate) => {
    if (!endDate) return false;

    const cleanDate = endDate.replace(/(st|nd|rd|th)/g, '');
    const [day,month,year] = cleanDate.split(' ')
    const formattedDate = `${month} ${day} ${year}`
    const congressEnd = new Date(formattedDate)
    const today = new Date()

    return congressEnd >= today
  }


  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6"> {/* Responsive container padding */}
      <div className="border border-gray-200 rounded-md overflow-y-auto max-h-[85vh]"> {/* Adjusted max-h and removed fixed ml/mr */}
       
        {congressess.map((congress, index) => {
          // const isOngoing = isCongressOngoing(congress["Date_of_the_Event"])
          // const assignRef = isOngoing && !onGoingRefAssigned
          // if(assignRef) onGoingRefAssigned = true
          return <div
            key={index}
            // ref={assignRef ? firstOngoingRef : null}
            id={index}
            className="mb-6 p-4 border-b border-gray-200 last:border-b-0" /* Reduced mb */
          >
            <div className="flex flex-row items-center gap-4"> {/* Responsive flex layout flex flex-col items-start md:items-center  md:flex-row gap-4*/}
              <div className="text-center min-w-[60px] border border-gray-200 shadow-sm rounded-md"> {/* Added shadow */}
                <div className={`text-white p-1 text-xs sm:text-sm text-center rounded-t-md ${isCongressOngoing(congress.End_Date) ? 'bg-[#800080]' : 'bg-gray-500'
                  }`}>
                  {congress.date?.month ?? "N/A"}
                </div>
                <div className="p-2 text-lg sm:text-xl font-semibold">{congress.date?.day ?? "--"}</div>
                <div className="text-gray-600 text-sm sm:text-md">{congress.date?.year ?? "----"}</div>
              </div>
              <div className="flex-1">
                <a href={congress.Link} target="_blank" rel="noopener noreferrer" className="block"> {/* Make the whole block clickable */}
                  <h3 className={`text-base md:text-lg lg:text-lg font-semibold hover:underline break-words ${isCongressOngoing(congress.End_Date) ? 'text-[#800080]' : 'text-gray-500'
                    }`}>
                    <HighlightedText text={congress.Event_Name} />
                  </h3>
                </a>
                <p className="text-gray-600 mt-1 flex items-center gap-1 text-sm sm:text-md 
                break-words">
                  <IoLocationSharp size={15} />
                  {congress.Location}
                </p>
                <div className="mt-2 text-sm sm:text-md flex flex-col md:flex md:flex-row lg:flex lg:flex-row justify-between items-start  md:items-center lg:items-center gap-2">
                  <p >
                    Organized by: <span className="text-gray-600 break-words">{congress.Organized_By}</span>
                  </p>
                  {/* {congress.Topic_of_Participation !== "N/A" && ( 
                    <p>Series: <span className="text-blue-500 break-words">{congress.Topic_of_Participation}</span></p>
                  )} */}
                  <button className="border border-gray-500 px-2 py-1 rounded-md hover:bg-[#800080] hover:text-white hover:border-none " onClick={()=>handleSummary(congress)}>view summary</button>
                </div>
              </div>
            </div>
          </div>
        })}
      </div>

      {/* summary modal */}
      {isModalOpen && selectedCongress && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 ">
          <div className="bg-white p-4 md:p-8 lg:p-8 rounded-lg shadow-lg max-w-[800px] w-full mx-4 relative overflow-y-auto max-h-[90vh]">
            {/* Close button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <IoClose size={24} />
            </button>
            
            {/* Title */}
            <h2 className="text-xl font-semibold text-[#800080] pb-2">
              <HighlightedText text={selectedCongress.Event_Name} />
            </h2>
            <div className='border-b border-t border-gray-200 py-2'>
              {selectedCongress.cleanOverview.startDate && (<p className=' font-medium '>{selectedCongress.cleanOverview.startDate} - {selectedCongress.cleanOverview.endDate}</p>)}
              
              {selectedCongress.cleanOverview.organization && (<p>Organization: {selectedCongress.cleanOverview.organization}</p>)}
              
            </div>
            {/*main topics */}
            {selectedCongress.cleanOverview?.topics.length > 0 && (
              <div className='py-2'>
              <h3 className='pb-2 font-medium'>Main Topics</h3>
              <div className=' flex gap-2 flex-wrap'>
                {selectedCongress.cleanOverview.topics.map((topic, index) => (
                  <p key={index} className='text-gray-600 border border-gray-300 px-1 rounded-md'><HighlightedText text={topic} /></p>
                ))}
              </div>
            </div>

            )}
            
            
            {/* Content */}
            <div className="prose max-w-none border-b border-t border-gray-200 py-2">
              <h3 className="text-lg font-semibold mt-4">Summary</h3>
              <p className="text-gray-600 leading-relaxed">
                <HighlightedText text={selectedCongress.openai_summary.summary} />
              </p>
            </div>

            {/*Upcoming meetings */}
            <div className="prose max-w-none border-b border-t border-gray-200 py-2">
              <h3 className="text-lg font-semibold mt-4">Upcoming Meetings</h3>
              <div className="space-y-1 mt-2">
                {selectedCongress.cleanOverview?.upcomingMeetings.length > 0 ? (
                  selectedCongress.cleanOverview?.upcomingMeetings?.map((meeting, index) => (
                    <div key={index} className="flex gap-2 border border-gray-200 p-1 rounded-md hover:shadow-md">
                      <p className="text-gray-600 "><HighlightedText text={meeting.Title} /></p>
                      {meeting.Location && (
                        <p className="text-gray-600">({meeting.Location})</p>
                      )}
                    </div>
                  ))
                ):(<p className="text-gray-600">No upcoming meetings</p>)}
              </div>
            </div>

            {/* policay And Advocacy */}
            {selectedCongress.cleanOverview?.policyAndAdvocacy && (
              <div className="prose max-w-none border-b border-t border-gray-200 py-2">
                <h3 className="text-lg font-semibold mt-4">Policy and Advocacy</h3>
                <p className="text-gray-600 leading-relaxed">
                  {selectedCongress.cleanOverview.policyAndAdvocacy}
                </p>
              </div>
            )}

            {/*publications */}
           {selectedCongress.cleanOverview?.publication?.length > 0 && (
              <div className="prose max-w-none border-b border-t border-gray-200 py-2">
                <h3 className="text-lg font-semibold mt-4">Publications</h3>
                <ul className="list-disc pl-5 text-gray-600 leading-relaxed">
                  {selectedCongress.cleanOverview.publication.map((item, index) => (
                    <li key={index}><HighlightedText text={item} /></li>
                  ))}
                </ul>
              </div>
            )}

            {/*funding */}
            {selectedCongress.cleanOverview?.funding && (
              <div className="prose max-w-none border-b border-t border-gray-200 py-2">
                <h3 className="text-lg font-semibold mt-4">Funding</h3>
                {renderObject(selectedCongress.cleanOverview.funding)}
              </div>
            )}




            
          
            
            {/* Footer */}
            <div className="mt-6 pt-4   flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-[#800080] text-white rounded-md hover:bg-[#6a006a] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsFeedCongressPage