import { configureStore, createSlice } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
    location: null,
    formSubmitted: [],
  },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
    coordinates: (state, action) => {
      state.location = action.payload;
    },
    form: (state, action) => {
      state.formSubmitted.push(action.payload); // Push the new form name into the array
    },
  },
});

const userDataSlice = createSlice({
  name: 'userData',
  initialState: {
    assignedLocations: [],
    currentLocation: {}
  },
  reducers: {
    setCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
    },
    setAssignedLocations: (state, action) => {
      state.assignedLocations = action.payload;
    }
  }
})

const persistConfig = {
  key: 'root', // key for the root of the storage
  storage, // storage to use (e.g., localStorage)
};

const persistedAuthReducer = persistReducer(persistConfig, authSlice.reducer);
const persistedUserDataReduces = persistReducer(persistConfig, userDataSlice.reducer);

const store = configureStore({
  reducer: {
    // Using persisted reducers 
    auth: persistedAuthReducer,
    userData: persistedUserDataReduces
  },
});

const persistor = persistStore(store);

export const { login, logoutUser, coordinates, form } = authSlice.actions;
export const { setCurrentLocation, setAssignedLocations } = userDataSlice.actions;
export { store, persistor };
