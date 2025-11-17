import React,{useState} from 'react'
import { MdDriveFileRenameOutline } from "react-icons/md";
import { IoMdPersonAdd } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
const GroupActionsModal = ({
    isOpen, onClose, group, onRename, onDelete, onAddExperts
}) => {
    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState(group?.name || "");

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 w-[300px]">
                {isRenaming ? (
                    <div className="mb-4">
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Enter new name"
                        />
                        <div className="flex justify-end gap-2 mt-2">
                            <button
                                onClick={() => setIsRenaming(false)}
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    onRename(newName);
                                    setIsRenaming(false);
                                }}
                                className="px-3 py-1 bg-[#800080] text-white rounded"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => setIsRenaming(true)}
                            className="w-full flex items-center justify-start p-2 text-left gap-2 hover:bg-gray-100 rounded"
                        >
                            <MdDriveFileRenameOutline size={20}/> Rename List
                        </button>
                        <button
                            onClick={onAddExperts}
                            className="w-full text-left p-2 hover:bg-gray-100 rounded flex items-center justify-start gap-2"
                        >
                            <IoMdPersonAdd size={20}/>
                            Add Experts
                        </button>
                        <button
                            onClick={onDelete}
                            className="w-full text-left p-2 text-red-600 hover:bg-red-50 rounded
                            flex items-center justify-start gap-2 hover:text-red-700"
                        >
                            <MdDeleteOutline size={20}/>
                            Delete List
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full text-center p-2 text-gray-600 hover:bg-gray-100 rounded mt-2"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GroupActionsModal