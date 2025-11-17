import React from 'react';

const DualRangeSlider = ({ yearRange, setYearRange, marks }) => {
  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    const index = e.target.dataset.index === "0" ? 0 : 1;
    
    // Create a copy of the current range
    const newRange = [...yearRange];

    if (index === 0) {
      // Updating min value (left thumb)
      // Ensure it doesn't go beyond the max value
      newRange[0] = Math.min(value, newRange[1]);
    } else {
      // Updating max value (right thumb)
      // Ensure it doesn't go below the min value
      newRange[1] = Math.max(value, newRange[0]);
    }

    setYearRange(newRange);
  };

  return (
    <div className="my-6 px-4 relative">
      <div className="h-2 bg-gray-200 rounded-full">
        <div 
          className="absolute h-2 bg-blue-500 rounded-full"
          style={{
            left: `${(yearRange[0] / 140) * 100}%`,
            right: `${100 - (yearRange[1] / 140) * 100}%`
          }}
        ></div>
      </div>
      
      {/* Min thumb */}
      <input
        type="range"
        min="0"
        max="140"
        value={yearRange[0]}
        data-index="0"
        onChange={handleChange}
        className="absolute top-0 left-0 w-full h-2 appearance-none bg-transparent pointer-events-none"
        style={{
          // Make only the thumb visible and clickable
          WebkitAppearance: 'none',
          zIndex: 3
        }}
      />
      
      {/* Max thumb */}
      <input
        type="range"
        min="0"
        max="140"
        value={yearRange[1]}
        data-index="1"
        onChange={handleChange}
        className="absolute top-0 left-0 w-full h-2 appearance-none bg-transparent pointer-events-none"
        style={{
          // Make only the thumb visible and clickable
          WebkitAppearance: 'none',
          zIndex: 4
        }}
      />
      
      {/* Marks */}
      <div className="relative h-6 mt-4">
        {marks.map((mark) => (
          <div 
            key={mark.value}
            className="absolute text-xs text-gray-600"
            style={{ left: `${(mark.value / 140) * 100}%`, transform: 'translateX(-50%)' }}
          >
            {mark.label}
          </div>
        ))}
      </div>
      
      <div className="flex justify-between mt-10">
        <span>Older</span>
        <span>Newer</span>
      </div>
    </div>
  );
};

export default DualRangeSlider;
