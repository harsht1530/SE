import React,{useState,useEffect} from 'react'
import {hospitalApiService} from '../../services/api';
import { useParams } from 'react-router-dom';
import { FaHospitalSymbol } from 'react-icons/fa';
import { Search } from "lucide-react";
import { FaExternalLinkAlt } from 'react-icons/fa';
import { BiLike } from "react-icons/bi";
import { GoEye } from "react-icons/go";
import { FaRegCommentAlt } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoMdHeartEmpty } from "react-icons/io";
import { AiOutlineRetweet } from "react-icons/ai";
import  ShimmerEffect  from '../../Components/ShimmerEffect';
import { set } from 'lodash';

const tabs = [ 'Youtube Videos', 'Youtube Shorts',"Twitter"];
  
  const tabKeyMap = {
    'Youtube Videos': 'Popular',
    'Youtube Shorts': 'Shorts',
    Twitter: 'Twitter',
  };
  


const HCODigitalPage = () => {
    const { id } = useParams();
    const [HCODigitalData, setHCODigitalData] = useState(null);
    const [videosLoading, setVideosLoading] = useState(false);
    const [videosFetched, setVideosFetched] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [HCOTwitterData, setHCOTwitterData] = useState(null);
    const [twitterLoading, setTwitterLoading] = useState(false);
    const [twitterFetched, setTwitterFetched] = useState(false);
    const [twitterErrorMsg, setTwitterErrorMsg] = useState('');
    const [activeTab, setActiveTab] = useState('Youtube Videos');
    const activeKey = tabKeyMap[activeTab];

    // console.log("Active Tab:", activeTab);
    // console.log('activeKey:', activeKey);
    // console.log("Profile ID in Digital Page:", id);
    // console.log("HCODigitalData:", HCODigitalData);
    // console.log("HCOTwitterData:", HCOTwitterData);

    useEffect(() => {
        const fetchVideos = async () => {
          try {
            setVideosLoading(true);
            setErrorMsg('');
            const response = await hospitalApiService.hospital.getHCODigitalData(id);
            
            if (response.status === 200) {
                console.log("HCODigitalData response:", response);
              const data = {
                Popular: response.Popular || [],
                Shorts: response.Shorts || []
              };
              setHCODigitalData(data);
            } else {
              const error = response.data?.error;
              setErrorMsg(error);
              // console.error("Error fetching videos:", error);
            }
          } catch (err) {
            const axiosError = err?.response?.data?.error || err.message || 'An error occurred.';
            setErrorMsg(axiosError);
            // console.error("Error fetching videos:", axiosError);
          } finally {
            setVideosLoading(false);
            setVideosFetched(true);
          }
        };
    
        if (id) fetchVideos();
      }, [id]);
    
    useEffect(() => {
      const fetchTwitterData = async () => {
        try{
          setTwitterLoading(true);
          const response = await hospitalApiService.hospital.getHCODigitalData(id);
          console.log("HCOTwitterData response:", response);
        if (response.status ===200){
          setHCOTwitterData({Twitter: response.data || []}
            
          );
          console.log("Twitter data fetched successfully:", response.data);
        }
        }
        catch (err) {
          const axiosError = err?.response?.data?.error || err.message || 'An error occurred while fetching Twitter data.';
          setTwitterErrorMsg(axiosError);
          setLoading(false);
          // console.error("Error fetching Twitter data:", axiosError);
        }finally {
          setTwitterLoading(false);
          setTwitterFetched(true);
        }
      }
      if (id) fetchTwitterData();
    },[id]);

  return (
    <div className='mx-10 mt-4 mb-4 border border-gray-200 rounded-md p-4'>
        <h1 className='font-medium text-lg'>Digital</h1>
        <div className='flex items-center justify-between mt-4'>
        <div className="relative flex-1 max-w-md z-50">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/60" size={20} />
            <input
                type="text"
                placeholder="Search for News..."
                className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm  text-gray-700"
            />
        </div>
        <div>
            <select className='border border-gray-300 rounded-md p-2 cursor-pointer'>
                <option>Data Range</option>
            </select>
            
        </div>
        
        </div>
        <div className='mt-4 flex flex-col gap-4'>
            {/*tabs */}
            <div className='flex justify-center items-center gap-14 mt-10'>
                
                {tabs.map((tab) =>{
                  let count = 0;
                    if (tab === 'Youtube Videos') {
                        count = HCODigitalData?.Popular?.length || 0;
                    } else if (tab === 'Youtube Shorts') {
                        count = HCODigitalData?.Shorts?.length || 0;
                    } else if (tab === 'Twitter') {
                        count = HCOTwitterData?.Twitter?.length || 0;
                    }
                
                return(
                    <button
                        key={tab}
                        onClick={() => {
                        
                        setActiveTab(tab);
                        // console.log("Clicked tab:", activeTab);
                        }}
                        className={`px-4 py-2 mx-2 rounded ${
                        activeTab === tab ? 'bg-[#800080] text-white' : 'bg-gray-200'
                        }`}
                    >
                        { tab} ({count})
                    </button>
                    )})}
            </div>
            <div className=''>
                {/*youtube videos tab */}
                {activeTab === 'Youtube Videos' && (
                  videosLoading ? (
                    <div >
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                          <ShimmerEffect key={item} type="video" />
                        ))}
                        
                      </div> 
                      
                  ) :videosFetched && HCODigitalData?.Popular?.length > 0 ? (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14 items-start my-8' >
                    {HCODigitalData.Popular.map((video) => (
                        
                         <div key={video.id} className='w-[400px] '>
                            <iframe
                                src={`https://www.youtube.com/embed/${video.id}`}
                                className=" rounded-md w-full h-[210px]"
                                allowFullScreen
                                frameborder="0"
                            />
        
                            <div className='pt-4'>
                                <h4 className='text-md font-medium'>{video.Title}</h4>
                                <p className='pt-1 text-sm font-medium text-gray-600'><span className=''>Published Date: {"  "}</span>{video.publishedTime.split('T')[0]}</p>
                                
                                <div className='flex items-center gap-8 pt-2'>
                                
                                <p className='flex items-center'><span className='pr-1 font-semibold flex items-center gap-2'><GoEye />Views:</span>{video.statistics?.viewCount ?? 0}</p>
                                <p className='flex items-center'><span className='pr-1 font-semibold flex items-center gap-2'><BiLike />Likes:</span>{video.statistics?.likeCount ?? 0}</p>
                                <p className='flex items-center'><span className='pr-1 font-semibold flex items-center gap-2'><FaRegCommentAlt />Comments:</span>{video.statistics?.commentCount ?? 0}</p>
                                
        
                                </div>
                                
        
                            </div>
                                           
                         </div>
                       
                        
                    ))}
                    </div>):(activeTab==='Youtube Videos'&& videosFetched && <div className='flex justify-center items-center font-medium'>No youtube videos available</div>))}


                {/*youtube shorts tab */}
                {activeTab === 'Youtube Shorts' && HCODigitalData && HCODigitalData.Shorts && HCODigitalData.Shorts.length > 0 ? (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14 items-start my-8'>
                    {HCODigitalData.Shorts.map((short) => (
                        <div key={short.id} className='w-[400px]'>
                            <iframe
                                src={`https://www.youtube.com/embed/${short.id}`}
                                className=" rounded-md w-full h-[210px]"
                                allowFullScreen
                                frameborder="0"
                            />
        
                            <div className='pt-4'>
                                <h4 className='text-md font-medium'>{short.Title}</h4>
                                <p className='pt-1 text-sm font-medium text-gray-600'><span className=''>Published Date: {"  "}</span>{short.publishedTime.split('T')[0]}</p>
                                
                                <div className='flex items-center gap-8 pt-2'>
                                
                                <p className='flex items-center'><span className='pr-1 font-semibold flex items-center gap-2'><GoEye />Views:</span>{short.statistics?.viewCount ?? 0}</p>
                                <p className='flex items-center'><span className='pr-1 font-semibold flex items-center gap-2'><BiLike />Likes:</span>{short.statistics?.likeCount ?? 0}</p>
                                <p className='flex items-center'><span className='pr-1 font-semibold flex items-center gap-2'><FaRegCommentAlt />Comments:</span>{short.statistics?.commentCount ?? 0}</p>
                                
        
                                </div>
                                
        
                            </div>
                        </div>
                    ))}
                    </div>
                ) : (activeTab === 'Youtube Shorts' &&
                    <div className='flex justify-center items-center m-10 font-medium'>No Youtube Shorts data available</div>)}
                
                {/*Twitter tab */}
                {activeTab === 'Twitter' && HCOTwitterData && HCOTwitterData.Twitter && HCOTwitterData.Twitter.length > 0 ? (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14 items-start my-8' >
                    {HCOTwitterData.Twitter.map((tweet) => (
                        <div key={index} className='w-[400px] min-h-[310px] bg-white rounded-md p-4 shadow-md '>
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
                                    <p><FaXTwitter size={30}/></p>
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
                                        <p className='flex items-center gap-1'><CiBookmark size={20}/> {tweet.bookmarkCount}</p>
                                        {/* <p className='flex items-center gap-1'><FaRegShareFromSquare size={20}/> 34</p> */}
                                    </div>
                                    <a href={tweet.twitterUrl} target='_blank'>
                                    <button className='border border-gray-400 rounded-md p-2 w-full mt-4'>Read More</button>
                                    </a>
                        </div>
                    ))}
                    </div>
                ) : (activeTab === 'Twitter'&& twitterFetched && <div className='flex justify-center items-center  m-10 font-medium '><p>No Twitter data available</p></div>)}
            </div>
               
              
            
        </div>
    </div>
  )
}

export default HCODigitalPage