import React,{useEffect,useState} from 'react';
import { IoLocationSharp } from 'react-icons/io5';
import useCongressData from '../CustomHooks/useCongressData';
import apiService from '../services/api';
import HighlightedText from '../Components/HighlightedText';

const CongressPage = ({ filteredCongressData,activeFilterCount,errorMessage ,mainFlag}) => {
  // const { congressData, loading, error } = useCongressData(
  //   mainSearchCongressData, 
  //   doctorCongressData, 
  //   mainFlag
  // );
  // console.log(congressData, " Here is the congress data");
  const [congressData,setCongressData] = useState([])
  const [loading, setLoading] = useState(true);

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.toString().split(" ");
    return { day, month, year };
  };

  const safeFilteredCongressData = (filteredCongressData || []).map(item => ({
    ...item,
    date: item.date || parseDate(item.Date_of_the_Event),
  }));

  console.log("Filtered congress data: ", filteredCongressData);
  console.log("Active filter count: ", activeFilterCount);

  useEffect( () =>{
    const fetchCongressData = async() =>{
      try{
        const response = await apiService.profiles.congress()
        console.log("response for congress data: ", response.congress_data);
        const formattedData = response.congress_data.map(item => ({
          ...item,
          date: parseDate(item.Date_of_the_Event),
        }));
        setCongressData(formattedData);


      }catch(error){
        console.error('Error fetching congress data:',error);

      }finally{
        setLoading(false);
      }

    }
    fetchCongressData()
  },[])

  


  if (loading) {
    return (
      <div className="flex justify-center items-center mx-auto my-10 md:my-0 lg:my-0">
        <div className="w-8 h-8 border-4 border-[#800080] border-dashed rounded-full animate-spin"></div>
        <span className="text-lg text-gray-600">Loading congress data...</span>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="text-red-500 p-4 text-center">
        <p>{errorMessage}</p>
      </div>
    );
  }
  

  // if (safeFilteredCongressData.length === 0 ){
  //   return (
  //     <div className="text-center text-gray-500 py-10">
  //       No congress data found for the selected filters.
  //     </div>
  //   );
  // } 

  return (
    <div className={mainFlag? 'w-full mb-10' : 'w-full md:w-[calc(100%-400px)] lg:w-[calc(100%-400px)] mb-10 mt-5 md:mt-0 lg:mt-0'}>
      <div className="flex-1 border border-gray-200 rounded-md p-5 mx-2 md:mx-8 lg:mx-10 max-h-[80vh] overflow-y-auto">
        {activeFilterCount > 0 ?  (
         safeFilteredCongressData.length === 0 ? (<div className="text-center text-gray-500 py-10">
          No congress data found for the selected filters.
        </div>) :( <div>
            {safeFilteredCongressData.map((congress, index) => (
          <div key={index} className="mb-8 p-4 border-b border-gray-200 last:border-b-0">
            <div className="flex items-start">
              <div className="text-center min-w-[60px] mr-4 border border-gray-200 rounded-md">
                <div className="bg-[#800080] text-white rounded-tl-md rounded-tr-md p-1 mb-1">{congress.date.month}</div>
                <div className="text-xl font-bold">{congress.date.day}</div>
                <div className="text-gray-600">{congress.date.year}</div>
              </div>
              <div className="flex-1">
              <a href={congress.Link} target="_blank" rel="noopener noreferrer">
                <h3 className="text-xl font-semibold text-[#800080] hover:underline">
                  <HighlightedText text={congress.Event_Name} />
                </h3>
              </a>
                {/* <h3 className="text-xl font-semibold text-blue-600">{congress.Event_Name}</h3> */}
                <p className="text-gray-600 mt-1 flex items-center gap-1">
                  <IoLocationSharp size={15} />
                  <HighlightedText text={congress.Location} />
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
        ))}
          </div>)
        ):
        
        
        (
          <div className='w-full h-[100vh]'>
          {congressData.map((congress, index) => (
            <div key={index} className="mb-8 p-4 border-b border-gray-200 last:border-b-0">
              <div className="flex items-start">
                <div className="text-center min-w-[60px] mr-4 border border-gray-200 rounded-md">
                  <div className="bg-[#800080] text-white rounded-tl-md rounded-tr-md p-1 mb-1">{congress.date.month}</div>
                  <div className="text-xl font-bold">{congress.date.day}</div>
                  <div className="text-gray-600">{congress.date.year}</div>
                </div>
                <div className="flex-1">
                <a href={congress.Link} target="_blank" rel="noopener noreferrer">
                  <h3 className="text-xl font-semibold text-[#800080] hover:underline">
                    <HighlightedText text={congress.Event_Name} />
                  </h3>
                </a>
                  {/* <h3 className="text-xl font-semibold text-blue-600">{congress.Event_Name}</h3> */}
                  <p className="text-gray-600 mt-1 flex items-center gap-1">
                    <IoLocationSharp size={15} />
                    <HighlightedText text={congress.Location} />
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
          ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(CongressPage);
