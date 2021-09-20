import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  userOnOtherSide: null,
  isReceivingCall: false,
  incomingCallDetails: null,
  callingStatus: false,
  activeCall: null,
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
    setCallingStatus: (state, { payload }) => {
      state.callingStatus = true;
    },
    setActiveCall: (state, { payload }) => {
      state.activeCall = payload;
    },
    resetCallDetails: (state) => {
      return INITIAL_STATE;
    },
  },
});

export const {
  setUserOnOtherSide,
  setIsReceivingCall,
  setIncomingCallDetails,
  setCallingStatus,
  setActiveCall,
  resetCallDetails,
} = callSlice.actions;
export default callSlice.reducer;
