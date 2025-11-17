import React, { memo } from "react";

const TabNavigation = memo(({ tabs, activeTab, onTabChange }) => {

  const getTourClassName = (tabName) => {
  switch (tabName.toLowerCase()) {
    case 'overview':
      return 'tour-overview-tab';
    case 'scientific':
      return 'tour-scientific-tab';
    case 'digital':
      return 'tour-digital-tab';
    case 'collaborators':
      return 'tour-collaborator-tab';
    default:
      return '';
  }
};

  return (
    <div className="flex space-x-6 mx-2 md:mx-10 lg:mx-10 py-2 overflow-x-scroll md:overflow-x-hidden lg:overflow-x-hidden" role="tablist">
      {tabs.map((tab, index) => (
        <button
          key={index}
          role="tab"
          aria-selected={activeTab === index}
          onClick={() => onTabChange(index)}
          className={`cursor-pointer pb-2 ${getTourClassName(tab)} ${
            activeTab === index
              ? "text-[#800080] border-b-2 border-[#800080] font-semibold"
              : "text-gray-600"
          }`}
          data-tour={tab.toLowerCase()}
        >
          {tab}
        </button>
      ))}
    </div>
  );
});

export default TabNavigation;