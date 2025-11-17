import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favoriteBranches: [], // array to store favorite profiles
};

const HCOFavouritesDoctorsSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      // Add favorite if not already in the list
      const exists = state.favoriteBranches.find(fav => fav.HCO_Record_Id === action.payload.HCO_Record_Id);
      if (!exists) {
        state.favoriteBranches.push(action.payload);
      }
    },
    removeFavorite: (state, action) => {
       const idsToRemove = action.payload.map(branch => branch.HCO_Record_Id);
    state.favoriteBranches = state.favoriteBranches.filter(
      fav => !idsToRemove.includes(fav.HCO_Record_Id)
    );
    },
    clearFavorites: (state) => {
      state.favoriteBranches = [];
    }
  }
});

export const { addFavorite, removeFavorite, clearFavorites } = HCOFavouritesDoctorsSlice.actions;

export default HCOFavouritesDoctorsSlice.reducer;