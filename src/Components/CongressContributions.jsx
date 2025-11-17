import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import { useParams } from 'react-router-dom';
import { IoLocationSharp } from 'react-icons/io5';
import { useDoctorCongress } from '../Context/DoctorCongressContext.js';
import CryptoJS from "crypto-js";
import HighlightedText from './HighlightedText.jsx';

const CongressContributions = () =>{
    const { doctorCongress, errorMessage, setErrorMessage } = useDoctorCongress();

    
  

    if (errorMessage) {
      return (
        <div className="text-red-500 p-4 text-center">
          <p>{errorMessage}</p>
        </div>
      );
    }
    
    return(
      // <div className={`${(mainSearchCongressData || doctorCongressData) ? 'w-full' : 'w-[calc(100%-400px)]'} mb-10`}>
            <div className="flex-1 border border-gray-200 rounded-md p-5 ml-10 mr-10 mt-4 max-h-[80vh] overflow-y-auto">
              {doctorCongress.map((congress, index) => (
                <div key={index} className="mb-8 p-4 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-start">
                    <div className="text-center min-w-[60px] mr-4 border border-gray-200">
                      <div className="bg-[#800080] text-white p-1 mb-1">{congress.date?.month}</div>
                      <div className="text-xl font-bold">{congress.date?.day}</div>
                      <div className="text-gray-600">{congress.date?.year}</div>
                    </div>
                    <div className="flex-1">
                      <a href={congress.Link} target="_blank" rel="noopener noreferrer" className="block">
                      <h3 className="text-xl font-semibold text-[#800080] hover:underline"><HighlightedText text={congress.Event_Name} /></h3>
                      </a>
                      <p className="text-gray-600 mt-1 flex items-center gap-1">
                        <IoLocationSharp size={15} />
                        {congress.Location}
                      </p>
                      <div className="mt-2">
                        <p ><span className='font-medium'>Organized by:</span> <span className="text-gray-800">{congress.Organized_By}</span></p>
                        {congress.Topic_of_Participation !== "N/A" && (
                          <p><span className='font-medium'></span> <span className="text-gray-800">{congress.Role_in_the_Event} at {congress.Topic_of_Participation}</span></p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            // </div>
          
    )

  }
export default CongressContributions;