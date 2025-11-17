import React, { useState } from 'react';
// import { favoritesApi } from "../services/api" // Assuming this is used elsewhere if needed

const CreateGroupModal = ({ isOpen, onClose, selectedProfiles, onCreateGroup, groupNames }) => {
    const [groupName, setGroupName] = useState('');

    if (!isOpen) {
        return null;
    }

    // Modified handleSubmit to accept an optional 'valueToSubmit'
    const handleSubmit = async (e, valueToSubmit = null) => {
        // Prevent default form submission only if 'e' is a real event object
        // (i.e., when triggered by the button click, not from the select onChange)
        if (e && e.preventDefault) {
            e.preventDefault();
        }

        const finalGroupName = valueToSubmit !== null ? valueToSubmit : groupName;

        if (finalGroupName.trim()) { // Ensure group name is not empty or just whitespace
            onCreateGroup({
                name: finalGroupName,
                doctors: selectedProfiles,
                id: Date.now() // Consider using a more robust ID like uuidv4() for production
            });
            setGroupName(''); // Clear input after submission
            onClose(); // Close the modal
        } else {
            // Optional: Provide user feedback if groupName is empty
            console.warn("Group name cannot be empty.");
            // You might want to show a toast message here
        }
    }

    const handleCancel = () => {
        // If onCreateGroup is meant to signal a cancellation, keep onCreateGroup(null);
        // Otherwise, if it's strictly for creating/selecting, just call onClose();
        onCreateGroup(null); // Passing null to indicate cancellation or no selection
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"> {/* Corrected opacity class */}
            <div className="bg-white rounded-lg p-6 w-96">
                <h2 className="text-xl font-semibold mb-4">
                    Create New Group
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4 w-full max-w-md"> {/* Changed to flex-col for better stacking on small screens */}
                        <input
                            type="text"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="Enter the Group Name"
                            // Corrected className syntax and combined classes
                            className="w-full p-2 border border-gray-300 rounded focus:border-[#800080] mb-4"
                        />
                        {groupNames && groupNames.length > 0 && (
                            <> {/* Use a React Fragment to wrap sibling elements */}
                                {/* Optional: Add a label for accessibility */}
                                <label htmlFor="existing-group-select" className="block text-sm font-medium text-gray-700 sr-only">
                                    Select an existing group
                                </label>
                                <select
                                    id="existing-group-select" // Added ID for label association
                                    value={groupName}
                                    onChange={(e) => {
                                        const selectedValue = e.target.value;
                                        setGroupName(selectedValue); // Update state
                                        // Auto-submit if a valid group is selected from the dropdown
                                        if (selectedValue !== "") {
                                            handleSubmit(null, selectedValue); // Pass null for event, and the selected value
                                        }
                                    }}
                                    // Corrected className attribute and combined classes
                                    className="w-full p-2 border border-gray-300 rounded text-gray-700 bg-white"
                                >
                                    <option value="">-- Or select an existing group --</option>
                                    {groupNames.map((name, index) => (
                                        // Corrected className for option, though often not needed for options directly
                                        <option key={index} value={name}>{name}</option>
                                    ))}
                                </select>
                            </>
                        )}
                    </div>
                    <div className='flex justify-start gap-2 mt-[1.5rem]'>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#800080] text-white rounded hover:bg-[#600060]"
                        >
                            {/* Dynamic button text based on whether a new name is entered or existing is selected */}
                            {groupName.trim() && groupNames.includes(groupName) ? "Select Group" : "Create Group"}
                        </button>
                    </div>
                </form >
            </div >
        </div >
    )
}

export default CreateGroupModal;