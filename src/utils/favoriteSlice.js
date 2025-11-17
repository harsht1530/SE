import {createSlice} from "@reduxjs/toolkit"

const favoriteSlice = createSlice({
    name:"favorites",
    initialState:{
        doctors:[]
    },
    reducers:{
        addFavorites:(state,action)=>{

            const newDoctors = action.payload.filter((doctor) => {
                return !state.doctors.some((favDoctor) => favDoctor.Record_Id === doctor.Record_Id)
            })
            
            state.doctors = [...state.doctors,...newDoctors];
        },
        removeFavorites:(state,action)=>{
            // action.payload should be an array of Record_Ids to remove
            state.doctors = state.doctors.filter((doctor)=>
                !action.payload.includes(doctor.Record_Id)
            )
        },
        resetFavorites:(state)=>{
            state.doctors = [];
        }

    }
})

export const {addFavorites,removeFavorites,resetFavorites} = favoriteSlice.actions;

export default favoriteSlice.reducer