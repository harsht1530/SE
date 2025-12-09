import React, { useState } from 'react';
import { X, Mail, MessageSquare } from 'lucide-react';
import { EMAIL_TEMPLATES, WHATSAPP_TEMPLATES } from '../data/contentTemplateData';

/**
 * TemplateSelectionModal Component
 * Displays email or WhatsApp templates based on selected channel
 * User selects a template and sends to all doctors in segment
 */
const TemplateSelectionModal = ({ isOpen, onClose, topic, onSend }) => {
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  if (!isOpen || !topic) return null;

  const emailTemplates = EMAIL_TEMPLATES[topic.id] || [];
  const whatsappTemplates = WHATSAPP_TEMPLATES[topic.id] || [];

  const handleSend = () => {
    if (!selectedTemplate) return;

    onSend({
      topic,
      channel: selectedChannel,
      template: selectedTemplate,
      timestamp: new Date().toISOString()
    });

    // Reset state
    setSelectedChannel(null);
    setSelectedTemplate(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#800080]">
              {topic.icon} {topic.name}
            </h2>
            <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Channel Selection */}
        {!selectedChannel ? (
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-4 text-gray-700">
              Select Communication Channel
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email Option */}
              <button
                onClick={() => setSelectedChannel('email')}
                className="p-6 border-2 border-gray-300 rounded-lg hover:border-[#800080] hover:bg-purple-50 transition duration-300 flex items-center gap-4"
              >
                <Mail className="text-[#800080]" size={32} />
                <div className="text-left">
                  <h4 className="font-semibold text-lg text-[#800080]">Email</h4>
                  <p className="text-sm text-gray-600">Send via Email ({emailTemplates.length} templates available)</p>
                </div>
              </button>

              {/* WhatsApp Option */}
              <button
                onClick={() => setSelectedChannel('whatsapp')}
                className="p-6 border-2 border-gray-300 rounded-lg hover:border-[#800080] hover:bg-purple-50 transition duration-300 flex items-center gap-4"
              >
                <MessageSquare className="text-[#800080]" size={32} />
                <div className="text-left">
                  <h4 className="font-semibold text-lg text-[#800080]">WhatsApp</h4>
                  <p className="text-sm text-gray-600">Send via WhatsApp ({whatsappTemplates.length} templates available)</p>
                </div>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Template Selection */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => {
                    setSelectedChannel(null);
                    setSelectedTemplate(null);
                  }}
                  className="text-[#800080] hover:underline text-sm"
                >
                  ← Back to Channel Selection
                </button>
              </div>

              <h3 className="font-semibold text-lg mb-4 text-gray-700">
                Select a {selectedChannel === 'email' ? 'Email' : 'WhatsApp'} Template
              </h3>

              <div className="space-y-4">
                {selectedChannel === 'email'
                  ? emailTemplates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition duration-300 ${
                        selectedTemplate?.id === template.id
                          ? 'border-[#800080] bg-purple-50'
                          : 'border-gray-300 hover:border-[#800080]'
                      }`}
                    >
                      <h4 className="font-semibold text-[#800080] mb-2">
                        {template.subject}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {template.body}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {selectedTemplate?.id === template.id && '✓ Selected'}
                      </p>
                    </div>
                  ))
                  : whatsappTemplates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition duration-300 ${
                        selectedTemplate?.id === template.id
                          ? 'border-[#800080] bg-purple-50'
                          : 'border-gray-300 hover:border-[#800080]'
                      }`}
                    >
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {template.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {selectedTemplate?.id === template.id && '✓ Selected'}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Preview Section (if template selected) */}
            {selectedTemplate && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-2">Preview:</h4>
                {selectedChannel === 'email' ? (
                  <div className="text-sm">
                    <p className="font-semibold text-gray-700">
                      Subject: {selectedTemplate.subject}
                    </p>
                    <p className="text-gray-600 mt-2 whitespace-pre-wrap">
                      {selectedTemplate.body}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {selectedTemplate.message}
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          {selectedTemplate && (
            <button
              onClick={handleSend}
              className="px-6 py-2 bg-[#800080] text-white rounded-lg hover:bg-[#600060] transition duration-300"
            >
              Send to All
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateSelectionModal;