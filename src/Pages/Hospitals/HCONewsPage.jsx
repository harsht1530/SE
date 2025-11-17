import React from 'react'
import { Search } from "lucide-react";
import { FaExternalLinkAlt } from 'react-icons/fa';

const HCONewsPage = () => {
  return (
    <div className='mx-10 mt-4 mb-4 border border-gray-200 rounded-md p-4'>
    <h1 className='font-medium text-lg'>News</h1>
    <div className='flex items-center justify-between mt-4'>
    <div className="relative flex-1 max-w-md z-50">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/60" size={20} />
        <input
            type="text"
            placeholder="Search for Documents..."
            className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm  text-gray-700"
        />
    </div>
    <div>
        <select className='border border-gray-300 rounded-md p-2 cursor-pointer'>
            <option>Data Range</option>
        </select>
       
    </div>
    
    </div>
    <div className=' mt-4 flex flex-col gap-4'>
            <div className='flex justify-between items-center p-2 rounded-md border border-gray-300'>
                <div className='flex flex-col gap-1 py-2'>
                    <h2 className='text-lg font-medium'>Robotic Surgery Program Reduces Recovery Time by 40%</h2>
                    <p className='text-sm font-medium text-[#800080]'><span className='text-black'>Published in:</span> MedTech Journal | May 2025</p>
                </div>
                <button className='p-2 rounded-md bg-gray-300 flex items-center  gap-2 cursor-pointer'>View More <FaExternalLinkAlt fill="#666666"/></button>
            </div>
            <div className='flex justify-between items-center p-2 rounded-md border border-gray-300'>
                <div className='flex flex-col gap-1 py-2'>
                    <h2 className='text-lg font-medium'>Robotic Surgery Program Reduces Recovery Time by 40%</h2>
                    <p className='text-sm font-medium text-[#800080]'><span className='text-black'>Published in:</span> MedTech Journal | May 2025</p>
                </div>
                <button className='p-2 rounded-md bg-gray-300 flex items-center  gap-2 cursor-pointer'>View More <FaExternalLinkAlt fill="#666666"/></button>
            </div>
            <div className='flex justify-between items-center p-2 rounded-md border border-gray-300'>
                <div className='flex flex-col gap-1 py-2'>
                    <h2 className='text-lg font-medium'>Robotic Surgery Program Reduces Recovery Time by 40%</h2>
                    <p className='text-sm font-medium text-[#800080]'><span className='text-black'>Published in:</span> MedTech Journal | May 2025</p>
                </div>
                <button className='p-2 rounded-md bg-gray-300 flex items-center  gap-2 cursor-pointer'>View More <FaExternalLinkAlt fill="#666666"/></button>
            </div>
           
          
        
    </div>
</div>
  )
}

export default HCONewsPage