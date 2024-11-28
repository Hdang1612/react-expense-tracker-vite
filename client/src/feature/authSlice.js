import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { login } from "../services/authServices";

export const loginUser = createAsyncThunk(
  "auth/loginUser", //
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await login(email, password);
      sessionStorage.setItem("isAuthenticated", true);
      return res;
    } catch (err) {
      return rejectWithValue(err.message); //rejectwithvalue : khi sử dụng cái này thị lỗi sẽ được truyền vào payload của action rejected
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: sessionStorage.getItem("isAuthenticated") === "true", 
    user: null,
    status: "",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
