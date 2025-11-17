import { createSlice } from '@reduxjs/toolkit';

const reachFlagSlice = createSlice({
  name: 'reachFlag',
  initialState: {
    value: 'Local', // default
  },
  reducers: {
    setReachFlag: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setReachFlag } = reachFlagSlice.actions;
export default reachFlagSlice.reducer;
