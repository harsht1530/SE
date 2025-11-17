import React from 'react'
import { FaExternalLinkAlt } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { LiaBedSolid } from "react-icons/lia";
import { IoIosPersonAdd } from "react-icons/io";
import { LiaProceduresSolid } from "react-icons/lia";
import { RiProgress5Fill } from "react-icons/ri";
import { FaCheckCircle } from "react-icons/fa";
import { GrServices } from "react-icons/gr";
import { FaLocationDot } from "react-icons/fa6";
import { MdOutlinePhoneCallback } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import { getAssetPath } from '../../utils/imageUtils';

const HCOOverViewPage = () => {
  return (
    <div className='mx-10 py-2  '>
        {/*GMB data */}
        <div className='px-8 pt-2 pb-8 mb-6 shadow-md rounded-md'>
            <h1 className='text-lg font-medium py-2'>Overview</h1>
            <table className='w-full'>
               
                <tr className='border-b border-gray-200'>
                    <td className='py-2 pr-10'>Summary</td>
                    <td className='py-2'>Medanta Gurugram is founded by Dr. Naresh Trehan, a world-rewoned cardiovascular and cardiothoracic surgeon. For Six yearsin a row, Medanta Gurugram has ranked as the Best Provate Hospital in India(2020,2021,2022,2023,2024 and 2025). it also featured in the list of top 250 world's Best Hospital Survey 2024 by Newsweek</td>
                </tr>
                <tr className='border-b border-gray-200'>
                    <td className='py-2 pr-10'>Founded</td>
                    <td className='py-2'>2009</td>
                </tr>
                <tr className='border-b border-gray-200'>
                    <td className='py-2 pr-10'>Founders</td>
                    <td className='py-2'>Naresh Trehan, Sunil Sachdeva</td>
                </tr>
                <tr className='border-b border-gray-200'>
                    <td className='py-2 pr-10'>Headquarters</td>
                    <td className='py-2'>Gurgaon, Haryana, India</td>
                </tr>
            </table>

        </div>
        {/* Hospital network */}
        <div className='px-8 py-2 shadow-md rounded-md  '>
            <h1 className='text-lg font-medium py-2'>Hospital Network</h1>
            <div className='flex justify-between gap-8  py-2 w-full'>
                <div className='w-[30%] flex flex-col gap-4'>
                    <div className='bg-[#800080] text-white px-4 py-2 rounded-md w-[90%]'>
                        <h2>Medanta-Gurgram</h2>
                        <p>Gurugram</p>
                    </div>
                    <div className='bg-gray-200 text-black p-2 rounded-md w-[90%]'>
                        <h2>Medanta-Gurgram</h2>
                        <p>Gurugram</p>
                    </div>
                    <div className='bg-gray-200 text-black p-2 rounded-md w-[90%]'>
                        <h2>Medanta-Gurgram</h2>
                        <p>Gurugram</p>
                    </div>
                </div>
                <div className='flex flex-col  gap-4 pb-4 w-[70%]'>
                    <h1 className='text-xl'>Medanta- Gurugram</h1>
                    <div className='border border-gray-300 rounded-md py-2 px-4 flex flex-col gap-2'>
                        <h2>Contact & Hours</h2>
                        <p className='flex items-center gap-2'><FaLocationDot /> Sector 38, Gurugram, Haryana, India</p>
                        <p className='flex items-center gap-2'><MdOutlinePhoneCallback />+91 124 41414141</p>
                        <p className='flex items-center gap-2'><IoMdTime />24/7 Emergency| OPD:    9:00AM - 9:00PM</p>
                    </div>
                    <div className='border border-gray-300 rounded-md py-2 px-4'>
                        <h1>Services & Specialties</h1>
                        <div className='flex flex-wrap gap-2 py-2'>
                            <button className='border border-primary rounded-full px-2 py-1'>Cardiology</button>
                            <button className='border border-primary rounded-full px-2 py-1'>Neurology</button>
                            <button className='border border-primary rounded-full px-2 py-1'>Oncology</button>
                            <button className='border border-primary rounded-full px-2 py-1'>Orthopedics</button>
                            <button className='border border-primary rounded-full px-2 py-1'>Transplant</button>

                        </div>
                    </div>  
                    <div className='border border-gray-300 rounded-md py-2 px-4 flex flex-col gap-2'>
                        <h2>Accreditations</h2>
                        <div className='flex flex-wrap gap-2 py-2'>
                            <p className='text-primary px-2 py-1 rounded-full bg-purple-200'>JCI</p>
                            <p className='text-primary px-2 py-1 rounded-full bg-purple-200'>NABH</p>
                            <p className='text-primary px-2 py-1 rounded-full bg-purple-200'>NABL</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/*Latest updates */}
        {/* <div className='p-2 shadow-md rounded-md'>
            <h1 className='font-medium py-2 text-lg'>Latest Updates</h1>
            <div className="flex items-center gap-4 py-2">
                <button className='bg-[#800080] text-white rounded-md p-2'>Documents[12]</button>
                <button className='border border-[#800080] rounded-md p-2'>Events[12]</button>
                <button className='border border-[#800080] rounded-md p-2'>News[12]</button>
                <button className='border border-[#800080] rounded-md p-2'>Digital[12]</button>
            </div>
            <h2 className='font-medium py-2 text-lg'>Top Documents</h2>
            <div className='flex flex-col gap-4'>
            <div className='flex justify-between items-center p-2 rounded-md border border-gray-300'>
                <div>
                    <h2>Clinical Guidelines for Managing Type 2 Diabetes</h2>
                    <p>Author: Department of Endocrinology, XYZ Hospital</p>
                    <p>Published: 2023-10-01</p>
                </div>
                <button className='p-2 rounded-md bg-gray-400 flex items-center  gap-2 cursor-pointer'>View More <FaExternalLinkAlt /></button>
            </div>
            <div className='flex justify-between items-center p-2 rounded-md border border-gray-300'>
                <div>
                    <h2>Clinical Guidelines for Managing Type 2 Diabetes</h2>
                    <p>Author: Department of Endocrinology, XYZ Hospital</p>
                    <p>Published: 2023-10-01</p>
                </div>
                <button className='p-2 rounded-md bg-gray-400 flex items-center gap-2 cursor-pointer'>View More <FaExternalLinkAlt /></button>
            </div>
            </div>
        </div> */}
        {/*Favourite Doctors */}
        {/* <div className='p-2 shadow-md rounded-md mt-8'>
            <h1 className='font-medium text-lg'>Favourites(Doctors)</h1>
            <div className='grid grid-cols-4 gap-4 py-2'>
                <div className='relative flex  items-center gap-2 p-2 rounded-md border border-gray-300'>
                    <img src={getAssetPath('profileImg1.png')} alt="profile"
                  className="w-15 h-15 rounded-full"/>
                  <div>
                    <h3>Dr.Naresh Trahan</h3>
                    <p>Chairman & Managing Director</p>
                  </div>
                  <FaStar className="absolute top-4 right-2" fill="#FF9F00" size={20}/>
                </div>
                <div className='relative flex  items-center gap-2 p-2 rounded-md border border-gray-300'>
                    <img src={getAssetPath('profileImg1.png')} alt="profile"
                  className="w-15 h-15 rounded-full"/>
                  <div>
                    <h3>Dr.Naresh Trahan</h3>
                    <p>Chairman & Managing Director</p>
                  </div>
                  <FaStar className="absolute top-4 right-2" fill="#FF9F00" size={20}/>
                </div>
                <div className='relative flex  items-center gap-2 p-2 rounded-md border border-gray-300'>
                    <img src={getAssetPath('profileImg1.png')} alt="profile"
                  className="w-15 h-15 rounded-full"/>
                  <div>
                    <h3>Dr.Naresh Trahan</h3>
                    <p>Chairman & Managing Director</p>
                  </div>
                  <FaStar className="absolute top-4 right-2" fill="#FF9F00" size={20}/>
                </div>
                <div className='relative flex  items-center gap-2 p-2 rounded-md border border-gray-300'>
                    <img src={getAssetPath('profileImg1.png')} alt="profile"
                  className="w-15 h-15 rounded-full"/>
                  <div>
                    <h3>Dr.Naresh Trahan</h3>
                    <p>Chairman & Managing Director</p>
                  </div>
                  <FaStar className="absolute top-4 right-2" fill="#FF9F00" size={20}/>
                </div>
               
            </div>
        </div> */}
        {/*Hospital Details */}
        <div className='p-2 shadow-md rounded-md mt-8'>
            <h2 className='font-medium text-lg'>Hospitals Details</h2>
            <div className='grid grid-cols-4 gap-4 py-2'>
            <div className='bg-[#F0E6FF] p-2 rounded-md flex items-center gap-4'>
                <p className='bg-white rounded-full p-4'><FaUserDoctor /></p>
                <div>
                    <p>Doctors</p>
                    <h2>900+</h2>
                </div>
            </div>
            <div className='bg-[#E6F0FF] p-2 rounded-md flex items-center gap-4'>
                <p className='bg-white rounded-full p-4'><LiaBedSolid /></p>
                <div>
                    <p>Beds</p>
                    <h2>1250+</h2>
                </div>
            </div>
            <div className='bg-[#EAF7F5] p-2 rounded-md flex items-center gap-4'>
                <p className='bg-white rounded-full p-4'><IoIosPersonAdd /></p>
                <div>
                    <p>Specialties</p>
                    <h2>50+</h2>
                </div>
            </div>
            <div className='bg-[#FFF0F5] p-2 rounded-md flex items-center gap-4'>
                <p className='bg-white rounded-full p-4'><LiaProceduresSolid size={20}/></p>
                <div>
                    <p>Procedures</p>
                    <h2>3+</h2>
                </div>
            </div>
            </div>
        </div>

        {/*specialties and Procedures */}
        <div className='flex gap-40 mt-8 shadow-md rounded-md p-2'>
            <div>
                <h1 className='text-lg '>Specialties</h1>
                <div className='grid grid-cols-3 gap-4 px-6 py-2'>
                    <p className='p-2 rounded-md border border-[#800080]'>Cardiac Surgery</p>
                    <p className='p-2 rounded-md border border-[#800080]'>Neurosciences</p>
                    <p className='p-2 rounded-md border border-[#800080]'>Gastro Sciences</p>
                    <p className='p-2 rounded-md border border-[#800080]'>Critical Care</p>
                    <p className='p-2 rounded-md border border-[#800080]'>Internal Medicine</p>
                    <p className='p-2 rounded-md border border-[#800080]'>Orthopaedics</p>
                </div>

            </div>
           {/* Vertical Divider */}
            <div className="border-2 border-gray-400 h-auto self-stretch" />
            <div>
                <h1 className='text-lg pb-4'>Procedures</h1>
                <p className='p-2 rounded-md border border-blue-500'>Transplants(Kidney, liver, heart)</p>
            </div>
        </div>
        {/*Our Medical Experts */}
        <div className='p-2 shadow-md rounded-md mt-8'>
            <h1 className='font-medium text-lg'>Our Medical Experts</h1>
            <div className='grid grid-cols-3 gap-4 py-2'>
                <div className='flex justify-between  items-center gap-2 px-2 py-4 rounded-md border border-gray-300'>
                    <div className='flex items-center gap-2'>
                    <img src={getAssetPath('profileImg1.png')} alt="profile"
                  className="w-15 h-15 rounded-full"/>
                  <div>
                    <h3>Dr.A. Sreenivas</h3>
                    <p>Hepatologist</p>
                  </div>
                    </div>
                  <p className='border border-[#800080] p-2 rounded-md'>Liver Transplants</p>
                </div>
                <div className='flex justify-between  items-center gap-2 px-2 py-4 rounded-md border border-gray-300'>
                    <div className='flex items-center gap-2'>
                    <img src={getAssetPath('profileImg1.png')} alt="profile"
                  className="w-15 h-15 rounded-full"/>
                  <div>
                    <h3>Dr.Sudhir Dubey</h3>
                    <p>Neurosurgeon</p>
                  </div>
                    </div>
                  <p className='border border-[#800080] p-2 rounded-md'>skill Base & Brain Tumors</p>
                </div>
                <div className='flex justify-between  items-center gap-2 px-2 py-4 rounded-md border border-gray-300'>
                    <div className='flex items-center gap-2'>
                    <img src={getAssetPath('profileImg1.png')} alt="profile"
                  className="w-15 h-15 rounded-full"/>
                  <div>
                    <h3>Dr.Ashok Vaid</h3>
                    <p>Oncologist</p>
                  </div>
                    </div>
                  <p className='border border-[#800080] p-2 rounded-md'>Hemato-oncology</p>
                </div>

            </div>

        </div>

        {/*Research Activity */}
        <div className='p-2 shadow-md rounded-md mt-8'>
            <h1 className='font-medium text-lg'>Research Activity</h1>
            <div className='flex items-center gap-10 py-2'>
                <button className='bg-[#800080] text-white border  rounded-md p-2'>Non-Clinical Research</button>
                <button className='border border-gray-400 rounded-md p-2'>Publications</button>
                <button className='border border-gray-400 rounded-md p-2'>Clinical Trails</button>

            </div>
            <div className='flex items-center gap-6 py-2'>
            <div className='rounded-md border border-gray-300 p-2 mt-4'>
                <p className='bg-[#D4EDDA] flex items-center p-2 gap-2 rounded-md w-48 mb-2'><RiProgress5Fill fill="#2BAF66" size={20}/>ongoing Trail</p>
                <h1  className='text-lg'>Phase III study on Targeted Therapy for Breast Cancer</h1>
                <p className='text-gray-800'>Focus Area: Oncology</p>
                <p className='text-gray-500'>Partners: WHO, india Council of Medical Research(ICMR)</p>
            </div>
            <div className='rounded-md border border-gray-300 p-2 mt-4'>
                <p className='bg-[#D4EDDA] flex items-center p-2 gap-2 rounded-md w-48 mb-2'><FaCheckCircle fill="#2BAF66" size={20}/>ongoing Trail</p>
                <h1  className='text-lg'>Phase III study on Targeted Therapy for Breast Cancer</h1>
                <p className='text-gray-800'>Focus Area: Oncology</p>
                <p className='text-gray-500'>Partners: WHO, india Council of Medical Research(ICMR)</p>
            </div>
            </div>

        </div>

        {/*List of Accreditation */}
        <div className='p-2 shadow-md rounded-md mt-8'>
            <h1 className='font-medium text-lg'>List of Accreditation</h1>
            <div className='flex items-center gap-30 '>
            <div className='flex items-center gap-4 py-2'>
                <img src={getAssetPath('/Accreditation/image1.png')}/>
                <p className='text-lg font-medium'>NABH</p>
            </div>
            <div className='flex items-center gap-4 py-2'>
                <img src={getAssetPath('/Accreditation/image2.png')}/>
                <p className='text-lg font-medium'>JCI</p>
            </div>
            <div className='flex items-center gap-4 py-2'>
                <img src={getAssetPath('/Accreditation/image3.png')}/>
                <p className='text-lg font-medium'>ISO 9001</p>
            </div>
            <div className='flex items-center gap-4 py-2'>
                <img src={getAssetPath('/Accreditation/image4.png')}/>
                <p className='text-lg font-medium'>CAP(College of American Pathologists)</p>
            </div>
            </div>
        </div>
        
        {/*collaborations */}
        <div className='p-2 shadow-md rounded-md mt-8'>
            <h1 className='font-medium text-lg pb-2'>Collaborations</h1>
            <div className='flex items-center gap-4 '>
            <div className='flex flex-col gap-2 border border-gray-300 p-2 rounded-md'>
                <div className='flex justify-between items-center gap- py-2'>
                <div className='flex items-center gap-4'>
                <img src={getAssetPath('profileImg1.png')} alt="profile"
                  className="w-15 h-15 rounded-full"/>
                <div>
                    <h3 className='font-semibold text-lg'>Yale University</h3>
                    <p>Robotic Surgery R&D</p>
                </div>
                </div>
                <p className='bg-[#800080] rounded-md p-2 text-white'>International Research</p>
                </div>
                <p>Joint development of AI-assisted robotic surgical systems, with knowledge exchange programs and biannual research symposiums</p>
            </div>
            <div className='flex flex-col gap-2 border border-gray-300 p-2 rounded-md'>
                <div className='flex justify-between items-center gap- py-2'>
                <div className='flex items-center gap-4'>
                <img src={getAssetPath('profileImg1.png')} alt="profile"
                  className="w-15 h-15 rounded-full"/>
                <div>
                    <h3 className='font-semibold text-lg'>World Health Organization(WHO)</h3>
                    <p>COVID-19 Response Framework</p>
                </div>
                </div>
                <p className='bg-[#800080] rounded-md p-2 text-white'>Gloabal Health Alliance</p>
                </div>
                <p>Contributed to WHO's emergency preparedness protocols, data sharing on patient outcomes and vaccine logistics during the pandemic</p>
            </div>
            </div>
        </div>

        {/*International Patient Services */}
        <div className='p-2 shadow-md rounded-md mt-8'>
            <h1 className='font-medium text-lg'>International Patient Services at Medanta- The Medicity</h1>
            <p className='flex item-center gap-2 mt-1'><GrServices  className='mt-1'/>Services We Provided</p>
            <div className='flex items-center gap-4 py-2'>
                <div className='rounded-md border border-gray-300 p-2 mt-4'>
                    <button className='bg-[#800080] text-white  rounded-md p-2'>Before you Arrive</button>
                    <ul className='list-disc pl-6 mt-1'>
                        <li>Medical Opinion& Cost Estimate</li>
                        <li>Visa Invitation Letter</li>
                        <li>Travel & Appointment Help</li>
                    </ul>
                </div>
                <div className='rounded-md border border-gray-300 p-2 mt-4'>
                    <button className='bg-[#800080] text-white  rounded-md p-2'>On Arrival</button>
                    <ul className='list-disc pl-6 mt-1'>
                        <li>Airport Pickup & Drop</li>
                        <li>Deicated International Helpdesk</li>
                        <li>Personal Manager</li>
                    </ul>
                </div>
                <div className='rounded-md border border-gray-300 p-2 mt-4'>
                    <button className='bg-[#800080] text-white  rounded-md p-2'>Stay & Support</button>
                    <ul className='list-disc pl-6 mt-1'>
                        <li>Hotel/GuestHouse Booking</li>
                        <li>Attended Stay Opitons</li>
                        <li>Customized Meals</li>
                    </ul>
                </div>
                <div className='rounded-md border border-gray-300 p-2 mt-4'>
                    <button className='bg-[#800080] text-white  rounded-md p-2'>After Treatment</button>
                    <ul className='list-disc pl-6 mt-1'>
                        <li>Follow-Up & Reports</li>
                        <li>Online Consultations</li>
                        <li>Medical Support</li>
                    </ul>
                </div>
            </div>

        </div>


    </div>
  )
}

export default HCOOverViewPage