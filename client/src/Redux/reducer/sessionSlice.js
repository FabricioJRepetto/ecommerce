import { createSlice } from "@reduxjs/toolkit";

export const sessionSlice = createSlice({
  name: "session",
  initialState: {
    username: null,
    avatar: null,
    email: null,
    session: false,
    // id: null,
    role: null,
    isGoogleUser: null,
    allUsersData: [],
    filtersApplied: {},
    usersFiltered: [],
  },
  reducers: {
    loadUsername: (state, action) => {
      state.username = action.payload;
    },
    sessionActive: (state, action) => {
      state.session = action.payload;
    },
    /* loadId: (state, action) => {
      state.id = action.payload;
    }, */
    loadAvatar: (state, action) => {
      state.avatar = action.payload;
    },
    loadEmail: (state, action) => {
      state.email = action.payload;
    },
    loadRole: (state, action) => {
      state.role = action.payload;
    },
    loadGoogleUser: (state, action) => {
      state.isGoogleUser = action.payload;
    },
    adminLoadUsers: (state, action) => {
      state.allUsersData = action.payload;
    },
    adminDeleteUser: (state, action) => {
      state.allUsersData = state.allUsersData.filter(
        (user) => user._id !== action.payload
      );
    },
    adminPromoteUser: (state, action) => {
      state.allUsersData = state.allUsersData.map((user) => {
        if (user._id === action.payload) return { ...user, role: "admin" };
        return user;
      });
    },
    adminFilterUsers: (state, action) => {
      state.allUsersData = state.allUsersData.filter(
        (user) => user._id !== action.payload
      );
      /* filtersApplied = {
        googleAccount: BOOLEAN,
        verifiedEmail: BOOLEAN,
        role: STRING,
      }; */
    },
  },
});

export const {
  loadUsername,
  sessionActive,
  //loadId,
  loadAvatar,
  loadEmail,
  loadRole,
  loadGoogleUser,
  adminLoadUsers,
  adminDeleteUser,
  adminPromoteUser,
} = sessionSlice.actions;

export default sessionSlice.reducer;
