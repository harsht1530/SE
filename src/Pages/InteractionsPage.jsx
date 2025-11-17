// InteractionsPage.jsx
import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { FaEnvelope, FaCommentDots, FaStethoscope } from 'react-icons/fa';
import PropTypes from 'prop-types';

// Doctor Journey Timeline Data
const defaultDoctorJourney = [
  {
    id: 1,
    title: "Email Introduction",
    description: "Oncology product information sent",
    date: new Date(2025, 8, 15),
    time: "9:30 AM",
    type: "email",
    channel: "Email",
    status: "completed",
    participant: "Dr. Priya Tiwari",
    specialty: "Medical Oncology"
  },
  {
    id: 2,
    title: "WhatsApp Follow-up",
    description: "Cancer treatment protocol shared",
    date: new Date(2025, 8, 18),
    time: "2:15 PM",
    type: "whatsapp",
    channel: "WhatsApp",
    status: "completed",
    participant: "Dr. Priya Tiwari",
    specialty: "Medical Oncology"
  },
  {
    id: 3,
    title: "SMS Reminder",
    description: "Clinical trial invitation",
    date: new Date(2025, 8, 22),
    time: "4:30 PM",
    type: "sms",
    channel: "SMS",
    status: "completed",
    participant: "Dr. Priya Tiwari",
    specialty: "Medical Oncology"
  },
  {
    id: 4,
    title: "Email Follow-up",
    description: "Patient outcome study results",
    date: new Date(2025, 8, 25),
    time: "1:45 PM",
    type: "email",
    channel: "Email",
    status: "completed",
    participant: "Dr. Priya Tiwari",
    specialty: "Medical Oncology"
  },
  {
    id: 5,
    title: "WhatsApp Group",
    description: "Oncology team discussion",
    date: new Date(2025, 8, 28),
    time: "7:20 PM",
    type: "whatsapp",
    channel: "WhatsApp",
    status: "completed",
    participant: "Artemis Oncology Team",
    specialty: "Medical Oncology"
  },
  {
    id: 6,
    title: "SMS Update",
    description: "New therapy guidelines notification",
    date: new Date(2025, 9, 2),
    time: "11:15 AM",
    type: "sms",
    channel: "SMS",
    status: "completed",
    participant: "Dr. Priya Tiwari",
    specialty: "Medical Oncology"
  },
  {
    id: 7,
    title: "Email Conference Invite",
    description: "Medical conference invitation sent",
    date: new Date(2025, 9, 5),
    time: "10:00 AM",
    type: "email",
    channel: "Email",
    status: "completed",
    participant: "Dr. Priya Tiwari",
    specialty: "Medical Oncology"
  },
  {
    id: 8,
    title: "WhatsApp Check-in",
    description: "Follow-up on conference participation",
    date: new Date(2025, 9, 7),
    time: "3:30 PM",
    type: "whatsapp",
    channel: "WhatsApp",
    status: "completed",
    participant: "Dr. Priya Tiwari",
    specialty: "Medical Oncology"
  }
];

// Helper Functions
const formatDateHeader = (date) => {
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

const formatDateLabel = (date) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[date.getMonth()]} ${date.getDate()}`;
};

const getChannelIcon = (type) => {
  switch (type) {
    case 'email':
      return <FaEnvelope className="text-[#800080] text-sm" />;
    case 'whatsapp':
      return <FaCommentDots className="text-[#800080] text-sm" />;
    case 'sms':
      return <FaCommentDots className="text-[#800080] text-sm" />;
    default:
      return <FaStethoscope className="text-[#800080] text-sm" />;
  }
};

const getChannelColor = (type) => {
  const colors = {
    email: 'bg-blue-50 border-blue-200',
    whatsapp: 'bg-green-50 border-green-200',
    sms: 'bg-yellow-50 border-yellow-200'
  };
  return colors[type] || 'bg-gray-50 border-gray-200';
};

// Main Timeline Component
const InteractionTimeLine = ({ 
  interactions = defaultDoctorJourney,
  title = "Doctor Journey Timeline" 
}) => {
  if (!interactions || interactions.length === 0) {
    return (
      <div className="w-full bg-gray-50 min-h-screen">
        <div className="py-8 text-center text-gray-500">No interactions to display</div>
      </div>
    );
  }

  // Sort interactions by date (newest first)
  const sortedInteractions = [...interactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Group interactions by month/year
  const groupedInteractions = sortedInteractions.reduce((acc, interaction) => {
    const monthYear = formatDateHeader(interaction.date);
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(interaction);
    return acc;
  }, {});

  // Count interactions by type for summary
  const getChannelCounts = (interactions) => {
    return interactions.reduce((acc, interaction) => {
      acc[interaction.type] = (acc[interaction.type] || 0) + 1;
      return acc;
    }, {});
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen overflow-y-auto pb-32">
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
              <p className="text-gray-600">Interaction history and engagement timeline</p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="max-w-4xl mx-auto p-6">
        {Object.entries(groupedInteractions).map(([monthYear, monthInteractions]) => {
          const channelCounts = getChannelCounts(monthInteractions);
          
          return (
            <div key={monthYear} className="mb-8">
              {/* Month Header */}
              <div className="mb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="flex items-center text-[#800080] font-semibold text-lg">
                    <Clock className="w-5 h-5 mr-2" />
                    {monthYear}
                  </div>
                </div>
                
                {/* Summary Cards */}
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

              {/* Timeline */}
              <div className="relative">
                {/* Vertical timeline line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-[#800080] opacity-30"></div>
                
                {/* Timeline items */}
                {monthInteractions.map((interaction, index) => (
                  <div key={interaction.id} className="relative mb-8">
                    {/* Timeline dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                      <div className={`w-4 h-4 bg-[#800080] rounded-full shadow-md ${
                        interaction.status === 'scheduled' ? 'animate-pulse' : ''
                      }`}></div>
                    </div>
                    
                    {/* Date label */}
                    <div className="flex justify-center mb-4">
                      <div className="bg-[#800080] text-white px-4 py-2 rounded-full text-sm font-medium">
                        {formatDateLabel(interaction.date)}
                      </div>
                    </div>
                    
                    {/* Interaction card - alternating left/right */}
                    <div className={`flex ${index % 2 === 0 ? 'justify-end pr-12' : 'justify-start pl-12'}`}>
                      <div className={`bg-white rounded-lg shadow-md p-6 w-full max-w-md border-l-4 ${getChannelColor(interaction.type)}`}>
                        {/* Header */}
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
                        
                        {/* Content */}
                        <h3 className="font-semibold text-gray-800 text-base mb-2 leading-tight">
                          {interaction.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                          {interaction.description}
                        </p>
                        
                        {/* Details */}
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
      </div>

      {/* Fixed Stats summary at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-6 shadow-lg z-20">
        <div className="max-w-4xl mx-auto">
          <h3 className="font-semibold text-[#800080] text-lg mb-4 text-center">Interaction Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <span className="text-gray-600 block">Total Interactions</span>
              <span className="font-bold text-2xl text-[#800080]">{interactions.length}</span>
            </div>
            <div className="text-center">
              <span className="text-gray-600 block">Last Contact</span>
              <span className="font-semibold text-lg">1 day ago</span>
            </div>
            <div className="text-center">
              <span className="text-gray-600 block">Email Messages</span>
              <span className="font-bold text-2xl text-blue-600">
                {interactions.filter(i => i.type === 'email').length}
              </span>
            </div>
            <div className="text-center">
              <span className="text-gray-600 block">WhatsApp + SMS</span>
              <span className="font-bold text-2xl text-green-600">
                {interactions.filter(i => ['whatsapp', 'sms'].includes(i.type)).length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// PropTypes
InteractionTimeLine.propTypes = {
  interactions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    date: PropTypes.instanceOf(Date).isRequired,
    time: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['email', 'whatsapp', 'sms']).isRequired,
    channel: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['completed', 'scheduled']).isRequired,
    participant: PropTypes.string.isRequired,
    specialty: PropTypes.string
  })),
  title: PropTypes.string
};

// Main InteractionsPage Component
const InteractionsPage = ({ interactions, title }) => {
  return (
    <div className="min-h-screen">
      <InteractionTimeLine interactions={interactions} title={title} />
    </div>
  );
};

InteractionsPage.propTypes = {
  interactions: PropTypes.array,
  title: PropTypes.string
};

export default InteractionsPage;
