import { configureStore, createSlice, current } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

// const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     isAuthenticated: false,
//     user: null,
//     location: null,
//     formSubmitted: [],
//   },
//   reducers: {
//     login: (state, action) => {
//       state.isAuthenticated = true;
//       state.user = action.payload;
//     },
//     logoutUser: (state) => {
//       state.isAuthenticated = false;
//       state.user = null;
//     },
//     coordinates: (state, action) => {
//       state.location = action.payload;
//     },
//     form: (state, action) => {
//       state.formSubmitted.push(action.payload); // Push the new form name into the array
//     },
//   },
// });

const userDataSlice = createSlice({
  name: 'userData',
  initialState: {
    isAuthenticated: false,
    user: null,
    assignedLocations: [],
    currentLocation: {},
    currentCitizen: {},
    forms: {}
  },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.assignedLocations = action.payload?.user?.data?.villages
    },
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.assignedLocations = [];
      state.currentLocation = {};
      state.currentCitizen = {};
      state.forms = {};
    },
    setCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
    },
    setAssignedLocations: (state, action) => {
      state.assignedLocations = action.payload;
    },
    addCitizen: (state, action) => {
      const currLocIndex = state.assignedLocations.findIndex((el) => el.villageCode == state.currentLocation.villageCode)
      console.log("FIND CURRENT-->", currLocIndex)
      console.log("Add Citizen --->", current(state.currentLocation), action.payload)
      let newCurrLocation = {
        ...state.currentLocation,
        citizens: [...(state?.currentLocation?.citizens || []), { citizenId: action.payload.id }]
      }
      state.currentLocation = newCurrLocation
      state.assignedLocations = [...state.assignedLocations.slice(0, currLocIndex), newCurrLocation, ...state.assignedLocations.slice(currLocIndex + 1)]
    },
    addFormUri: (state, action) => {
      state.forms = { ...state.forms, [action.payload.formId]: action.payload.formUrl }
    },
    saveCitizenFormData: (state, action) => {
      const currLocIndex = state.assignedLocations.findIndex((el) => el.villageCode == state.currentLocation.villageCode)
      console.log("Save citizenFormDat --->", current(state.currentLocation), action.payload)
      if (state?.currentLocation?.citizens?.length) {
        let citArray = state?.currentLocation?.citizens;

        const currCitIndex = citArray.findIndex((el) => el.citizenId == action.payload.id)

        let newCitizenArray = [...citArray.slice(0, currCitIndex), { ...citArray[currCitIndex], status: 'SUBMITTED', submissionData: action.payload.data, capturedAt: action.payload.capturedAt }, ...citArray.slice(currCitIndex + 1)]

        let newCurrLocation = {
          ...state.currentLocation,
          citizens: newCitizenArray
        }
        state.currentLocation = newCurrLocation
        state.assignedLocations = [...state.assignedLocations.slice(0, currLocIndex), newCurrLocation, ...state.assignedLocations.slice(currLocIndex + 1)]
      }
    },
    setCurrentCitizen: (state, action) => {
      state.currentCitizen = action.payload
    }
  }
})

const persistConfig = {
  key: 'root', // key for the root of the storage
  storage, // storage to use (e.g., localStorage)
};

const persistedUserDataReduces = persistReducer(persistConfig, userDataSlice.reducer);

const store = configureStore({
  reducer: {
    // Using persisted reducers 
    userData: persistedUserDataReduces
  },
});

const persistor = persistStore(store);


export const {
  login,
  logoutUser,
  setCurrentLocation,
  setAssignedLocations,
  addCitizen,
  saveCitizenFormData,
  addFormUri,
  setCurrentCitizen
} = userDataSlice.actions;

export { store, persistor };
