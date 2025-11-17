import React from 'react'
import { IoPerson } from "react-icons/io5";
import { FaPeopleGroup } from "react-icons/fa6";
import { LuFlagTriangleRight } from "react-icons/lu";
import { addFavorites } from '../../utils/favoriteSlice';

const HCOCommitteesPage = ({ hcoProfile}) => {
    
return (
    <div className='mx-10 mt-4 border border-gray-200 rounded-md p-4'>
            <h1 className='font-medium text-lg'>Committees</h1>
            <div>
            <div className='border border-gray-200 rounded-md mt-4 p-4'>
                    <h1 className='text-lg font-medium'>Clinical Ethics Committee</h1>
                    <p >{hcoProfile[0].Clinical_Committee_Description}</p>
                    <div className='flex items-center gap-2 mt-4'>
                        <div className='bg-[#C6EAD6] rounded-md p-2 flex items-center gap-2'>
                            <span className='font-medium'>Focus Area:</span>
                            {hcoProfile[0].Clinical_Focus_Area.map((area, index) => (
                                <span key={index} className='text-gray-700'>
                                    {area}{index < hcoProfile[0].Clinical_Focus_Area.length - 1 ? ', ' : ''}
                                </span>
                            ))}
                        </div>
                            <p className='bg-yellow-100 rounded-md p-2 '>Established: 2012</p>
                            <p className='bg-[#FFE3CC] rounded-md p-2 '>Location: {hcoProfile[0].Clinical_Location}</p>
                    </div>
                    <div>
                            <div className='flex items-center gap-2 mt-4'>
                            <IoPerson fill="#800080"/>
                            <p className='font-semibold'>Chairperson</p>
                            </div>
                            <p className='border border-gray-400 rounded-md p-2 w-108 mt-1'>{hcoProfile[0].Clinical_Chairperson_Name},({hcoProfile[0].Clinical_Speciality})</p>
                    </div>
                    {/* <div>
                            <div className='flex items-center gap-2 mt-4'>
                            <FaPeopleGroup  fill="#800080" size={20}/>
                            <p className='font-semibold'>Members</p>
                            </div>
                            <div className='flex items-center gap-2 mt-1'>
                             <p className='border border-gray-400 rounded-md p-2 w-108 mt-1'>Dr. Rajeev Menon(Paediatric Surgeon)-Member</p>
                             <p className='border border-gray-400 rounded-md p-2 w-108 mt-1'>Ms.Neha Rana(Patient Advocate)-External Member</p>
                             <p className='border border-gray-400 rounded-md p-2 w-108 mt-1'>Dr. Alka Tiwari(Legal Advisor)-Legal Consultant</p>
                            </div>
                    </div> */}
                    <div>
                            <div className='flex items-center gap-2 mt-4'>
                            <LuFlagTriangleRight  fill="#800080" size={20}/>
                            <p className='font-semibold'>Key MileStone</p>
                            </div>
                            <p>{hcoProfile[0].Clinical_Key_Milestone}</p>
                    </div>

            </div>
            <div className='border border-gray-200 rounded-md mt-4 p-4'>
                    <h1 className='text-lg font-medium'>Infection Control Committee</h1>
                    <p >{hcoProfile[0].Infection_Committee_Description}</p>
                    <div className='flex items-center gap-2 mt-4'>
                        <div className='bg-blue-100 rounded-md p-2 flex items-center gap-2'>
                            <span className='font-medium'>Focus Area:</span>
                            {hcoProfile[0].Infection_Focus_Area.map((area, index) => (
                                <span key={index} className='text-gray-700'>
                                    {area}{index < hcoProfile[0].Infection_Focus_Area.length - 1 ? ', ' : ''}
                                </span>
                            ))}
                        </div>
                            <p className='bg-yellow-100 rounded-md p-2 '>Established: 2012</p>
                            <p className='bg-[#FFE3CC] rounded-md p-2 '>Location: {hcoProfile[0].Infection_Location}</p>
                    </div>
                    <div>
                            <div className='flex items-center gap-2 mt-4'>
                            <IoPerson fill="#800080"/>
                            <p className='font-semibold'>Chairperson</p>
                            </div>
                            <p className='border border-gray-400 rounded-md p-2 w-108 mt-1'>{hcoProfile[0].Infection_Chairperson_Name},({hcoProfile[0].Infection_Speciality})</p>
                    </div>
                    {/* <div>
                            <div className='flex items-center gap-2 mt-4'>
                            <FaPeopleGroup  fill="#800080" size={20}/>
                            <p className='font-semibold'>Members</p>
                            </div>
                            <div className='flex items-center gap-2 mt-1'>
                             <p className='border border-gray-400 rounded-md p-2 w-108 mt-1'>Dr. Rajeev Menon(Paediatric Surgeon)-Member</p>
                             <p className='border border-gray-400 rounded-md p-2 w-108 mt-1'>Ms.Neha Rana(Patient Advocate)-External Member</p>
                             <p className='border border-gray-400 rounded-md p-2 w-108 mt-1'>Dr. Alka Tiwari(Legal Advisor)-Legal Consultant</p>
                            </div>
                    </div> */}
                    <div>
                            <div className='flex items-center gap-2 mt-4'>
                            <LuFlagTriangleRight  fill="#800080" size={20}/>
                            <p className='font-semibold'>Key MileStone</p>
                            </div>
                            <p>{hcoProfile[0].Infection_Key_Milestone}</p>
                    </div>

            </div>
            </div>

    </div>
)
}

export default HCOCommitteesPage