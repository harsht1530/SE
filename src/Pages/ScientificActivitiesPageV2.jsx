import React, { useState, useEffect, memo } from 'react'
import axios from 'axios'
import apiService from '../services/api'
import { useParams } from 'react-router-dom'
import { FaUser, FaRegFileAlt } from 'react-icons/fa' // Add missing import
import CollaboratorsPage from './CollaboratorsPage'

  

const ScientificActivitiesPageV2 = memo(() => {
  const { profileId } = useParams();
  const [scientificProfileData, setScientificProfileData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await apiService.profiles.scientificProfile(profileId);
        setScientificProfileData(response)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [profileId])
  
  if (loading) {
    return (
      <div className="m-6 flex justify-center items-center h-40">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-blue-200 rounded-full mb-2"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (!scientificProfileData) {
    return (
      <div className="m-6 text-red-600 font-semibold">
        No scientific profile data found for ID: {profileId}
      </div>
    );
  }

  // Fix the stat cards to handle long titles better with improved typography
  const renderStatCards = () => {
    let entries = Object.entries(scientificProfileData);
    const filteredEntries = entries.filter(([key, value]) => (!Array.isArray(value) && typeof value !== 'object'))
    const bgColors = ['bg-teal-600', 'bg-blue-600', 'bg-indigo-600', 'bg-purple-600', 'bg-pink-600', 'bg-orange-600', 'bg-emerald-600', 'bg-cyan-600'];
    return filteredEntries.map(([key, value], index) => {
      const formattedKey = key.replace(/_/g, " ").split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
      return (
        <div key={index} className={`rounded-lg shadow-md p-5 w-full h-40 ${bgColors[index % bgColors.length]} flex flex-col justify-between`}>
          <p className='text-white text-sm font-medium tracking-wide uppercase'>{formattedKey}</p>
          <p className='text-white text-3xl font-bold text-center'>{value}</p>
          <div className="h-2"></div>
        </div>
      )
    })
  }

  // Collaborator card component
  const CollaboratorCard = ({ collaborator }) => {
    // Add default values to prevent errors when properties don't exist
    const name = collaborator.name || 'Unknown';
    const affiliations = collaborator.affiliations || [];
    const count = collaborator.count || 0;
    
    return (
      <div className="bg-white rounded-lg shadow-md p-5 border border-gray-100 flex flex-col min-h-[180px]">
        <div className="flex gap-3 mb-3">
          {collaborator.profileImg ? (
            <img
              src={collaborator.profileImg}
              alt={name}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <FaUser className="text-gray-500" />
            </div>
          )}
          <div className="flex-1 flex flex-col justify-between gap-3">
            <p className="font-medium text-[#4b7ab8] hover:text-[#4b7ab8] cursor-pointer transition-colors duration-200">{name}</p>
            <p className="text-sm text-[#9d9d9d] mt-1">{affiliations[0] || 'No affiliation'}</p>
            <div className="w-25 flex items-center bg-green-50 hover:bg-green-100 rounded-md px-3 py-1 cursor-pointer transition-colors duration-200">
              <div className="w-10 p-2 h-8 bg-green-500 rounded-md flex items-center justify-center mr-2">
                <FaRegFileAlt className="text-white text-xs" size={20} />
              </div>
              <span className="text-gray-500 text-md font-medium pl-2">{count}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className='grid lg:grid-cols-4 gap-4 m-6 md:grid-cols-2 sm:grid-cols-1'>
        {renderStatCards()}
      </div>
      
      {/* Main content section with articles and collaborators */}
      <div className='m-6'>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Articles section - takes full width on left side */}
          <div className="bg-gray-50 rounded-lg p-6 h-full">
            <h1 className='text-2xl font-semibold text-gray-800 mb-6 border-b pb-2'>Top Five Articles</h1>
            <div className="space-y-4">
              {Array.isArray(scientificProfileData?.top_5_cited_artciles) && scientificProfileData.top_5_cited_artciles.length > 0 ? (
                scientificProfileData.top_5_cited_artciles.map((profile, index) => (
                  <div key={index} className="flex justify-between gap-10 shadow-md px-6 py-5 rounded-lg border-l-4 border-blue-500 bg-white">
                    <div className='flex flex-col gap-1 w-[80%]'>
                      <h2 className='text-lg font-semibold text-gray-800'>{profile.title}</h2>
                      <a href={profile.link} target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:text-blue-800 transition-colors'>{profile.link}</a>
                      <p className="text-gray-600">{profile.journal}</p>
                      <p className='text-gray-700 font-medium'>Count of Citation: <span className='text-blue-600 font-semibold'>{profile.citation_count === 0 ? "NaN" : profile.citation_count}</span></p>
                    </div>
                    <div>
                      <p className="text-gray-500 pr-2">Published on {profile.publication_date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No popular articles found for this profile.</p>
              )}
            </div>
          </div>
          
          {/* Collaborator card section - right side with grid for large screens */}
          <div className="bg-gray-50 rounded-lg p-6 h-full">
            <h1 className='text-2xl font-semibold text-gray-800 mb-6 border-b pb-2'>Collaborator Information</h1>
            <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4">
              {
                Array.isArray(scientificProfileData?.top_10_coauthors) && scientificProfileData.top_10_coauthors.length > 0 ? (
                  scientificProfileData.top_10_coauthors.map((profile, index) => (
                    <CollaboratorCard key={index} collaborator={profile} />
                  ))
                ) : (
                  <p className="text-gray-500 italic">No collaborator information available.</p>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
})

export default ScientificActivitiesPageV2