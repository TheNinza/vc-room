import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { firestore, serverTimestamp } from "../../lib/firebase/firebase";

const INITIAL_STATE = {
  userOnOtherSide: null,
  isReceivingCall: false,
  incomingCallDetails: null,
  callingStatus: false,
  activeCall: null,
  activeCallDocId: null,
  createCallError: null,
  createCallStarted: false,
  createCallLoading: false,
  createCallSuccess: false,
};

// thunks
export const createCall = createAsyncThunk(
  "call/createCall",
  async (uid, thunkApi) => {
    if (!uid) {
      return null;
    }

    try {
      const callDoc = firestore.collection("calls").doc();

      await callDoc.set({
        userOnOtherSide: uid,
        from: thunkApi.getState().user.userData.uid,
        timeStamp: serverTimestamp(),
        callAccepted: false,
        callDeclined: false,
      });

      return callDoc.id;
    } catch (error) {
      return thunkApi.rejectWithValue({
        message: "Cannot Create Call",
      });
    }
  }
);

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
    resetCallDetails: () => {
      return INITIAL_STATE;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createCall.fulfilled, (state, { payload }) => {
      state.createCallSuccess = true;
      state.createCallError = null;
      state.createCallLoading = false;
      state.activeCallDocId = payload;
    });
    builder.addCase(createCall.rejected, (state, { payload }) => {
      state.activeCallDocId = null;
      state.createCallLoading = false;
      state.createCallError = payload;
      state.createCallSuccess = false;
    });
    builder.addCase(createCall.pending, (state, { payload }) => {
      state.activeCallDocId = null;
      state.createCallLoading = true;
      state.createCallError = null;
      state.createCallSuccess = false;
    });
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
