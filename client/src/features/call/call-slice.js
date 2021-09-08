import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  userOnOtherSide: null,
  isReceivingCall: false,
  incomingCallDetails: null,
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
    setIncomingCallDetails: (state, { payload }) => {
      state.incomingCallDetails = payload;
    },
  },
});

export const {
  setUserOnOtherSide,
  setIsReceivingCall,
  setIncomingCallDetails,
} = callSlice.actions;
export default callSlice.reducer;
