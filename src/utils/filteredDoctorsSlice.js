import {createSlice} from "@reduxjs/toolkit"

const filteredDoctorsSlice = createSlice({
    name:"filteredDoctors",
    initialState:{
        filteredDoctors:[]
    },
    reducers:{
        setFilteredDoctors:(state,action)=>{
            state.filteredDoctors = action.payload;
        },
        resetFilteredDoctors:(state)=>{
            state.filteredDoctors = [];
        }
    }
})

export const {setFilteredDoctors,resetFilteredDoctors} = filteredDoctorsSlice.actions;
export default filteredDoctorsSlice.reducer;