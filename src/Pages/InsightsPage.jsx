import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Mail, MessageCircle, MapPin, Clock } from 'lucide-react';
import { FaUser, FaPhone, FaEnvelope, FaCommentDots, FaVideo, FaCalendarAlt, FaStethoscope } from 'react-icons/fa';
import { GoogleMap, MarkerClusterer, Marker, useLoadScript, InfoWindow } from '@react-google-maps/api';
import { renderToString } from "react-dom/server";
import axios from 'axios';

const InsightsPage = () => {
  const [expandedSections, setExpandedSections] = useState({
    performance: true,
    targetList: true,
    addCampaign: true,
    fieldMessaging: true,
    doctorJourney: false // Add new section
  });

  // Territory Map States
  const [map, setMap] = useState(null);
  const [territoryMarkers, setTerritoryMarkers] = useState([]);
  const [loadingMap, setLoadingMap] = useState(true);
  const [selectedTerritory, setSelectedTerritory] = useState(null);

  // Add your Google Maps API key here
  const REACT_APP_GOOGLE_MAPS_API_KEY = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Doctor Journey Timeline Data
  // const doctorJourney = [
  //   {
  //     id: 1,
  //     title: "Email Introduction",
  //     description: "Oncology product information sent",
  //     date: new Date(2025, 8, 15),
  //     time: "9:30 AM",
  //     type: "email",
  //     channel: "Email",
  //     status: "completed",
  //     participant: "Dr. Priya Tiwari",
  //     specialty: "Medical Oncology"
  //   },
  //   {
  //     id: 2,
  //     title: "WhatsApp Follow-up",
  //     description: "Cancer treatment protocol shared",
  //     date: new Date(2025, 8, 18),
  //     time: "2:15 PM",
  //     type: "whatsapp",
  //     channel: "WhatsApp",
  //     status: "completed",
  //     participant: "Dr. Priya Tiwari",
  //     specialty: "Medical Oncology"
  //   },
  //   {
  //     id: 3,
  //     title: "SMS Reminder",
  //     description: "Clinical trial invitation",
  //     date: new Date(2025, 8, 22),
  //     time: "4:30 PM",
  //     type: "sms",
  //     channel: "SMS",
  //     status: "completed",
  //     participant: "Dr. Priya Tiwari",
  //     specialty: "Medical Oncology"
  //   },
  //   {
  //     id: 4,
  //     title: "Email Follow-up",
  //     description: "Patient outcome study results",
  //     date: new Date(2025, 8, 25),
  //     time: "1:45 PM",
  //     type: "email",
  //     channel: "Email",
  //     status: "completed",
  //     participant: "Dr. Priya Tiwari",
  //     specialty: "Medical Oncology"
  //   },
  //   {
  //     id: 5,
  //     title: "WhatsApp Group",
  //     description: "Oncology team discussion",
  //     date: new Date(2025, 8, 28),
  //     time: "7:20 PM",
  //     type: "whatsapp",
  //     channel: "WhatsApp",
  //     status: "completed",
  //     participant: "Artemis Oncology Team",
  //     specialty: "Medical Oncology"
  //   },
  //   {
  //     id: 6,
  //     title: "SMS Update",
  //     description: "New therapy guidelines notification",
  //     date: new Date(2025, 9, 2),
  //     time: "11:15 AM",
  //     type: "sms",
  //     channel: "SMS",
  //     status: "completed",
  //     participant: "Dr. Priya Tiwari",
  //     specialty: "Medical Oncology"
  //   },
  //   {
  //     id: 7,
  //     title: "Email Conference Invite",
  //     description: "Medical conference invitation sent",
  //     date: new Date(2025, 9, 5),
  //     time: "10:00 AM",
  //     type: "email",
  //     channel: "Email",
  //     status: "completed",
  //     participant: "Dr. Priya Tiwari",
  //     specialty: "Medical Oncology"
  //   },
  //   {
  //     id: 8,
  //     title: "WhatsApp Check-in",
  //     description: "Follow-up on conference participation",
  //     date: new Date(2025, 9, 7),
  //     time: "3:30 PM",
  //     type: "whatsapp",
  //     channel: "WhatsApp",
  //     status: "completed",
  //     participant: "Dr. Priya Tiwari",
  //     specialty: "Medical Oncology"
  //   }
  // ];

  // // Timeline Helper Functions
  // const formatDateHeader = (date) => {
  //   const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  //   return `${months[date.getMonth()]} ${date.getFullYear()}`;
  // };

  // const formatDateLabel = (date) => {
  //   const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  //   return `${months[date.getMonth()]} ${date.getDate()}`;
  // };

  // const getChannelIcon = (type) => {
  //   switch (type) {
  //     case 'email':
  //       return <FaEnvelope className="text-[#800080] text-sm" />;
  //     case 'whatsapp':
  //       return <FaCommentDots className="text-[#800080] text-sm" />;
  //     case 'sms':
  //       return <FaCommentDots className="text-[#800080] text-sm" />;
  //     default:
  //       return <FaStethoscope className="text-[#800080] text-sm" />;
  //   }
  // };

  // const getChannelColor = (type) => {
  //   const colors = {
  //     email: 'bg-blue-50 border-blue-200',
  //     whatsapp: 'bg-green-50 border-green-200',
  //     sms: 'bg-yellow-50 border-yellow-200'
  //   };
  //   return colors[type] || 'bg-gray-50 border-gray-200';
  // };

  // Hardcoded data (keeping existing)
  const campaignData = {
    audienceSize: 1140,
    sentEmails: 1128,
    totalMessages: 1128,
    pendingApproval: 0,
    approved: 198,
    rejected: 12,
    openEvents: 391,
    uniqueOpens: 33,
    clickEvents: 142,
    uniqueClicks: 12
  };

  const targetLevels = [
    { level: 1, email: 10, whatsapp: 2 },
    { level: 2, email: 220, whatsapp: 80 },
    { level: 3, email: 310, whatsapp: 90 },
    { level: 4, email: 130, whatsapp: 30 },
    { level: 5, email: 20, whatsapp: 8 }
  ];

  const maxValue = Math.max(...targetLevels.map(l => l.email + l.whatsapp));

  const territoryData = {
    territoriesImpacted: '5 / 10',
    regions: ['North', 'South', 'East', 'West', 'Central'],
    territories: [
      { id: 1, name: 'North Territory', address: 'Madrid, Spain', impacted: true, targetCount: 250 },
      { id: 2, name: 'South Territory', address: 'Seville, Spain', impacted: true, targetCount: 180 },
      { id: 3, name: 'East Territory', address: 'Valencia, Spain', impacted: true, targetCount: 320 },
      { id: 4, name: 'West Territory', address: 'Porto, Portugal', impacted: false, targetCount: 90 },
      { id: 5, name: 'Central Territory', address: 'Toledo, Spain', impacted: true, targetCount: 200 }
    ]
  };

  // Map styling
  const mapContainerStyle = {
    width: '100%',
    height: '320px',
    borderRadius: '8px',
  };

  const iconStyle = {
    width: '30px',
    height: '30px',
    color: "#800080",
  };

  const impactedIconStyle = {
    width: '30px',
    height: '30px',
    color: "#22c55e",
  };

  const svgString = renderToString(<MapPin style={iconStyle} />);
  const impactedSvgString = renderToString(<MapPin style={impactedIconStyle} />);
  const base64SVG = `data:image/svg+xml;base64,${btoa(svgString)}`;
  const impactedBase64SVG = `data:image/svg+xml;base64,${btoa(impactedSvgString)}`;

  const center = {
    lat: 40.4168,
    lng: -3.7038
  };

  // Fetch territory locations (keeping existing logic)
  useEffect(() => {
    const fetchTerritoryLocations = async () => {
      if (!REACT_APP_GOOGLE_MAPS_API_KEY || !territoryData.territories) {
        setLoadingMap(false);
        return;
      }

      try {
        const locationPromises = territoryData.territories.map(async (territory) => {
          if (!territory.address) {
            return null;
          }

          try {
            const response = await axios.get(
              `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(territory.address)}&key=${REACT_APP_GOOGLE_MAPS_API_KEY}`
            );

            if (response.data.results.length > 0) {
              const result = response.data.results[0];
              return {
                position: result.geometry.location,
                name: territory.name,
                address: territory.address,
                impacted: territory.impacted,
                targetCount: territory.targetCount,
                id: territory.id
              };
            }
            return null;
          } catch (error) {
            console.error('Geocoding error for territory:', territory.name, error);
            return null;
          }
        });

        const locations = (await Promise.all(locationPromises)).filter(loc => loc !== null);
        setTerritoryMarkers(locations);
      } catch (error) {
        console.error('Error fetching territory locations:', error);
      } finally {
        setLoadingMap(false);
      }
    };

    fetchTerritoryLocations();
  }, [REACT_APP_GOOGLE_MAPS_API_KEY]);

  const handleMarkerClick = (marker) => {
    setSelectedTerritory(marker);
    if (map) {
      map.panTo(marker.position);
      map.setZoom(Math.max(map.getZoom(), 10));
    }
  };

  const mapOptions = {
    minZoom: 4,
    maxZoom: 15,
    streetViewControl: false,
    mapTypeControl: false,
    zoomControl: true,
    fullscreenControl: false,
    gestureHandling: 'greedy',
    draggable: true,
  };

  // Timeline Component
  const InteractionTimeLine = ({ interactions = doctorJourney }) => {
    if (!interactions || interactions.length === 0) {
      return (
        <div className="py-8 text-center text-gray-500">No interactions to display</div>
      );
    }

    const sortedInteractions = [...interactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const groupedInteractions = sortedInteractions.reduce((acc, interaction) => {
      const monthYear = formatDateHeader(interaction.date);
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(interaction);
      return acc;
    }, {});

    const getChannelCounts = (interactions) => {
      return interactions.reduce((acc, interaction) => {
        acc[interaction.type] = (acc[interaction.type] || 0) + 1;
        return acc;
      }, {});
    };

    return (
      <div className="max-w-4xl mx-auto p-6">
        {Object.entries(groupedInteractions).map(([monthYear, monthInteractions]) => {
          const channelCounts = getChannelCounts(monthInteractions);
          
          return (
            <div key={monthYear} className="mb-8">
              <div className="mb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="flex items-center text-[#800080] font-semibold text-lg">
                    <Clock className="w-5 h-5 mr-2" />
                    {monthYear}
                  </div>
                </div>
                
                <div className="flex justify-center space-x-6 mb-6">
                  {Object.entries(channelCounts).slice(0, 3).map(([channel, count]) => (
                    <div key={channel} className="bg-white rounded-lg shadow-md p-4 text-center min-w-[120px]">
                      <div className="flex justify-center mb-2">
                        {getChannelIcon(channel)}
                      </div>
                      <div className="text-sm font-medium text-gray-800 capitalize">{channel}</div>
                      <div className="text-sm text-gray-600">{count} interaction{count > 1 ? 's' : ''}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-[#800080] opacity-30"></div>
                
                {monthInteractions.map((interaction, index) => (
                  <div key={interaction.id} className="relative mb-8">
                    <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                      <div className={`w-4 h-4 bg-[#800080] rounded-full shadow-md ${
                        interaction.status === 'scheduled' ? 'animate-pulse' : ''
                      }`}></div>
                    </div>
                    
                    <div className="flex justify-center mb-4">
                      <div className="bg-[#800080] text-white px-4 py-2 rounded-full text-sm font-medium">
                        {formatDateLabel(interaction.date)}
                      </div>
                    </div>
                    
                    <div className={`flex ${index % 2 === 0 ? 'justify-end pr-12' : 'justify-start pl-12'}`}>
                      <div className={`bg-white rounded-lg shadow-md p-6 w-full max-w-md border-l-4 ${getChannelColor(interaction.type)}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            {getChannelIcon(interaction.type)}
                            <span className="ml-3 text-sm font-semibold text-[#800080]">
                              {interaction.channel}
                            </span>
                          </div>
                          <span className={`text-xs px-3 py-1 rounded-full ${
                            interaction.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {interaction.status}
                          </span>
                        </div>
                        
                        <h3 className="font-semibold text-gray-800 text-base mb-2 leading-tight">
                          {interaction.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                          {interaction.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{interaction.time}</span>
                          <span className="font-medium">{interaction.participant}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        
        {/* Summary Stats */}
        <div className="bg-white border-t-2 border-gray-200 p-6 shadow-lg mt-8 rounded-lg">
          <h3 className="font-semibold text-[#800080] text-lg mb-4 text-center">Interaction Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <span className="text-gray-600 block">Total Interactions</span>
              <span className="font-bold text-2xl text-[#800080]">{doctorJourney.length}</span>
            </div>
            <div className="text-center">
              <span className="text-gray-600 block">Last Contact</span>
              <span className="font-semibold text-lg">1 day ago</span>
            </div>
            <div className="text-center">
              <span className="text-gray-600 block">Email Messages</span>
              <span className="font-bold text-2xl text-blue-600">3</span>
            </div>
            <div className="text-center">
              <span className="text-gray-600 block">WhatsApp + SMS</span>
              <span className="font-bold text-2xl text-green-600">5</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Campaign Performance Summary */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                <Mail className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Campaign Performance Summary</h2>
            </div>
            <button 
              onClick={() => toggleSection('performance')}
              className="text-blue-600 text-sm flex items-center gap-2 hover:text-blue-700"
            >
              View Campaign Performance
              {expandedSections.performance ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {expandedSections.performance && (
            <div className="p-6">
              <div className="grid grid-cols-7 gap-4">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Audience Size</div>
                  <div className="text-2xl font-semibold text-gray-800">{campaignData.audienceSize.toLocaleString()}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Sent Emails & Messages</div>
                  <div className="text-2xl font-semibold text-gray-800">
                    {campaignData.sentEmails.toLocaleString()} / {campaignData.totalMessages.toLocaleString()}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Pending Approval</div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded text-sm font-medium">{campaignData.pendingApproval}</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">Approved</div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-medium">{campaignData.approved}</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">Rejected</div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm font-medium">{campaignData.rejected}</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Open Events</div>
                  <div className="text-2xl font-semibold text-gray-800">{campaignData.openEvents}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Unique Opens</div>
                  <div className="text-2xl font-semibold text-gray-800">{campaignData.uniqueOpens}%</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Click Events</div>
                  <div className="text-2xl font-semibold text-pink-600">{campaignData.clickEvents}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Unique Clicks</div>
                  <div className="text-2xl font-semibold text-gray-800">{campaignData.uniqueClicks}%</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Target List Summary with Territory Map */}
        {/* Target List Summary with Territory Map */}
<div className="bg-white rounded-lg shadow-sm">
  <div className="flex items-center justify-between p-4 border-b">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
        📊
      </div>
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Target List Summary</h2>
        <p className="text-sm text-gray-500">High Tx, event interest</p>
      </div>
    </div>
    <div className="text-right">
      <div className="text-sm text-gray-500 mb-1">Audience Size</div>
      <div className="text-2xl font-bold text-gray-800">{campaignData.audienceSize.toLocaleString()}</div>
    </div>
    <button 
      onClick={() => toggleSection('targetList')}
      className="text-blue-600 text-sm flex items-center gap-2 hover:text-blue-700"
    >
      View Target List
      {expandedSections.targetList ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </button>
  </div>

  {expandedSections.targetList && (
    <div className="p-6">
      <div className="grid grid-cols-2 gap-8">
        {/* Target Levels Chart - Modified to match image */}
        <div>
          <h3 className="text-base font-medium text-gray-700 mb-4">Target Levels</h3>
          
          {/* Chart Container with proper positioning */}
          <div className="relative">
            {/* Chart Bars */}
            <div className="flex flex-col gap-0 pl-8">
              {/* Level 1 */}
              <div className="flex items-center mb-6">
                <div className="absolute left-0 w-6 text-sm font-medium text-gray-600">1</div>
                <div className="flex-1 relative">
                  <div className="flex">
                    <div 
                      className="bg-blue-600 h-8 rounded-l-sm"
                      style={{ width: '3.3%', minWidth: '8px' }}
                    />
                    <div 
                      className="bg-green-500 h-8 rounded-r-sm"
                      style={{ width: '2.5%', minWidth: '8px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Level 2 */}
              <div className="flex items-center mb-6">
                <div className="absolute left-0 w-6 text-sm font-medium text-gray-600">2</div>
                <div className="flex-1 relative">
                  <div className="flex">
                    <div 
                      className="bg-blue-600 h-8 rounded-l-sm"
                      style={{ width: '46.7%', minWidth: '8px' }}
                    />
                    <div 
                      className="bg-green-500 h-8 rounded-r-sm"
                      style={{ width: '11.7%', minWidth: '8px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Level 3 */}
              <div className="flex items-center mb-6">
                <div className="absolute left-0 w-6 text-sm font-medium text-gray-600">3</div>
                <div className="flex-1 relative">
                  <div className="flex">
                    <div 
                      className="bg-blue-600 h-8 rounded-l-sm"
                      style={{ width: '68.3%', minWidth: '8px' }}
                    />
                    <div 
                      className="bg-green-500 h-8 rounded-r-sm"
                      style={{ width: '26.7%', minWidth: '8px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Level 4 */}
              <div className="flex items-center mb-6">
                <div className="absolute left-0 w-6 text-sm font-medium text-gray-600">4</div>
                <div className="flex-1 relative">
                  <div className="flex">
                    <div 
                      className="bg-blue-600 h-8 rounded-l-sm"
                      style={{ width: '30%', minWidth: '8px' }}
                    />
                    <div 
                      className="bg-green-500 h-8 rounded-r-sm"
                      style={{ width: '8.3%', minWidth: '8px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Level 5 */}
              <div className="flex items-center mb-6">
                <div className="absolute left-0 w-6 text-sm font-medium text-gray-600">5</div>
                <div className="flex-1 relative">
                  <div className="flex">
                    <div 
                      className="bg-blue-600 h-8 rounded-l-sm"
                      style={{ width: '10%', minWidth: '8px' }}
                    />
                    <div 
                      className="bg-green-500 h-8 rounded-r-sm"
                      style={{ width: '4.2%', minWidth: '8px' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* X-axis Scale */}
            <div className="flex justify-between mt-4 pl-8 pr-4">
              <span className="text-xs text-gray-500">0</span>
              <span className="text-xs text-gray-500">100</span>
              <span className="text-xs text-gray-500">200</span>
              <span className="text-xs text-gray-500">300</span>
              <span className="text-xs text-gray-500">400</span>
              <span className="text-xs text-gray-500">500</span>
              <span className="text-xs text-gray-500">600</span>
            </div>
          </div>

          {/* Legend - positioned at bottom right */}
          <div className="flex justify-end gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
              <span className="text-sm text-gray-600">Email</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
              <span className="text-sm text-gray-600">WhatsApp</span>
            </div>
          </div>
        </div>

        {/* Territory Map - Keep existing */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Territory Map</h3>
          <div className="relative">
            <div className="absolute top-4 left-4 bg-white rounded px-3 py-2 shadow-sm z-10">
              <div className="text-xs text-gray-600">Territories Impacted</div>
              <div className="text-lg font-semibold text-gray-800">{territoryData.territoriesImpacted}</div>
            </div>
            
            {/* Keep your existing map code here */}
            {loadingMap && !isLoaded ? (
              <div className="bg-gray-100 rounded-lg h-80 flex items-center justify-center">
                <div className="text-gray-500">Loading map...</div>
              </div>
            ) : loadError ? (
              <div className="bg-red-50 rounded-lg h-80 flex items-center justify-center">
                <div className="text-red-600">Error loading map</div>
              </div>
            ) : isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={6}
                onLoad={map => setMap(map)}
                options={mapOptions}
              >
                {/* Keep your existing map markers and info windows */}
              </GoogleMap>
            ) : (
              <div className="bg-blue-50 rounded-lg h-80 flex items-center justify-center">
                <div className="text-blue-600">Map not available</div>
              </div>
            )}

            {/* Keep your existing legend */}
            {/* <div className="absolute bottom-4 left-4 bg-white rounded px-3 py-2 shadow-sm z-10">
              <div className="text-xs text-gray-600 mb-2">Legend</div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Impacted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Not Impacted</span>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Add Campaign Details Section - Add this after the grid */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            2
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Add Campaign Details</h3>
        </div>
      </div>
    </div>
  )}
</div>


        {/* Doctor Journey Timeline Section - NEW */}
        {/* <div className="bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Doctor Journey Timeline</h2>
                <p className="text-sm text-gray-500">Interaction history and engagement</p>
              </div>
            </div>
            <button 
              onClick={() => toggleSection('doctorJourney')}
              className="text-blue-600 text-sm flex items-center gap-2 hover:text-blue-700"
            >
              View Timeline
              {expandedSections.doctorJourney ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {expandedSections.doctorJourney && (
            <div className="max-h-[800px] overflow-y-auto">
              <InteractionTimeLine interactions={doctorJourney} />
            </div>
          )}
        </div> */}

        {/* Add Campaign Details */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                <span className="text-orange-600 font-semibold">2</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Add Campaign Details</h2>
            </div>
            <button 
              onClick={() => toggleSection('addCampaign')}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {expandedSections.addCampaign ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>

          {expandedSections.addCampaign && (
            <div className="p-4">
              <div className="bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between p-3 border-b border-yellow-200">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-yellow-700" />
                    <span className="text-sm font-semibold text-gray-800">Field Messaging: Target Levels 4 and 5</span>
                    <span className="text-sm text-gray-600">210 Targets</span>
                  </div>
                  <button 
                    onClick={() => toggleSection('fieldMessaging')}
                    className="p-1 hover:bg-yellow-100 rounded"
                  >
                    {expandedSections.fieldMessaging ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>

                {expandedSections.fieldMessaging && (
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <span className="text-sm text-gray-700 font-medium">Primary Channel - Email</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-gray-700 font-medium">Secondary Channel - WhatsApp</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default InsightsPage;
