import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  userOnOtherSide: null,
  isReceivingCall: false,
};

const callSlice = createSlice({
  name: "call",
  initialState: INITIAL_STATE,
  reducers: {
    setUserOnOtherSide: (state, { payload }) => {
      state.userOnOtherSide = payload;
    },
    setIsReceivingCall: (state, { payload }) => {
      state.isReceivingCall = payload;
    },
  },
});

export const { setUserOnOtherSide, setIsReceivingCall } = callSlice.actions;
export default callSlice.reducer;
