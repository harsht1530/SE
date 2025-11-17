import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  scientific: "",
  clinical: "",
  location: "",
  digital: "",
  speciality: ""
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setFilter(state, action) {
      return { ...state, ...action.payload };
    },
  
    
    resetFilter() {
      return initialState;
    }
  }
});

export const   getSelectedFilterCount = (state)=>{
  let count = 0

  let arr = ["scientific","clinical","location","digital","speciality"]
  for(const [key,value] of Object.entries(state.filter)){
    if(arr.includes(key) && value !== ""){
      count+=1;
    }
  }
  return count;
}

export const { setFilter, resetFilter } = filterSlice.actions;
export default filterSlice.reducer;
