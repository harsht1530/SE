
import React, { useState, useCallback, useEffect } from 'react'
import Header from '../Components/Header'
import { MdStarBorder } from "react-icons/md";
import { removeFavorites } from '../utils/favoriteSlice';
import { addGroup } from '../utils/groupsSlice'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom";
import { FixedSizeList as List } from 'react-window';
import { MdAdd } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { renameGroup, deleteGroup, addExpertsToGroup, updateGroupDoctors }
  from "../utils/groupsSlice"
import { FaRegStar } from "react-icons/fa";
import { favoritesApi } from "../services/api"
import GroupActionsModal from '../Components/GroupActionsModal';
import CreateGroupModal from '../Components/CreateGroupModal';
import ContentSelectionModal from '../Components/ContentSelectionModal';
import TemplateSelectionModal from '../Components/TemplateSelectionModal';
import { getAssetPath } from '../utils/imageUtils';
import CryptoJS from 'crypto-js';
import { Mail, MessageSquare, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { FaWindowRestore } from 'react-icons/fa6';
import { FaUsers } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi"; // Add this import for the three-dot menu icon
import { TiThMenuOutline } from 'react-icons/ti';
/**
 * @component FavouritesPage
 * @description Manages favorite doctors and doctor groups with features for organizing,
 * selecting, and managing healthcare professional profiles. Includes group creation,
 * editing, and profile management capabilities.
 * 
 * @state
 * - selectedProfiles {Array<Doctor>} - Currently selected doctor profiles
 * - selectAll {boolean} - Toggle for selecting all profiles
 * - isModalOpen {boolean} - Controls group creation modal visibility
 * - selectedGroup {Object|null} - Currently selected doctor group
 * - selectedGroupDoctors {Array<Doctor>} - Selected doctors within a group
 * - isGroupActionOpen {boolean} - Controls group actions modal visibility
 * - activeGroup {Object|null} - Group being currently modified
 * 
 * @redux
 * - favorites.doctors {Array<Doctor>} - List of favorite doctor profiles
 * - groups.doctorGroups {Array<Group>} - List of doctor groups
 * 
 * @actions
 * - removeFavorites: Removes doctors from favorites
 * - addGroup: Creates new doctor group
 * - renameGroup: Updates group name
 * - deleteGroup: Removes doctor group
 * - updateGroupDoctors: Updates doctors in a group
 * 
 * @subcomponents
 * - Header: Navigation header
 * - GroupActionsModal: Props: {
 *     isOpen: boolean,
 *     onClose: Function,
 *     group: Object,
 *     onRename: Function,
 *     onDelete: Function,
 *     onAddExperts: Function
 *   }
 * - CreateGroupModal: Props: {
 *     isOpen: boolean,
 *     onClose: Function,
 *     selectedProfiles: Array,
 *     onCreateGroup: Function
 *   }
 * 
 * @virtualizedList
 * - ProfileItem: Virtualized list item component for efficient rendering
 * - List height: 500px
 * - Item size: 100px
 * 
 * @layout
 * - Grid layout: 12 columns (3:9 split)
 * - Left sidebar: Groups management
 * - Main content: Favorite doctors list
 * 
 * @example
 * <FavouritesPage />
 * 
 * @returns {JSX.Element} A page for managing favorite doctors and groups
 */
const FavouritesPage = () => {

  const navigate = useNavigate()
  const location = useLocation();
  const dispatch = useDispatch()
  const recordIdSecret = import.meta.env.VITE_RECORDID_SECRET
  const [selectedProfiles, setSelectedProfiles] = useState(location.state?.selectedDoctors || [])
  const [selectAll, setSelectAll] = useState(false);
  const [groups, setGroups] = useState([])

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedGroupDoctors, setSelectedGroupDoctors] = useState([]);
  const [isAddMode, setIsAddMode] = useState(false);
  const [profileItemGroupDoctors, setProfileItemGroupDoctors] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const [isGroupDoctorsLoading, setIsGroupDoctorsLoading] = useState(false);
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(true);
  const [isGroupActionOpen, setIsGroupActionOpen] = useState(false)
  const [activeGroup, setActiveGroup] = useState(null);
  const [profiles, setProfiles] = useState(null);

  const [selectedNumber, setSelectedNumber] = useState(null)
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false)

  // Content Selection Modal States
  const [isContentSelectionOpen, setIsContentSelectionOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isTemplateSelectionOpen, setIsTemplateSelectionOpen] = useState(false);

  // const profiles = useSelector((state) => state.favorites.doctors)

  useEffect(() => {
    const fetchFavorites = async () => {
      setIsFavoritesLoading(true);
      try {
        const response = await favoritesApi.getFavorites();
        console.log("favorite profiles ", response.data)
        setProfiles(response.data);
      } catch (e) {
        console.log("error in the useEffect of the getting favorites api", e);
      } finally {
        setIsFavoritesLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await favoritesApi.getGroups();
        console.log("groups ", response.data);
        setGroups(response.data);
      } catch (e) {
        console.log("error in the useEffect of the getting groups api", e);
      }
    };
    fetchGroups();
  }, [groups[groups.length]])



  const [isModalOpen, setIsModalOpen] = useState(location.state?.showCreateGroup || false);
  console.log("favorite inside favorite component ", profiles)

  // this is used for getting the groups from the redux store
  // const groups = useSelector(state => state.groups.doctorGroups)

  const handleProfileSelect = (profile) => {
    console.log("Profile selected/deselected:", profile.Full_Name, "Total selected:", selectedProfiles.length + 1);
    setSelectedProfiles((prev) => {
      if (prev.some((p) => p.Record_Id === profile.Record_Id)) {
        console.log("Removing profile from selection");
        return [...prev.filter((p) => p.Record_Id !== profile.Record_Id)]
      }
      else {
        console.log("Adding profile to selection");
        return [...prev, profile];
      }
    })
  }

  const handleProfileClick = useCallback(

    (recordId) => {
      console.log("inside the handle profile click", recordId)
      const encryptedRecordId = CryptoJS.AES.encrypt(recordId, recordIdSecret).toString()
      const encodedProfileId = encodeURIComponent(encryptedRecordId);
      navigate(`/profile/${encodedProfileId}`);
    },
    [navigate]
  );

  const handleRemoveFromFavorites = async () => {
    const toastId = toast.loading("Removing from favorites...")
    try {
      console.log("selected profiles before removing ", selectedProfiles);
      const selectedIds = selectedProfiles.map(profile => profile.Record_Id);

      await favoritesApi.removeFavorites(selectedIds);


      setProfiles(prev =>
        prev.filter(profile => !selectedIds.includes(profile.Record_Id))
      );

      setSelectedProfiles(prev =>
        prev.filter(p => !selectedIds.includes(p.Record_Id))
      );

      setSelectAll(false);
      toast.update(toastId, {
        render: `${selectedIds.length} doctor(s) removed from favorites`,
        type: "success",
        isLoading: false,
        autoClose: 1000,
      });
    } catch (error) {
      console.log(error);
      toast.update(toastId, {
        render: "Failed to remove from favorites",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  // Content Selection Handlers
  const handleSelectContentClick = () => {
    // Check which selection array to use based on context
    const doctorsToSend = selectedGroup ? selectedGroupDoctors : selectedProfiles;
    
    console.log("Select Content clicked! Doctors count:", doctorsToSend.length, "selectedGroup:", !!selectedGroup);
    if (doctorsToSend.length === 0) {
      toast.error("Please select at least one doctor to send content", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    console.log("Opening content selection modal...");
    setIsContentSelectionOpen(true);
  };

  const handleTopicSelect = (topic) => {
    console.log("Topic selected:", topic.name);
    setSelectedTopic(topic);
    setIsContentSelectionOpen(false);
    setIsTemplateSelectionOpen(true);
  };

  const handleSendContent = async (data) => {
    const doctorsToSend = selectedGroup ? selectedGroupDoctors : selectedProfiles;
    console.log("Send content clicked for:", data.topic.name, data.channel, "Doctors:", doctorsToSend.length);
    const toastId = toast.loading(`Sending ${data.channel} to ${doctorsToSend.length} doctors...`);
    
    try {
      // Here you would call your API
      // For now, just simulating the send
      const selectedIds = doctorsToSend.map(profile => profile.Record_Id);
      
      // Hardcoded send logic - replace with API call later
      const payload = {
        doctorIds: selectedIds,
        topic: data.topic,
        channel: data.channel,
        templateId: data.template.id,
        sentAt: data.timestamp
      };

      console.log("Sending content:", payload);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Success
      toast.update(toastId, {
        render: `Content sent successfully via ${data.channel} to ${selectedIds.length} doctor(s)`,
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      // Reset states
      setSelectedTopic(null);
      setIsTemplateSelectionOpen(false);
      
      // Clear selections based on context
      if (selectedGroup) {
        setSelectedGroupDoctors([]);
      } else {
        setSelectedProfiles([]);
        setSelectAll(false);
      }

    } catch (error) {
      console.error("Error sending content:", error);
      toast.update(toastId, {
        render: "Failed to send content. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  const handleCloseTemplateModal = () => {
    setIsTemplateSelectionOpen(false);
    setSelectedTopic(null);
  };

  const handleCloseContentModal = () => {
    setIsContentSelectionOpen(false);
  };

  const handleContentModalTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setIsContentSelectionOpen(false);
    setIsTemplateSelectionOpen(true);
  };

  const handleCreateGroup = async (newGroup) => {
    const toastId = toast.loading("Creating Group...")
    try {
      // if (newGroup) {
      //   dispatch(addGroup(newGroup))
      // }
      await favoritesApi.createGroup(
        newGroup.name, selectedProfiles.map((p) => p.Record_Id)
      )

      setGroups(prevGroups => {
        const newGroupName = newGroup.name;
        if (!prevGroups.includes(newGroupName)) {

          return [...prevGroups, newGroupName]
        }
        return prevGroups;

      })
      setSelectedProfiles([])
      setSelectAll(false);
      setIsModalOpen(false);

      toast.update(toastId, {
        render: `Segment ${newGroup.name} created successfully`,
        type: "success",
        isLoading: false,
        autoClose: 1000
      })
    } catch (e) {
      toast.update(toastId, {
        render: "Failed to create segment",
        type: "error",
        isLoading: false,
        autoClose: 2000
      })
      console.log("error in the create group ", e)
    }

  }

  useEffect(() => {
    if (location.state?.showCreateGroup) {
      window.history.replaceState({}, document.title);
    }
  }, [])

  // const handleRemoveFromGroup = () => {
  //   if (!selectedGroup || selectedGroupDoctors.length == 0) {
  //     return null;
  //   }
  //   // const updatedDoctors = selectedGroup.doctors.filter(
  //   //   (doctor) => !selectedGroupDoctors.some(
  //   //     (selected) => selected.Record_Id === doctor.Record_Id
  //   //   )
  //   // )
  //   const selectedIds = selectedGroupDoctors.map(doc => doc.Record_Id)
  //   const updatedDoctors = selectedGroup.doctors.filter(
  //     (doctor) => !selectedGroupDoctors.some(
  //       (selected) => selected.Record_Id === doctor.Record_Id
  //     )
  //   )

  //   // await favoritesApi.removeGroupDoctors()
  //   dispatch(updateGroupDoctors({
  //     groupId: selectedGroup.id,
  //     doctors: updatedDoctors
  //   }))
  //   setSelectedGroup(prev=>({
  //     ...prev,
  //     doctors:updatedDoctors
  //   }))
  //   setSelectedGroupDoctors([])
  // }
  console.log("selected group doctors ---------", selectedGroup)
  const handleRemoveFromGroup = async () => {
    if (!selectedGroup || selectedGroupDoctors.length === 0) {
      return;
    }

    const selectedIds = selectedGroupDoctors.map(doc => doc.Record_Id);
    const toastId = toast.loading("removing from group...")

    try {
      // 1️⃣ Call your backend
      const response = await favoritesApi.removeGroupDoctors(
        selectedGroup,  // or .name if your backend expects name
        selectedIds
      );

      toast.update(toastId, {
        render: `${selectedIds.length} removed from group successfully`,
        type: "success",
        isLoading: false,
        autoClose: 1000
      })

      // 2️⃣ Update profileItemGroupDoctors by filtering out removed doctors
      const updatedDoctors = profileItemGroupDoctors.filter(
        doc => !selectedIds.includes(doc.Record_Id)
      );

      if (!updatedDoctors?.length > 0) {
        setProfileItemGroupDoctors([])
        setGroups(prev => prev != selectedGroup)
        setSelectedGroup(null)
      }

      setProfileItemGroupDoctors(updatedDoctors);
      setSelectedGroupDoctors([])


      // 3️⃣ Update selectedGroup.doctors too (optional if you use both)
      // setSelectedGroup(prev => ({
      //   ...prev,
      //   doctors: updatedDoctors
      // }));

      // setSelectedGroupDoctors([]);

      // 4️⃣ Optionally update Redux
      // dispatch(updateGroupDoctors({
      //   groupId: selectedGroup.id,
      //   doctors: updatedDoctors
      // }));

    } catch (error) {
      toast.update(toastId, {
        render: "Failed to remove from group",
        type: "error",
        isLoading: false,
        autoClose: 2000,

      })
      console.error("Error removing doctors from group:", error);
    }
  };


  const handleSelectAll = useCallback(() => {
    if (selectAll) {
      setSelectedProfiles([])
    }
    else {
      setSelectedProfiles([...profiles])
    }
    setSelectAll(!selectAll)
  }, [selectAll, profiles])

  const handleSelectAllGroupDoctors = () => {
    if (profileItemGroupDoctors && selectedGroupDoctors.length === profileItemGroupDoctors.length) {
      setSelectedGroupDoctors([])
    } else {
      setSelectedGroupDoctors([...profileItemGroupDoctors])
    }
  }

  const handleWhatsAppClick = (number) => {
    setSelectedNumber(number)
    setIsWhatsAppModalOpen(true)

  }

  const handleSetWhatsAppModalOpen = () => {
    const message = encodeURIComponent("Hello doctor, This is a test message")
    window.open(`https://wa.me/${selectedNumber}?text=${message}`, '_blank');
    setIsModalOpen(false)
  }




  const ProfileItem = ({ index, style }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNumber, setSelectedNumber] = useState(null);

    const list = selectedGroup ? profileItemGroupDoctors : profiles;
    const profile = list[index];
    const selected = selectedGroup
      ? selectedGroupDoctors.some((p) => p.Record_Id === profile.Record_Id)
      : selectedProfiles.some((p) => p.Record_Id === profile.Record_Id);

    const handleSelect = () => {
      if (selectedGroup) {
        setSelectedGroupDoctors((prev) => {
          if (prev.some((p) => p.Record_Id === profile.Record_Id)) {
            return prev.filter((p) => p.Record_Id !== profile.Record_Id);
          }
          return [...prev, profile];
        });
      } else {
        handleProfileSelect(profile);
      }
    };

    // 🔹 When WhatsApp icon is clicked
    const handleWhatsAppClick = (number) => {
      setSelectedNumber(number);
      setIsModalOpen(true);
    };

    // 🔹 When user confirms to send
    const handleSendWhatsApp = () => {
      const message = encodeURIComponent("Hello Doctor, this is a test message.");
      window.open(`https://wa.me/${selectedNumber}?text=${message}`, "_blank");
      setIsModalOpen(false);
    };

    const medicalTemplates = [
      {
        id: 1,
        title: "Template 1: Research Breakthrough Announcement",
        message: `🔬 BREAKTHROUGH CLINICAL RESULTS 🔬
New international study proves clotrimazole 1% otic solution is highly effective for treating ear fungal infections!
✅ 68.2% cure rate vs 25.4% placebo
✅ Minimal side effects (2.7%)
✅ First proven treatment for otomycosis
Published by Canadian Society of Otolaryngology - Head & Neck Surgery
📞 Consult our ENT specialists today!`
      },
      {
        id: 2,
        title: "Template 2: Patient Education Post",
        message: `👨‍⚕️ IMPORTANT MEDICAL UPDATE 👨‍⚕️
Suffering from persistent ear infections?
New clinical trials involving 393 patients across multiple countries show that clotrimazole 1% ear drops provide:
Superior therapeutic cure rates
Safe treatment with minimal adverse events
Effective fungal eradication
Contact us to learn if this treatment is right for you!`
      },
      {
        id: 3,
        title: "Template 3: Healthcare Professional Update",
        message: `🏥 CLINICAL EVIDENCE ALERT 🏥
POOLED ANALYSIS RESULTS:
261 patients treated with clotrimazole
132 patients received placebo
Study period: Feb 2020 - Oct 2021
Key Findings:
✓ Statistically significant superior efficacy
✓ Well-tolerated treatment profile
✓ First international multicenter trials for otomycosis`
      }
    ];

    return (
      <>
        <div style={style} className="border-b border-gray-200 last:border-b-0">
          <div className="flex items-center gap-2 p-5">
            <input
              type="checkbox"
              className="w-4 h-4 rounded-md mr-2 accent-fuchsia-700"
              checked={selected}
              onChange={handleSelect}
            />
            <img
              src={
                profile["Profile_Pic_Link"] && profile["Profile_Pic_Link"] !== "NaN"
                  ? profile["Profile_Pic_Link"]
                  : getAssetPath("profileImg1.png")
              }
              alt="profile"
              className="w-15 h-15 rounded-full"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-8">
                <p
                  onClick={() => handleProfileClick(profile.Record_Id)}
                  className="text-[#800080] font-semibold text-lg hover:underline cursor-pointer"
                >
                  {profile.Full_Name},{" "}
                  {profile["Degree_1"] !== "NaN" && profile["Degree_1"]}{" "}
                  {profile["Degree_2"] !== "NaN" && profile["Degree_2"]}{" "}
                  {profile["Degree_3"] !== "NaN" && profile["Degree_3"]}
                </p>

                {/* 📱 Social Icons */}
                <div className="flex items-center gap-3">
                  {/* ✅ WhatsApp */}
                  {(
                    <button
                      onClick={() => handleWhatsAppClick(profile.Phone)}
                      className="text-green-600 hover:scale-110 transition-transform"
                      title="WhatsApp"
                    >
                      <FaWhatsapp size={20} />
                    </button>
                  )}

                  {/* SMS */}
                  { (
                    <a
                      href={`sms:${profile.Phone}`}
                      className="text-blue-600 hover:scale-110 transition-transform"
                      title="Send SMS"
                    >
                      <MessageSquare size={20} />
                    </a>
                  )}

                  {/* Email */}
                  { (
                    <a
                      href={`mailto:${profile.Email}`}
                      className="text-rose-600 hover:scale-110 transition-transform"
                      title="Send Email"
                    >
                      <Mail size={20} />
                    </a>
                  )}
                </div>
              </div>

              <p className="text-md">
                {profile.Clinic_Name_1 !== "NaN" && profile.Clinic_Name_1}
              </p>
              <p className="text-sm">{profile["HCP_Speciality_1"]}</p>
            </div>
          </div>
        </div>

        {/* 🟢 WhatsApp Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-start justify-center bg-black/50 backdrop-blur-sm z-50" onClick={() => {
            setIsModalOpen(false); // Close the modal on backdrop click
            setSelectedTemplate(null);
          }}>
            <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-2xl w-[95%] mt-10 animate-fade-in max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
                Send WhatsApp Message
              </h2>

              {/* Template Selection Section */}
              <div className="mb-6 flex-1 overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                <p className="mb-3 text-gray-700 font-medium">Select a message template:</p>
                <div className="flex-1 overflow-y-auto border rounded-lg bg-gray-50" onClick={e => e.stopPropagation()}>
                  {medicalTemplates.map((template) => (
                    <div
                      key={template.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTemplate(template)
                      }}
                      className={`p-4 cursor-pointer border-b last:border-b-0 transition-all duration-200 ${selectedTemplate?.id === template.id
                        ? 'bg-purple-50 border-purple-200 shadow-sm'
                        : 'bg-white hover:bg-gray-50'
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="templateSelect"
                          onClick={e => e.stopPropagation()}
                          checked={selectedTemplate?.id === template.id}
                          onChange={(e) => {
                            e.stopPropagation()
                            setSelectedTemplate(template)

                          }}
                          className="mt-2 text-purple-600 focus:ring-purple-500 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 mb-2 text-sm">
                            {template.title}
                          </h3>
                          <div className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed font-mono bg-gray-50 p-3 rounded border max-h-32 overflow-y-auto">
                            {template.message}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected template preview */}
                {selectedTemplate && (
                  <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm text-purple-700 font-medium mb-2">
                      Selected: {selectedTemplate.title}
                    </p>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap bg-white p-3 rounded border max-h-24 overflow-y-auto font-mono">
                      {selectedTemplate.message}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedTemplate(null);
                  }}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendWhatsApp}
                  disabled={!selectedTemplate}
                  className={`px-4 py-2 text-white rounded-lg transition ${selectedTemplate
                    ? 'bg-[#800080] hover:bg-[#600060]'
                    : 'bg-gray-400 cursor-not-allowed'
                    }`}
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        )}


      </>
    );
  };

  const handleGroupFilter = (e, group) => {
    e.stopPropagation();
    setActiveGroup(group);
    setIsGroupActionOpen(true);

  }

  const getGroupDoctors = async (groupName) => {
    setIsGroupDoctorsLoading(true)
    try {
      const response = await favoritesApi.getGroupDoctors(groupName)
      console.log("data for the group ", response.data)
      const data = await response.data
      setProfileItemGroupDoctors(data)


    } catch (e) {
      console.log("clicked group doctors ", e)
    } finally {
      setIsGroupDoctorsLoading(false)
    }
  }
  const handleGroupClick = (group) => {
    setSelectedGroup(group);
    getGroupDoctors(group)

  }
  const handleRenameGroup = async (newName) => {
    // dispatch(renameGroup({
    //   id: activeGroup.id,
    //   name: newName
    // }))


    // if (selectedGroup?.id === activeGroup?.id) {
    //   setSelectedGroup(prev => ({
    //     ...prev,
    //     name: newName
    //   }))
    // }

    // setIsGroupActionOpen(false);
    const toastId = toast.loading("Renaming group...");
    try {
      const response = await favoritesApi.updateGroup(activeGroup, newName);



      setGroups(prev => {
        return prev.map(group => {
          return group === activeGroup ? newName : group
        })
      })

      if (selectedGroup == activeGroup) {
        setSelectedGroup(newName)
      }

      setActiveGroup(newName)

      setIsGroupActionOpen(false)

      console.log("response for the rename group ", response.data)
      toast.update(toastId, {
        render: `Group renamed to "${newName}" ✏️`,
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (e) {
      console.log("error in the rename group ", e)
      toast.update(toastId, {
        render: "Failed to rename group",
        type: "error",
        isLoading: false,
        autoClose: 1000,
      });
    }

  }

  const handleDeleteGroup = async () => {
    const toastId = toast.loading("Deleting group...");
    try {
      await favoritesApi.deleteGroup(activeGroup);

      // Update local state to remove the deleted group
      setGroups(prev => prev.filter(group => group !== activeGroup));

      // Reset selected group if the deleted group was selected
      if (selectedGroup === activeGroup) {
        setSelectedGroup(null);
        setProfileItemGroupDoctors(null);
      }
      setIsGroupActionOpen(false);
      toast.update(toastId, {
        render: `Group "${activeGroup}" deleted successfully 🗑️`,
        type: "success",
        isLoading: false,
        autoClose: 1000,
      });
    } catch (e) {
      console.log("error in the delete group ", e)
      toast.update(toastId, {
        render: "Failed to delete group",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });

    }
  }
  //   handleAddExperts(from GroupActionsModal) - This function is triggered when you click "Add Experts" in the modal.Its job is to:

  // Close the group actions modal
  // Switch to "add mode" UI
  // Show the list of available doctors to add
  const handleAddExperts = () => {

    // try{

    //   const response = favoritesApi.addExpertsToGroup(activeGroup, selectedProfiles.map(p => p.Record_Id))
    //   console.log("response for the add experts ", response.data)

    // }catch(e){

    //   console.log("error in the add experts ",e)
    // }

    setIsGroupActionOpen(false);
    // setIsModalOpen(false);
    setIsAddMode(true);
    setSelectedGroup(activeGroup);
    setActiveGroup(activeGroup)
    setSelectedGroupDoctors([])
  }

  const handleSelectAllAddExpertsToGroup = () => {
    const availableDoctors = profiles.filter(
      doc => !profileItemGroupDoctors?.some(gdoc => gdoc.Record_Id === doc.Record_Id)
    );
    if (selectedGroupDoctors.length === availableDoctors.length) {
      setSelectedGroupDoctors([]);
    } else {
      setSelectedGroupDoctors(availableDoctors);
    }
  };

  const handleAddSelectedExperts = async () => {
    //   try {
    //     // Get the Record_Ids of selected doctors to add
    //     const selectedDoctorIds = selectedGroupDoctors.map(doctor => doctor.Record_Id);

    //     // Make API call to add experts to group
    //     await favoritesApi.addExpertsToGroup(selectedDoctorIds, activeGroup);

    //     // Fetch updated group doctors to reflect changes immediately
    //     const updatedGroupDoctors = await favoritesApi.getGroupDoctors(activeGroup);
    //     setProfileItemGroupDoctors(updatedGroupDoctors.data);

    //     // Reset selection state
    //     setIsAddMode(false);
    //     setSelectedGroupDoctors([]);

    //   } catch (e) {
    //     console.log("error in adding the selected experts in group ", e);
    //   }
    // }
    const toastId = toast.loading("Adding experts...");
    try {
      // Get the Record_Ids of selected doctors to add
      const selectedDoctorIds = selectedGroupDoctors.map(doctor => doctor.Record_Id);

      const response = await favoritesApi.addExpertsToGroup(selectedDoctorIds, activeGroup);

      await getGroupDoctors(activeGroup)





      // // Add selectedGroupDoctors to the group
      // const updatedDoctors = [
      //   ...selectedGroup.doctors,
      //   ...selectedGroupDoctors
      // ];


      // dispatch(updateGroupDoctors({
      //   groupId: selectedGroup.id,
      //   doctors: updatedDoctors
      // }));




      // setSelectedGroup(prev => ({
      //   ...prev,
      //   doctors: updatedDoctors
      // }));

      setIsAddMode(false);
      setSelectedGroupDoctors([]);
      toast.update(toastId, {
        render: `${selectedDoctorIds.length} expert(s) added to group 👥`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });


    } catch (e) {
      console.log("error in adding the selected experts in group ", e)
      toast.update(toastId, {
        render: "Failed to add experts",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    }
  }



  // this renders the list of doctors in the selected group
  const renderGroups = () => (
    <div className="w-full h-[100vh]">
      <div className="grid grid-cols-1 gap-2 m-2">
        {groups.map((group) => (
          <div
            key={group}
            className={`${selectedGroup === group ? 'bg-[#bf8cbf]' : ''} hover:bg-[#bf8cbf] hover: cursor-pointer rounded-md p-2`}
            onClick={() => handleGroupClick(group)}
          >


          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <FaUsers 
                size={20} 
                className="text-[#800080] hover:scale-110 transition-transform cursor-pointer" 
                onClick={e => handleGroupFilter(e, group)} 
                title="Group Actions" 
              />
              <h4 className="font-medium text-[#800080]">{group}</h4>
            </div>
            <div>
              <FiMoreVertical
                size={20}
                className="text-[#800080] hover:scale-110 transition-transform cursor-pointer"
                onClick={e => handleGroupFilter(e, group)}
                title="More Options"
              />
            </div>
          </div>
            {/* <p className="text-sm text-gray-600">{group.doctors.length} doctors</p> */}
          </div>

        ))}
      </div>
    </div>
  );

  return (
    <div className='mt-[6rem]'>
      {/* <Header /> */}


      <div className="grid grid-cols-12 gap-1 ">
        <div className='col-span-3 shadow-lg rounded-lg p-4 ml-2 min-h-screen'>
          <div className="flex flex-row items-center justify-between border-b border-b-gray-700">
            <div><h2 className='font-medium  flex items-center gap-1 mb-2 text-lg'><TiThMenuOutline size={20} /> Segment</h2></div>
            <div className="flex flex-row items-center justify-between mt-2 border-b border-b-gray-400 pb-2">
              {/* <h2 className='text-[#800080] flex items-center'>My Group</h2> */}

              <button onClick={() => setIsModalOpen(true)} className='border border-[#800080] p-1 rounded-sm hover:bg-[#800080] hover:text-[#fff] flex items-center justify-center  text-[#800080] create-group'>
                <span className="flex items-center justify-center"> <MdAdd /> Create Segment</span>
              </button>
            </div>

          </div>
          {groups.length > 0 && renderGroups()}
        </div>

        {/*Favourties doctors */}
        <div className="flex flex-col col-span-9 ">
          <div className="flex justify-between items-center rounded-md p-3 ml-10 mr-10 mb-4">
            {/* <p><span className='font-semibold text-lg'>{(profiles.length>0)?<h1>{profiles.length} Favorites</h1>:<h1>No Favorites</h1>}</span></p> */}



          </div>
          <div className='flex items-center justify-between p-4'>
            <div className="flex items-center gap-2 ml-10 pb-2">

              {!selectedGroup && !isAddMode ? (<><input
                type="checkbox"
                className="w-4 h-4 rounded-md cursor-pointer accent-fuchsia-700 "
                checked={selectAll}
                onChange={handleSelectAll}
              />
                <p className="font-white">Select all</p></>) : !isAddMode && <>
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded-md cursor-pointer accent-fuchsia-700"
                    checked={profileItemGroupDoctors?.length > 0 && selectedGroupDoctors.length === profileItemGroupDoctors.length}
                    onChange={handleSelectAllGroupDoctors}
                  />
                  <p>Select all</p>
                </>}
              {isAddMode && <div className="flex items-center gap-2 ml-10 pb-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded-md cursor-pointer accent-fuchsia-700"
                  checked={
                    profiles &&
                    profileItemGroupDoctors &&
                    selectedGroupDoctors.length === profiles.filter(
                      doc => !profileItemGroupDoctors.some(gdoc => gdoc.Record_Id === doc.Record_Id)
                    ).length
                  }
                  onChange={handleSelectAllAddExpertsToGroup}
                />
                <p>Select all</p>
              </div>}

            </div>
            <div className="flex items-center gap-2">
              {/* Select Content Button - Always Visible */}
              <button
                className={`flex items-center gap-1 px-4 py-2 rounded-md font-medium ${
                  (selectedGroup ? selectedGroupDoctors.length > 0 : selectedProfiles.length > 0)
                    ? "bg-fuchsia-700 text-white cursor-pointer hover:bg-fuchsia-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                  } transition duration-300`}
                disabled={selectedGroup ? selectedGroupDoctors.length === 0 : selectedProfiles.length === 0}
                onClick={handleSelectContentClick}
                title={(selectedGroup ? selectedGroupDoctors.length === 0 : selectedProfiles.length === 0) ? "Select doctors first" : "Click to select content"}
              >
                <Mail size={20} />
                Select Content
              </button>

              {/* Context-Specific Buttons */}
              {!selectedGroup ? (
                <button
                  className={`flex items-center gap-1 px-4 py-2 rounded-md font-medium ${selectedProfiles.length > 0
                    ? "bg-fuchsia-700 text-white cursor-pointer hover:bg-fuchsia-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                    } transition duration-300`}
                  disabled={selectedProfiles.length === 0}
                  onClick={handleRemoveFromFavorites}
                  title={selectedProfiles.length === 0 ? "Select doctors first" : "Remove selected doctors"}
                >
                  <MdStarBorder size={20} />
                  Remove from Segment
                </button>
              ) : !isAddMode ? (
                <button
                  className={`flex items-center gap-1 px-4 py-2 rounded-md font-medium ${selectedGroupDoctors.length > 0
                    ? "bg-fuchsia-700 text-white cursor-pointer hover:bg-fuchsia-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                    } transition duration-300`}
                  disabled={selectedGroupDoctors.length === 0}
                  onClick={handleRemoveFromGroup}
                  title={selectedGroupDoctors.length === 0 ? "Select doctors first" : "Remove selected from group"}
                >
                  <MdStarBorder size={20} />
                  Remove from Group
                </button>
              ) : (
                <button
                  className={`px-4 py-2 rounded-md font-medium ${selectedGroupDoctors.length > 0
                    ? "bg-fuchsia-700 text-white cursor-pointer hover:bg-fuchsia-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                    } transition duration-300`}
                  disabled={selectedGroupDoctors.length === 0}
                  onClick={handleAddSelectedExperts}
                  title={selectedGroupDoctors.length === 0 ? "Select doctors first" : "Add selected experts"}
                >
                  Add Selected Experts
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 border border-gray-200 rounded-md p-5 ml-10 mr-10">
            {isAddMode ? (
              // Show add experts UI
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-[#800080]">{activeGroup} - Add Experts</h3>
                  <button
                    onClick={() => setIsAddMode(false)}
                    className="text-[#800080] hover:underline"
                  >
                    Back to Group
                  </button>
                </div>
                {/* List of favorite doctors NOT already in the group */}
                {(selectedGroup
                  ? profiles.filter(
                    doc => !profileItemGroupDoctors?.some(gdoc => gdoc.Record_Id === doc.Record_Id)
                  )
                  : []
                ).length > 0 ? (
                  <List
                    height={400}
                    width="100%"
                    itemCount={profiles.filter(
                      doc => !profileItemGroupDoctors?.some(gdoc => gdoc.Record_Id === doc.Record_Id)
                    ).length}
                    itemSize={100}
                    className='thin-scrollbar overflow-y-auto'
                  >
                    {({ index, style }) => {
                      const availableDoctors = profiles.filter(
                        doc => !profileItemGroupDoctors?.some(gdoc => gdoc.Record_Id === doc.Record_Id)
                      );
                      const profile = availableDoctors[index];
                      // Use your ProfileItem logic, but for availableDoctors
                      // You may want to allow selecting multiple doctors to add
                      // Example:
                      return (
                        <div style={style} className="border-b border-gray-200 last:border-b-0">
                          <div className="flex items-center gap-2 p-5">
                            <input
                              type="checkbox"
                              className="w-4 h-4 rounded-md mr-2 accent-fuchsia-700"
                              checked={selectedGroupDoctors.some(p => p.Record_Id === profile.Record_Id)}
                              onChange={() => {
                                setSelectedGroupDoctors(prev => {
                                  if (prev.some(p => p.Record_Id === profile.Record_Id)) {
                                    return prev.filter(p => p.Record_Id !== profile.Record_Id);
                                  }
                                  return [...prev, profile];
                                });
                              }}
                            />
                            <img
                              src={getAssetPath('profileImg1.png')}
                              alt="profile"
                              className="w-15 h-15 rounded-full"
                            />
                            <div className="flex flex-col">
                              <p className="text-[#800080] font-semibold text-lg">
                                {profile.Full_Name}
                              </p>
                              <p className="text-md">{profile.Clinic_Name_1 !== "NaN" && profile.Clinic_Name_1}</p>
                              <p className="text-sm">{profile["HCP_Speciality_1"]}</p>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  </List>
                ) : (
                  <p className="text-center py-4">No more experts to add</p>
                )}
                {/* Add button */}

              </>) : selectedGroup ? (
                // Show selected group's doctors
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-[#800080]">{selectedGroup.name}</h3>

                    <button
                      onClick={() => setSelectedGroup(null)}
                      className="text-[#800080] hover:underline"
                    >
                      {isAddMode ? 'view more profile and Add them' : 'View All Segments'}
                    </button>
                  </div>
                  {profileItemGroupDoctors?.length > 0 && !isGroupDoctorsLoading ? (
                    <List
                      height={1000}
                      width="100%"
                      itemCount={profileItemGroupDoctors?.length}
                      itemSize={100}
                      className='thin-scrollbar overflow-y-auto'
                    >
                      {/* {({ index, style }) => {
                    const doctor = selectedGroup.doctors[index];
                    return (
                      <div style={style} className="border-b border-gray-200 last:border-b-0">
                        <div className="flex items-center gap-2 p-5">
                          <img
                            src="/profileImg1.png"
                            alt="profile"
                            className="w-15 h-15 rounded-full"
                          />
                          <div className="flex flex-col">
                            <p className="text-[#800080] font-semibold text-lg">
                              {doctor.Full_Name}
                            </p>
                            <p className="text-md">{doctor.Clinic_Name_1 !== "NaN" && doctor.Clinic_Name_1}</p>
                            <p className="text-sm">{doctor["HCP_Speciality_1"]}</p>
                          </div>
                        </div>
                      </div>
                    );
                  }} */}

                      {ProfileItem}
                    </List>
                  ) : (
                    <p className="text-center py-4">{!isGroupDoctorsLoading ? "No doctors in this group" : "Loading.."}</p>
                  )}
                </>
              ) : (
              // Show all favorites or no favorites message
              profiles?.length > 0 && !isFavoritesLoading ? (
                <List
                  height={1000}
                  width="100%"
                  itemCount={profiles.length}
                  itemSize={100}
                  className='thin-scrollbar overflow-y-auto'
                >
                  {ProfileItem}
                </List>
              ) : (
                <p className="text-center py-4">{!isFavoritesLoading ? "No Segments added yet" : "Loading.."}</p>
              )
            )}
          </div>

          <CreateGroupModal
            isOpen={isModalOpen}
            groupNames={groups}
            onClose={() => setIsModalOpen(false)}
            selectedProfiles={selectedProfiles}
            onCreateGroup={handleCreateGroup}
          />

          <GroupActionsModal
            isOpen={isGroupActionOpen}
            onClose={() => setIsGroupActionOpen(false)}
            group={selectedGroup}
            onRename={handleRenameGroup}
            onDelete={handleDeleteGroup}
            onAddExperts={handleAddExperts}

          />

          {/* Content Selection Modal */}
          <ContentSelectionModal
            isOpen={isContentSelectionOpen}
            onClose={handleCloseContentModal}
            onSelectTopic={handleContentModalTopicSelect}
          />

          {/* Template Selection Modal */}
          <TemplateSelectionModal
            isOpen={isTemplateSelectionOpen}
            onClose={handleCloseTemplateModal}
            topic={selectedTopic}
            onSend={handleSendContent}
          />
        </div>
      </div>
    </div>
  )
}

export default FavouritesPage


