import React, { useEffect, useState, useCallback } from "react";
import { useParams } from 'react-router-dom';
import { FaUser, FaRegFileAlt } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";

import { GoogleMap, MarkerClusterer, Marker, useLoadScript, InfoWindow } from '@react-google-maps/api';
import { useDoctorProfile } from "../Context/DoctorProfileContext";
import apiService from "../services/api";
import CryptoJS from "crypto-js"
import { renderToString } from "react-dom/server";
import axios from 'axios';
import { useScientificProfileData } from "../Context/ScientificProfileDataContext";
import { useDispatch } from "react-redux";
import { setReachFlag as setReachFlagGlobal } from "../utils/reachFlagSlice";


const CollaboratorsPage = () => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [regions, setRegions] = useState({})
  const [affiliations, setAffiliations] = useState({})
  const {encryptedProfileId} = useParams();
  const recordIdSecret = import.meta.env.VITE_RECORDID_SECRET
  const { doctorProfile } = useDoctorProfile();
  const REACT_APP_GOOGLE_MAPS_API_KEY = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;
  const { scientificProfileData } = useScientificProfileData();

  const maxVisibleCollaborators = 3;
  const maxVisibleStats = 3;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isStatsExpanded, setIsStatsExpanded] = useState(false);
  const [reachFlag, setReachFlag] = useState("Local");

  const visibleCollaborators = isExpanded ? scientificProfileData?.top_10_coauthors : scientificProfileData?.top_10_coauthors.slice(0, maxVisibleCollaborators);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const decryptRecordId = (encryptedRecordId) => {
    const bytes = CryptoJS.AES.decrypt(encryptedRecordId, recordIdSecret);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  const profileId = decryptRecordId(encryptedProfileId);


console.log(profileId, "YYYYYYYYYYYYYYYYYYYYYYYYYYYYprofileId in collab page");
  const mapContainerStyle = {
    width: '90%',
    height: '600px',
    borderRadius: '8px',
    marginBottom: '20px',

  };

  const iconStyle = {
    width: '50px',
    height: '50px',
    color: "#800080",
    borderRadius: '50%',


  }

  const svgString = renderToString(<FaMapMarkerAlt style={iconStyle} />)
  const base64SVG = `data:image/svg+xml;base64,${btoa(svgString)}`;
  const center = {
    lat: doctorProfile?.Latitude_1 !== "NaN" ? parseFloat(doctorProfile.Latitude_1) : 20,
    lng: doctorProfile?.Longitude_1 !== "NaN" ? parseFloat(doctorProfile.Longitude_1) : 0
  };

  const toggleCoauthors = () => {
    setIsExpanded(!isExpanded);
  }

  useEffect(() => {
    if (!scientificProfileData?.top_10_coauthors) return;

    const extractAffiliations = scientificProfileData?.top_10_coauthors.map((coAuthor) => {
      if (!coAuthor.affiliations || !Array.isArray(coAuthor.affiliations) || !coAuthor.affiliations.length) {
        return null;
      }

      const affiliation = coAuthor.affiliations[0];

      return affiliation;

    }).filter(affiliation => affiliation !== null);

    let affiliationCounts = {};
    extractAffiliations.forEach((affiliation) => {
      affiliationCounts[affiliation] = (affiliationCounts[affiliation] || 0) + 1;
    })

    setAffiliations(affiliationCounts)


  }, [scientificProfileData]);

  useEffect(() => {
    const fetchCoAuthorsLocations = async () => {
      try {
        const response = await apiService.profiles.scientificProfile(profileId);
        let countryCount = {};

        if (response && response.top_10_coauthors) {
          const locationPromises = response.top_10_coauthors.map(async (coAuthor) => {
            const address = coAuthor.affiliations && coAuthor.affiliations[0];

            if (!address) {
              console.log('No valid address for:', coAuthor.name);
              return null;
            }

            const response = await axios.get(
              `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${REACT_APP_GOOGLE_MAPS_API_KEY}`
            );

            if (response.data.results.length > 0) {
              const result = response.data.results[0];
              const countryComponent = result.address_components?.find(
                component => component.types?.includes("country")
              );

              if (countryComponent) {
                const countryName = countryComponent.long_name;
                countryCount[countryName] = (countryCount[countryName] || 0) + 1;
              }

              return {
                position: result.geometry.location,
                name: coAuthor.name,
                institution: coAuthor.affiliations[0]
              };
            }
            return null;
          });


          const locations = (await Promise.all(locationPromises)).filter(loc => loc !== null);
          setMarkers(locations);
          setRegions(countryCount);
        }
      } catch (error) {
        console.error('Error fetching co-authors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoAuthorsLocations();
  }, [profileId]);

  const calculateReachFlag = useCallback(() => {
    const countryCount = Object.keys(regions).length;
    if (countryCount >= 5) return "Global";
    if (countryCount > 1) return "Regional";
    if (countryCount === 1) return "National";
    return "Local";
  }, [regions]);

  useEffect(() => {
  const newReachFlag = calculateReachFlag();
  setReachFlag(newReachFlag);
}, [regions, calculateReachFlag, ]);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('reachFlagUpdated', { 
        detail: { reachFlag } 
      }));
    }
  }, [reachFlag]);

  if (loading) {
    return <div>Loading map...</div>;
  }

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded || loading) {
    return <div>Loading map...</div>;
  }

  const CollaboratorCard = ({ collaborator }) => {

    const name = collaborator.name;
    console.log(name, "colla name")
    const affiliations = collaborator.affiliations || [];
    // const count = collaborator.count || 0;

    return <>
      {name && (<div className="bg-white rounded-lg shadow-md p-5 border border-gray-100 flex flex-col min-h-[180px]">
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
          <div className="flex-1 flex flex-col justify-between items-start gap-3 mt-2">
            <p className="font-medium text-[#000] transition-colors duration-200">{name}</p>
            <p className="text-sm text-[#595959] mt-1">{affiliations[0] || 'No affiliation'}</p>
            <div className="flex items-center justify-center">
              <div className="w-25 flex items-center rounded-md px-3 py-1 border-gray-300 border transition-colors duration-200 mr-1">
                <div className="w-10 p-2 h-8 bg-[#800080] rounded-md flex items-center justify-center mr-2">
                  <FaRegFileAlt className="text-white text-xs" size={20} />
                </div>
                <span className="text-gray-500 text-md font-medium pl-2">{collaborator?.["not_guideline_count"]}</span>
              </div>
              <div className="w-25 flex items-center rounded-md px-3 py-1 border-gray-300 border transition-colors duration-200">
                <div className="w-10 p-2 h-8 bg-[#55b74a] rounded-md flex items-center justify-center mr-2">
                  <FaRegFileAlt className="text-white text-xs" size={20} />
                </div>
                <span className="text-gray-500 text-md font-medium pl-2">{collaborator?.["guideline_count"]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>)}
    </>
  };

  const StatsSection = ({ title, data }) => (

    data = isStatsExpanded ? data : data.slice(0, maxVisibleStats),
    data.sort((a,b) => b.count - a.count),
    <div className="flex-1">
      <h3 className="text-lg text-[#000] mb-3 font-medium flex items-center justify-center">{title}</h3>
      <div className="space-y-1">
        {data.map((item, index) => (
          <div key={index} className="pb-1 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
            <div className="flex justify-between items-center py-1 px-4">
              <span className="text-[#7c3a84] transition-colors duration-200">{!(title === "Affiliations") ? item.country : item.affiliation}</span>

              <span className="text-gray-500 text-md font-medium">{item.count}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
  const initialZoom = doctorProfile?.Latitude_1 !== "NaN" && doctorProfile?.Longitude_1 !== "NaN" ? 17 : 2;

  return (
    <> <div className=" rounded-lg p-6 h-full mt-4">

      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
        {
          Array.isArray(scientificProfileData?.top_10_coauthors) && scientificProfileData.top_10_coauthors.length > 0 ? (
            <>
              {visibleCollaborators?.map((profile, index) => (
                <CollaboratorCard
                  key={index}
                  collaborator={profile}
                />
              ))}



            </>
          ) : (
            <p className="text-gray-500 italic">No collaborator information available.</p>
          )
        }
      </div>
      {scientificProfileData?.top_10_coauthors.length > 0 && <div className="flex items-center justify-center m-2">
        <button
          onClick={() => toggleCoauthors()}
          className="px-2 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-200 text-center
        text-[#800080]"
        >
          {isExpanded
            ? "Show Less"
            : `Show More (${scientificProfileData?.top_10_coauthors.length - maxVisibleCollaborators})`}
        </button>
      </div>}
    </div>
      <div className=" m-4">
        {/* Stats Section */}
        <div className="bg-white mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md cols-span-1 p-4 px-8">
            <StatsSection title="Country / State" data={Object.entries(regions).map(([country, count]) => (
              { country, count }
            ))} />



          </div>
          <div className="bg-white rounded-lg shadow-md cols-span-1 p-4 px-8">
            <div className="flex flex-col md:flex-row">

              <StatsSection title="Affiliations" data={Object.entries(affiliations).map(([affiliation, count]) => (

                { affiliation, count }
              ))} />
            </div>



          </div>
          {/* <div className="mt-6 text-center">
          <button className="text-[#A2C0DD] hover:text-[#6693c9] font-medium uppercase text-sm transition-colors duration-200">
            SHOW MORE
          </button>
        </div> */}
        </div>
        {Object.entries(affiliations).length>0 && <div className="flex items-center justify-center m-2">
          <button

            className="px-2 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-200 text-center
        text-[#800080]"

            onClick={() => setIsStatsExpanded(prev => !prev)}>{isStatsExpanded ? "SHOW LESS" : "SHOW MORE"}


          </button>
        </div>}
      </div>
      <div className="flex justify-center items-center m-4">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={initialZoom}
          onLoad={map => setMap(map)}
          options={{
            minZoom: 2,
            maxZoom: 20,
            restriction: {
              latLngBounds: {
                north: 85,
                south: -85,
                west: -180,
                east: 180
              },
              strictBounds: true
            },
            streetViewControl: false,      // Removes street view control
            mapTypeControl: false,         // Removes map type control (satellite/terrain options)

            zoomControl: true,             // Keeps zoom control
            navigationControl: false,      // Removes navigation control
            scaleControl: false,           // Removes scale control
            gestureHandling: 'greedy',
            // centerControl:true,
            // mapTypeId: 'roadmap',
            draggable: true,

          }}


        >
          {doctorProfile && doctorProfile.Latitude_1 !== "NaN" && doctorProfile.Longitude_1 !== "NaN" && (
            <Marker
              position={{
                lat: parseFloat(doctorProfile.Latitude_1),
                lng: parseFloat(doctorProfile.Longitude_1)
              }}
              title={doctorProfile.Full_Name}
              icon={{
                url: base64SVG,
                scaledSize: new window.google.maps.Size(50, 50), // Adjust as needed
                anchor: new window.google.maps.Point(20, 40),   // Adjust anchor based on icon design
                origin: new window.google.maps.Point(0, 0),
              }}
            />
          )}

          <MarkerClusterer
            onClick={(cluster) => {
              const center = cluster.getCenter();
              map.panTo(center);
              map.setZoom(Math.min(map.getZoom() + 2, 15)); // Zoom in by 2 levels, but not beyond 15
            }}

          >
            {(clusterer) =>
              markers.map((marker, index) => (
                <Marker
                  key={index}
                  position={marker.position}
                  clusterer={clusterer}
                  title={`${marker.name}\n${marker.institution}`}
                  icon={{
                    url: base64SVG,
                    scaledSize: new window.google.maps.Size(50, 50), // Adjust as needed
                    anchor: new window.google.maps.Point(20, 40),   // Adjust anchor based on icon design
                  }}
                  onClick={() => {

                    map.panTo(marker.position);
                    map.setZoom(15);
                  }}
                />
              ))
            }
          </MarkerClusterer>

        </GoogleMap>
      </div>
    </>
  );
};

export default CollaboratorsPage;
