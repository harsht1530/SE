import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    profiles:[],
    currentPage:1,
    filterPage:1,
    totalFilterPages:1,
    totalPages:1,
    scientificTotalPages:1,
    scientificCurrentPage:1,
    totalDoctors:0,
    totalLocationResults:0,
    totalPubmedResults:0,

   
}
const sideSearchResultsSlice = createSlice({
    name:"sideSearchResults",
    initialState,
    reducers:{
        resetSidesearchResults:(state) => {
            return {
                ...state,
                currentPage:1,
                filterPage:1
            }
        },
        setscientificTotalPages:(state,action) => {
            state.scientificTotalPages = action.payload;
        },
        setTotalFilterPages:(state,action) => {
            state.totalFilterPages = action.payload;
        },
        setTotalLocationResults:(state,action) => {
            state.totalLocationResults = action.payload
        },
        setTotalPubmedResults:(state,action) => {
            state.totalPubmedResults = action.payload
        },
        setCurrentPage:(state,action) => {
            state.currentPage = action.payload;
        },
        setFilterPage:(state,action) => {
            state.filterPage = action.payload;
        },
        setTotalPages:(state,action) => {
            state.totalPages = action.payload;
        },
        setScientificCurrentPage:(state,action) => {
            state.scientificCurrentPage = action.payload
        },
        setProfiles:(state,action) => {
            state.profiles = action.payload
        },
        setTotalDoctors:(state,action) => {
            state.totalDoctors = action.payload;
        }
    }

})

export const {setscientificTotalPages,setTotalFilterPages,setTotalLocationResults,setCurrentPage,setFilterPage,setTotalPages,setTotalPubmedResults,setTotalDoctors,setScientificCurrentPage,setProfiles,resetSidesearchResults} = sideSearchResultsSlice.actions;
export default sideSearchResultsSlice.reducer;