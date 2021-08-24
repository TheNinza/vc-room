import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserDataFromUserAuth } from "../../lib/firebase/firebase";

const INITIAL_STATE = {
  userData: null,
  error: null,
};

// thunks
export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (user, thunkApi) => {
    if (!user) {
      return null;
    }

    try {
      const userData = await getUserDataFromUserAuth(user);
      return userData;
    } catch (error) {
      return thunkApi.rejectWithValue({
        message: "Error Getting Users",
      });
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: INITIAL_STATE,
  reducers: {
    // setUser: (state, action) => {
    //   state.userData = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      state.userData = action.payload;
      state.error = null;
    });

    builder.addCase(fetchUserData.rejected, (state, action) => {
      state.userData = null;
      state.error = action.payload;
    });
  },
});

// export const { setUser } = userSlice.actions;
export default userSlice.reducer;
