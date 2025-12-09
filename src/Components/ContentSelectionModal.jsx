import React from 'react';
import { X } from 'lucide-react';
import { TOPICS } from '../data/contentTemplateData';

/**
 * ContentSelectionModal Component
 * Displays available topics for content selection
 * User selects one topic to proceed to template selection
 */
const ContentSelectionModal = ({ isOpen, onClose, onSelectTopic }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#800080]">Select Content Topic</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => onSelectTopic(topic)}
              className="p-4 border-2 border-gray-300 rounded-lg hover:border-[#800080] hover:bg-purple-50 transition duration-300 text-left group"
            >
              <div className="text-3xl mb-2">{topic.icon}</div>
              <h3 className="font-semibold text-[#800080] group-hover:underline mb-2">
                {topic.name}
              </h3>
              <p className="text-sm text-gray-600">{topic.description}</p>
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                {topic.details}
              </p>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentSelectionModal;
