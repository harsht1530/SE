import React, { useState,useEffect} from 'react'
import { hospitalApiService } from "../../services/api";
import HCOHeader from '../../Components/Hospitals/HCOHeader'
import HCOProfileDetails from './HCOProfileDetails'
import HCOOverViewPage from './HCOOverViewPage'
import HCOPeoplePage from './HCOPeoplePage'
import HCOCommitteesPage from './HCOCommitteesPage'
import HCODocumentsPage from './HCODocumentsPage'
import HCOEventsPage from './HCOEventsPage'
import HCONewsPage from './HCONewsPage'
import HCODigitalPage from './HCODigitalPage'
// import {hospitalApiService} from '../../services/api'
import { useParams } from 'react-router-dom';


const tabs = [
    
    "People",
    // "Committees",
    "Documents",
    "Events",
    "Digital",
    "About"

]

const HCOProfilePage = () => {
    const [activeTab, setActiveTab] = useState("People");
    const [hcoProfile, setHcoProfile] = useState('');
    const [loading, setLoading] = useState(true);
    const { id } = useParams();


    useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await hospitalApiService.hospital.getHCOProfileById(id);
              // console.log("HCO Profiles response in profile page:", response.data);
              setHcoProfile([response.data]);
          } catch (error) {
              console.error("Error fetching HCO Profiles:", error);
          }finally{
              setLoading(false);
          }
      };
  
      fetchData();
  }, [id]);

    console.log("Hospital Id data in profile page",hcoProfile)


   

    const renderTabContent = () =>{
        switch (activeTab) {
           
            case "People":
                return <HCOPeoplePage hcoProfile={hcoProfile} loading={loading}/>;
            // case "Committees":
            //     return <HCOCommitteesPage hcoProfile={hcoProfile} loading={loading}/>;
            case "Documents":
                return <HCODocumentsPage />;
            case "Events":
                return <HCOEventsPage />;
            case "Digital":
                return <HCODigitalPage />;
            case "About":
                return <HCOOverViewPage />;
            default:
                return null;
        }
    }
  return (
    <>
    <HCOHeader />
    <HCOProfileDetails hcoProfile={hcoProfile} loading={loading}/>

    <div className="flex space-x-6  mx-10 py-2">
      {tabs.map((tab, index) => (
        <button
          key={index}
          role="tab"
          aria-selected={activeTab === tab}
          onClick={() => setActiveTab(tab)}
          className={`cursor-pointer pb-2 ${
            activeTab === tab
              ? "text-[#800080] border-b-2 border-[#800080] font-semibold"
              : "text-gray-600"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>

    {renderTabContent()}


    </>
  )
}

export default HCOProfilePage