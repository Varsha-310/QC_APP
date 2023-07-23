import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userToken: null,
    userStatus: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.userToken = action.payload;
    },
    setStatus: (state, action) => {
      state.userStatus = action.payload;
    },
  },
});

export const { setToken, setStatus } = authSlice.actions;
export default authSlice.reducer;
