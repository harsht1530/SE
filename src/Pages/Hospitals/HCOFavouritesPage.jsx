import React,{useState} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import HCOHeader from '../../Components/Hospitals/HCOHeader';
import { removeFavorite } from '../../utils/HCOFavouritesDoctorsSlice';
import { MdOutlineStarOutline } from "react-icons/md";
import { RiStarOffLine } from "react-icons/ri";


const HCOFavouritesPage = () => {
    const selectedBranches = useSelector(state => state.hcoFavorites.favoriteBranches);
    console.log("Selected branches in favourites page:", selectedBranches);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [checkedBranches, setCheckedBranches] = useState([]);

    const handleCheckboxChange = (e, branch) => {
        if (e.target.checked) {
            setCheckedBranches(prev => [...prev, branch]);
        }
        else {
            setCheckedBranches(prev => prev.filter(b => b !== branch));
        }
    }

    const handleRemoveFromFavorites = () => {
       
        if (checkedBranches.length > 0) {
            dispatch(removeFavorite(checkedBranches));
            console.log("Branches removed from favorites:", checkedBranches);
            setCheckedBranches([]);
        }

    }

     const handleProfileClick = (HCO_Record_Id) => {
    navigate(`/profile/${HCO_Record_Id}`);
  }
  return (
    <div>
        <HCOHeader />
        <div className="flex flex-col justify-center gap-4 m-20">
            <div className='flex justify-between items-center border-b border-gray-200 pb-4 mb-4'>
                <h1 className="text-xl font-medium flex items-center gap-2 "><MdOutlineStarOutline size={20} />Favourites</h1>
                <button 
                onClick={() => handleRemoveFromFavorites()}
                disabled={checkedBranches.length === 0}
                className='text-white bg-[#800080] rounded-md flex items-center gap-2 px-4 py-2 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-purple-700 hover:shadow-lg'><RiStarOffLine size={20}/>Remove From Favourites</button>
            </div>
            <div className="grid grid-cols-3 gap-x-6">
                {selectedBranches.length > 0 ? (
                    selectedBranches.map((branch, index) => (
                        <div 
                        key={index} 
                        className="flex items-center gap-10 my-6 border rounded-md border-gray-200 p-4 cursor-pointer"
                        >   <div className='flex items-center gap-2 w-[30%]'>
                            <input type="checkbox" 
                            onChange={(e) => handleCheckboxChange(e, branch)} 
                            checked = {checkedBranches.includes(branch)}
                            className='w-4 h-4 cursor-pointer accent-[#800080]'/>
                            <img
                                src={branch.Image_Url || getAssetPath('hospitalLogo1.png')}
                                alt="hospital-logo"
                                className="rounded-full  border border-gray-100 h-20 w-20 object-contain"
                            />
                            </div>
                            <div className="flex flex-col gap-2 w-[70%]">
                                <h1 className="text-lg" onClick={() => handleProfileClick(branch.HCO_Record_Id)}>{branch.HCO_Name}</h1>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='flex justify-center align-center w-full'>No favorites found</div>
                )}



            </div>
        </div>
    </div>
  )
}

export default HCOFavouritesPage