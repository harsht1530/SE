import React, { act, useEffect, useState, useContext } from 'react';
import { FaXTwitter } from "react-icons/fa6";
import axios from 'axios';
import apiService from "../services/api";
import { useParams } from "react-router-dom"
import { BiLike } from "react-icons/bi";
import { GoEye } from "react-icons/go";
import { FaRegCommentAlt } from "react-icons/fa";
import { FaYoutube, FaTwitter } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { IoMdHeartEmpty } from "react-icons/io";
import { AiOutlineRetweet } from "react-icons/ai";
import { FaRegCommentDots } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import { FaRegShareFromSquare } from "react-icons/fa6";

import { DigitalContext } from '../Context/DigitalContext';
import ShimmerEffect from '../Components/ShimmerEffect';
import HighlightedText from '../Components/HighlightedText';

/**
 * @component DigitalPage
 * @description Displays a doctor's digital presence through YouTube videos,
 * categorized into different types (videos and Shorts). Uses context
 * for state management and provides an interactive tabbed interface.
 * 
 * @context DigitalContext
 * - digitalData {Object} - Contains video data categorized by type
 * - setDigitalData {Function} - Updates digital content data
 * - loading {boolean} - Loading state indicator
 * - errorMsg {string} - Error message if fetch fails
 * 
 * @api
 * - digital: Fetches YouTube video data with the following structure:
 *   - Popular: Array of regular YouTube videos
 *   - Shorts: Array of YouTube shorts
 * 
 * @tabs
 * - videos: Regular YouTube videos with highest engagement
 * - Shorts: Short-form YouTube content
 * 
 * @visualElements
 * - Tab Navigation: Toggle between video types
 * - Video Grid: Responsive grid of embedded YouTube players
 * - Statistics Display: Views and likes for each video
 * - Loading Spinner: Visual feedback during data fetch
 * - Error Messages: User feedback for failed operations
 * 
 * @styling
 * - Responsive grid layout (1-3 columns based on screen size)
 * - Purple theme for active tabs (#800080)
 * - Embedded video dimensions: 400px width, 210px height
 * 
 * @example
 * <DigitalPage />
 * 
 * @returns {JSX.Element} A page displaying doctor's YouTube content in a tabbed interface
 */
const DigitalPage = ({ limit = null }) => {
  const tabs = ['Youtube Videos', 'Youtube Shorts', "Twitter"];

  const tabKeyMap = {
    'Youtube Videos': 'Popular',
    'Youtube Shorts': 'Shorts',
    Twitter: 'Twitter',
  };


  const { digitalData, setDigitalData, loading, errorMsg, twitterData, twitterErrorMsg } = useContext(DigitalContext);
  const [activeTab, setActiveTab] = useState('Youtube Videos');
  const activeKey = tabKeyMap[activeTab];
  // const [loading, setLoading] = useState(true);
  // const [errorMsg, setErrorMsg] = useState('');
  // const {profileId} = useParams();
  console.log("Digital Data in dgitial page:", digitalData);
  console.log("Twitter Data in the digital page", twitterData)
  const limitedData = limit && digitalData?.[activeKey]?.length > 0
    ? digitalData[activeKey].slice(0, limit)
    : digitalData?.[activeKey];



  return (
    <div className="flex flex-col items-center  p-6 bg-gray-50">
      <div className="flex justify-center items-center mb-4 gap-2 md:gap-8 lg:gap-8">
        {tabs.map((tab) => {
          const showCount = !limit;
        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-2 md:px-4 lg:px-4 py-2 mx-1 md:mx-2 lg:mx-2 rounded ${activeTab === tab ? 'bg-[#800080] text-white' : 'bg-gray-200'
              }`}
          >

            {tab === 'Youtube Videos' ? (
              <div className="flex items-center gap-2">
                <FaYoutube size={20} color="#FF0000" />
                <span>Videos</span>
                { showCount && (<span className='text-white-600'>
                  ({digitalData?.["Popular"]?.length || 0})</span>)}
              </div>
            ) : tab === 'Youtube Shorts' ? (
              <div className="flex items-center gap-2">
                <FaYoutube size={20} color="#FF0000" />
                <span>Shorts</span>
                { showCount && (<span>{digitalData?.["Shorts"]?.length || 0}</span>)}
                
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <FaSquareXTwitter size={20} color="#000" />
                <span>Twitter</span>
                {showCount && (<span>{twitterData?.Twitter?.Twitter_Response?.length || 0}</span>)}
              </div>
            )}

          </button>
        )}
        )}
      </div>
      <div className="">

        <>
          <div>
            {loading ? (
              // <div className="flex justify-center items-center py-10 gap-2">
              //   <div className="spinner"></div>
              //   <span className=" text-lg text-gray-600">Loading....</span>

              // </div>
              <ShimmerEffect type="video" />
            ) : errorMsg && activeTab !== "Twitter" ? (<p className='text-red-600 p-6 font-semibold'>{errorMsg}</p>) : (
              <>
                {limitedData?.length > 0 ? (
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14 items-start my-8 '>
                    {
                      limitedData.map((video) => {

                        return (
                          <div key={video.id} className='w-[350px] md:w-[400px] lg:w-[400px]'>
                            <iframe
                              src={`https://www.youtube.com/embed/${video.id}`}
                              className=" rounded-md w-full h-[210px]"
                              allowFullScreen
                              frameBorder="0"
                            />

                            <div className='pt-4'>
                              <h4 className='text-md font-medium'><HighlightedText text={video.Title} /></h4>
                              <p className='pt-1 text-sm font-medium text-gray-600'><span className=''>Published Date: {"  "}</span>{video?.publishedTime?.split('T')[0]}</p>

                              <div className='flex items-center gap-8 pt-2'>

                                <p className='flex items-center'><span className='pr-1 font-semibold flex items-center gap-2'><GoEye />Views:</span>{video.statistics?.viewCount ?? 0}</p>
                                <p className='flex items-center'><span className='pr-1 font-semibold flex items-center gap-2'><BiLike />Likes:</span>{video.statistics?.likeCount ?? 0}</p>
                                <p className='flex items-center'><span className='pr-1 font-semibold flex items-center gap-2'><FaRegCommentAlt />Comments:</span>{video.statistics?.commentCount ?? 0}</p>


                              </div>


                            </div>

                          </div>

                        )
                      })
                    }
                  </div>) : (
                  <p className='text-red-600 p-6 font-semibold text-lg'>
                    {activeTab === "Twitter" ? "" : "This tab has no videos."}
                  </p>
                )}
              </>
            )}
          </div>
          {activeTab === 'Twitter' && (
            <div className="">

              {twitterErrorMsg ? (
                <div>
                  {twitterErrorMsg ? (
                    <p className='text-red-600 p-6 font-semibold'>{twitterErrorMsg}</p>
                  ) : (
                    <p className='text-gray-600 p-6 font-semibold'>No Twitter data available.</p>
                  )}
                </div>) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 items-start my-2 md:my-8 lg:my-8'> 
                  {twitterData?.Twitter?.Twitter_Response?.length > 0 && (
                    (limit ? twitterData.Twitter.Twitter_Response.slice(0, limit) : twitterData.Twitter.Twitter_Response).map((tweet, index) => (
                      <div key={index} className='w-[350px] md:w-[400px] lg:w-[400px] min-h-[310px] bg-white rounded-md p-4 shadow-md'>
                        <div className='flex justify-between'>
                          <div className='flex items-center gap-2 pb-1 '>
                            <img src={tweet.author.profilePicture} alt="Twitter profile" className='object-cover rounded-full bg-gray-500' />
                            <div className='flex flex-col items-start p-2'>

                              <h1>{tweet.author.userName}</h1>
                              {/* <p className='text-gray-500'>@{tweet.author.userName}</p> */}
                              <div className='flex gap-2 items-center'>

                                <p>{tweet.author.following} <span className='text-gray-600'>following</span></p>
                                <p>{tweet.author.followers} <span className='text-gray-600'>followers</span></p>

                              </div>
                              {/* <button className='text-blue-600 bg-blue-100 rounded-md px-1'>Follow</button> */}



                            </div>
                          </div>
                          <p><FaXTwitter size={30} /></p>
                        </div>
                        {/* {/(https?:\/\/|www\.)[^\s]+/.test(tweet.fullText) ? (
                              <p className="text-gray-500 italic">Link detected — text not shown</p>
                            ) : (
                              <p className="overflow-hidden text-ellipsis whitespace-normal line-clamp-4">
                                {tweet.fullText}
                              </p>
                            )} */}
                        <p className="overflow-hidden text-ellipsis whitespace-normal line-clamp-4">
                          {tweet.fullText}
                        </p>
                        <p className='text-gray-500 font-medium pt-2'>{new Date(tweet.createdAt).toLocaleString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}</p>
                        {/* <div className='flex items-center gap-4 border-t border-b border-gray-300 pt-2 pb-2'>
                              <p><span className='text-gray-500'>1,256</span> Resposts</p>
                              <p>142 Quotes</p>
                              <p>152k views</p>
                            </div> */}
                        <div className='flex  items-center gap-14 pt-2'>
                          <p className='flex items-center gap-1'><IoMdHeartEmpty size={20} /> {tweet.likeCount}</p>
                          <p className='flex items-center gap-1'><AiOutlineRetweet size={20} /> {tweet.retweetCount}</p>
                          {/* <p className='flex items-center gap-1'><FaRegCommentDots size={20}/> 90</p> */}
                          <p className='flex items-center gap-1'><CiBookmark size={20} /> {tweet.bookmarkCount}</p>
                          {/* <p className='flex items-center gap-1'><FaRegShareFromSquare size={20}/> 34</p> */}
                        </div>
                        <a href={tweet.twitterUrl} target='_blank'>
                          <button className='border border-gray-400 rounded-md p-2 w-full mt-4'>Read More</button>
                        </a>
                      </div>
                    )))}



                </div>
              )}
            </div>
          )}
        </>


      </div>

    </div>
  );
};

export default DigitalPage;