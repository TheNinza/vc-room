import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  fullPageBlurred: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState: INITIAL_STATE,
  reducers: {
    enableFullPageBlur: (state) => {
      state.fullPageBlurred = true;
    },
    disableFullPageBlur: (state) => {
      state.fullPageBlurred = false;
    },
  },
});

export const { enableFullPageBlur, disableFullPageBlur } = uiSlice.actions;
export default uiSlice.reducer;
