import React, { useState, useEffect } from 'react'
import { Search } from "lucide-react";
import { MdStarBorder } from "react-icons/md";
import { getAssetPath } from '../../utils/imageUtils';
import { hospitalApiService } from '../../services/api'
import { useParams } from 'react-router-dom';
import { FaGreaterThan } from "react-icons/fa6";
import { useHCODoctorsData } from '../../Context/HCODoctorsDataContext';

const peopleFilters = ['All Members', 'Heads of Departments', 'Medical Directors', 'Doctors/Consultants',];

const HCOPeoplePage = ({ hcoProfile, loading }) => {

  const { id } = useParams()
  const { hcoDoctorsData, setHCODoctorsData } = useHCODoctorsData();
  const [HCOPeopleData, setHCOPeopleData] = useState([])
  const [selectedProfiles, setSelectedProfiles] = useState([])
  const [activeFilter, setActiveFilter] = useState('All Members');
  const [originalHCOPeopleData, setOriginalHCOPeopleData] = useState([]);
  console.log("hcoProfile data in HCOPeoplePage", hcoProfile);
  const getFilteredPeopleData = () => {
    if (!hcoProfile || hcoProfile.length === 0) return [];
    const { Consultants = [], Leaders = [], Medical_Directors = [] } = hcoProfile[0];


    switch (activeFilter) {
      case 'All Members':
        // Combine all arrays
        return [...Consultants, ...Leaders, ...Medical_Directors];
      case 'Medical Directors':
        return Medical_Directors;
      case 'Doctors/Consultants':
        return Consultants;
      case 'Heads of Departments':
        return Leaders;
      default:
        return [];
    }
  };

  const filteredPeople = getFilteredPeopleData();

  // const onChangeSearch = (value) => {
  //   if (value) {
  //     const filteredData = originalHCOPeopleData.filter((profile) => {
  //       return (
  //         profile.Full_Name.toLowerCase().includes(value.toLowerCase()) ||
  //         profile.HCP_speciality1.toLowerCase().includes(value.toLowerCase()) ||
  //         profile.HCO_Name.toLowerCase().includes(value.toLowerCase())
  //       );
  //     });
  //     setHCOPeopleData(filteredData);
  //   } else {

  //     setHCOPeopleData(originalHCOPeopleData);
  //   }
  // };

  // useEffect(() => {
  //   const fetchHCOPeopleData = async () => {
  //     try {
  //       const response = await hospitalApiService.hospital.getHCOPeopleData(id);
  //       console.log('HCO People Data', response);

  //       setHCOPeopleData(response.data);
  //       setOriginalHCOPeopleData(response.data); 
  //       setHCODoctorsData(response.data); // Update the context with the fetched data
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   if (id) {
  //     fetchHCOPeopleData();
  //   }
  // }, [id,setHCODoctorsData]);

  // const filterPeople = (data, filter) => {
  //   if (filter === 'All Members') return data;

  //   return data.filter(profile => {
  //     const designation = profile.Designation?.toLowerCase() || '';
  //     switch (filter) {
  //       case 'Hospital Management':
  //         return designation.includes('manager') || designation.includes('management');
  //       case 'Clinical Governance Team':
  //         return designation.includes('governance') || designation.includes('clinical lead');
  //       case 'Heads of Departments':
  //         return designation.includes('head') || designation.includes('hod');
  //       case 'Medical Directors':
  //         return designation.includes('director');
  //       case 'Doctors/Consultants':
  //         return designation.includes('doctor') || designation.includes('consultant');
  //       case 'Pharmacists':
  //         return designation.includes('pharmacist');
  //       default:
  //         return true;
  //     }
  //   });
  // };

  // const onClickSelectAll = (e) => { 
  //   setSelectedProfiles(HCOPeopleData)

  // }

  return (
    <div className='mx-10 mt-4 border border-gray-200 rounded-md p-4'>
      <h1 className='font-medium text-lg'>Explore People</h1>
      <div className='flex  gap-6 w-full mt-8'>
        {/* Left Sidebar - Filter Buttons */}
      <div className='w-[220px] flex-shrink-0'>
        <div className='flex flex-col gap-2'>
          {peopleFilters.map((filter, index) => (
            <button
              key={index}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-3 w-full rounded-md text-left font-medium transition-colors ${
                activeFilter === filter
                  ? 'bg-[#800080] text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        </div>
        {/* <div className='flex items-center gap-2 mt-4 ml-2'>
          <input type="checkbox" className='w-4 h-4' 
          onClick={onClickSelectAll}
          checked= {HCOPeopleData.some()}
          />
          <p className='font-medium'>Select All</p>
        </div> */}
       <div className='flex-1 min-w-0'>
        <div className='max-h-[70vh] overflow-y-auto'>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="dotted-spinner"></div>
              <span className="ml-4 text-[#800080] font-medium">Loading people...</span>
            </div>
          ) : filteredPeople.length > 0 ? (
            <div className='grid grid-cols-2 gap-4'>
              {filteredPeople.map((Profile, index) => (
                <div key={index} className='border border-gray-200 rounded-md p-4 bg-white hover:shadow-sm transition-shadow'>
                  <div className="flex items-start gap-3">
                    {/* Profile Image */}
                    <div className='flex-shrink-0'>
                      <img
                        src={getAssetPath('profileImg1.png')}
                        alt="profile"
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    </div>
                    
                    {/* Profile Information */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[#800080] font-semibold text-base hover:underline cursor-pointer mb-1 line-clamp-1">
                        {Profile.FullName}
                      </h3>
                      
                      {Profile?.Designation && (
                        <p className='text-sm font-medium text-gray-900 mb-1 line-clamp-1'>
                          {Profile.Designation}
                        </p>
                      )}
                      
                      {Profile?.HCP_Speciality && (
                        <p className='text-sm text-gray-600 font-medium line-clamp-1'>
                          {Profile.HCP_Speciality}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No data available
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)
}

export default HCOPeoplePage