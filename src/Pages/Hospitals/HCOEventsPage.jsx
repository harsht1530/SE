import React from 'react'
import { Search } from "lucide-react";
import { FaExternalLinkAlt } from 'react-icons/fa';
import { IoLocation } from "react-icons/io5";
import { IoPeopleSharp } from "react-icons/io5";

const HCOEventsPage = () => {
  return (
    <div className='mx-10 mt-4 mb-4 border border-gray-200 rounded-md p-4'>
        <h1 className='font-medium text-lg'>Events</h1>
        <div className='flex items-center justify-between mt-4'>
        <div className="relative flex-1 max-w-md z-50">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/60" size={20} />
            <input
                type="text"
                placeholder="Search for events by name, topic, or department..."
                className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm  text-gray-700"
            />
        </div>
        <div>
            <select className='border border-gray-300 rounded-md p-2 cursor-pointer'>
                <option>Data Range</option>
            </select>
            <select className='border border-gray-300 rounded-md p-2 ml-2 cursor-pointer'>
                <option>Document Type</option>
            </select>
        </div>
        
        </div>
        <div className=' mt-4 flex flex-col gap-4'>
                <div className='flex justify-between items-center p-2 rounded-md border border-gray-300'>
                    <div className='flex flex-col gap-1'>
                        <h2 className='text-lg'>International Cardiology Forum</h2>
                        <div className='flex items-center gap-2'>
                            <button className='bg-blue-300 px-2 py-1 rounded-md '>Conference</button>
                            <p>Jun 15, 2025</p>
                        </div> 
                        <p className='  flex items-center gap-2'><IoLocation fill="#666666"/> Medanta Auditorium, Gurugram</p>
                        <p className='text-sm font-medium text-gray-500 flex items-center gap-2'><IoPeopleSharp />Dept of Cardiology</p>
                    </div>
                    <button className='p-2 rounded-md bg-gray-300 flex items-center  gap-2 cursor-pointer'>View Details <FaExternalLinkAlt fill="#666666"/></button>
                </div>
                <div className='flex justify-between items-center p-2 rounded-md border border-gray-300'>
                    <div className='flex flex-col gap-1'>
                        <h2 className='text-lg'>Neuro Science Advancement Meet</h2>
                        <div className='flex items-center gap-2'>
                            <button className='bg-violet-300 px-2 py-1 rounded-md '>Academic</button>
                            <p>July 5, 2025</p>
                        </div> 
                        <p className='  flex items-center gap-2'><IoLocation fill="#666666"/> Neuro Block, Tower C</p>
                        <p className='text-sm font-medium text-gray-500 flex items-center gap-2'><IoPeopleSharp />Neurosurgery Research Wing</p>
                    </div>
                    <button className='p-2 rounded-md bg-gray-300 flex items-center  gap-2 cursor-pointer'>View Details <FaExternalLinkAlt fill="#666666"/></button>
                </div>
                <div className='flex justify-between items-center p-2 rounded-md border border-gray-300'>
                    <div className='flex flex-col gap-1'>
                        <h2 className='text-lg'>Liver Disease Awarness workshop</h2>
                        <div className='flex items-center gap-2'>
                            <button className='bg-green-200 px-2 py-1 rounded-md '>Public Health</button>
                            <p>Sep 15, 2025</p>
                        </div> 
                        <p className='  flex items-center gap-2'><IoLocation fill="#666666"/>Training Hall B, Medanata Tower A</p>
                        <p className='text-sm font-medium text-gray-500 flex items-center gap-2'><IoPeopleSharp />Hepatology & Gastroenterology</p>
                    </div>
                    <button className='p-2 rounded-md bg-gray-300 flex items-center  gap-2 cursor-pointer'>View Details <FaExternalLinkAlt fill="#666666"/></button>
                </div>
              
            
        </div>
    </div>
  )
}

export default HCOEventsPage