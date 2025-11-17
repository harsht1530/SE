import React from 'react'
import { IoLocationSharp } from 'react-icons/io5';

const HomeSearchCongressPage = ({ mainSearchCongressData }) => {
  const currentDate = new Date();

    const congressDataWithParsedDates = mainSearchCongressData.map(item => {
        const cleanedDateString = item.Date_of_the_Event?.replace(/(\d+)(st|nd|rd|th)/, '$1');
        const date = new Date(cleanedDateString);
      
        if (isNaN(date)) {
          return {
            ...item,
            date: {
              day: 'Invalid',
              month: 'Date',
              year: ''
            },
            isPast: false,
          };
        }
      
        return {
          ...item,
          date: {
            day: date.getDate(),
            month: date.toLocaleString('default', { month: 'short' }),
            year: date.getFullYear()
          },
          isPast: date < currentDate,
        };
      });
      
    console.log("HomeSearchCongressData ",mainSearchCongressData)
  return (
    <div>
    {congressDataWithParsedDates.length > 0 ? (congressDataWithParsedDates.map((congress,index)=>(
        <div key={index} className={`mb-8 p-4 border-b border-gray-200 last:border-b-0 ${
          congress.isPast ? 'text-gray-500' : 'text-black'
        }`}>
        <div className="flex items-start">
          <div className="text-center min-w-[60px] mr-4 border border-gray-200 rounded-md">
            <div className={`${
                    congress.isPast ? 'bg-gray-400' : 'bg-[#800080]'
                  } text-white rounded-tl-md rounded-tr-md p-1 mb-1`}>{congress.date.month}</div>
            <div className="text-xl font-bold">{congress.date.day}</div>
            <div className="text-gray-600">{congress.date.year}</div>
          </div>
          <div className="flex-1">
          <a href={congress.Link} target="_blank" rel="noopener noreferrer" className={`${congress.isPast ? 'text-gray-500' : 'text-[#800080]'} hover:underline`}>
            <h3 className="text-xl font-semibold">
              {congress.Event_Name}
            </h3>
          </a>
            {/* <h3 className="text-xl font-semibold text-blue-600">{congress.Event_Name}</h3> */}
            <p className="text-gray-600 mt-1 flex items-center gap-1">
              <IoLocationSharp size={15} />
              {congress.Location}
            </p>
            <div className="mt-2">
              <p>Organized by: <span className="text-gray-500">{congress.Organized_By}</span></p>
              {congress.Topic_of_Participation !== null && (
                <p>Series: <span className="text-gray-500">{congress.Topic_of_Participation}</span></p>
              )}
            </div>
          </div>
        </div>
      </div>

    ))) : (<p className='pl-6'>No congress data found for above filter</p>)}
    </div>
  )
}

export default HomeSearchCongressPage