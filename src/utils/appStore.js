import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import userReducer from "./userSlice";
import favoriteReducer from "./favoriteSlice"
import filterReducer from "./filterSlice";
import groupsReducer from "./groupsSlice"
import filteredDoctorsReducer from "./filteredDoctorsSlice"
import sideSearchResultsReducer from "./sideSearchResultsSlice"
import hcoFavoritesReducer from './HCOFavouritesDoctorsSlice';
import reachFlagReducer from "./reachFlagSlice";

const persistConfig = {
    key: 'root',
    storage,
    whitelist:['user','filter','favorites','filteredDoctors','groups']
}
// Function to reset store state when user logs out
export const resetStore = () => {
    // Clear persisted storage
    storage.removeItem('persist:root')
    storage.removeItem('persist:filter')
    storage.removeItem('persist:user')
    storage.removeItem('persist:filteredDoctors')
    storage.removeItem('persist:groups')
    storage.removeItem('persist:sideSearchResults')
}


const filterPersistConfig = {
    key: 'filter',
    storage,
    // whitelist:['scientific','clinical','location']
}

const sideSearchResultsPersistConfig = {
    key:'sideSearchResults',
    storage,
    whitelist:['sideSearchResults','filterPage','currentPage']
}

const userPersistConfig = {
    key:'user',
    storage,

}

const filteredDoctorsPersistConfig = {
    key: 'filteredDoctors',
    storage,
    whitelist:['filteredDoctors']
}

const groupedDoctorsPersistConfig={
    key:'groups',
    storage,
    whitelist:['doctorGroups']
}

const hcoFavoritesPersistConfig = {
  key: 'hcoFavorites',
  storage,
  whitelist: ['favoriteBranches'] 
};

const persistedFavoritesReducer = persistReducer(persistConfig, favoriteReducer)
const persistedFilterReducer = persistReducer(filterPersistConfig, filterReducer)
const filteredDoctorsReducer1 = persistReducer(filteredDoctorsPersistConfig, filteredDoctorsReducer)
const persistedDoctorGroupsReducer = persistReducer(groupedDoctorsPersistConfig, groupsReducer)
const persistedUserReducer = persistReducer(userPersistConfig,userReducer)
const persistedSideSearchResultsReducer = persistReducer(sideSearchResultsPersistConfig, sideSearchResultsReducer)
const persistedHcoFavoritesReducer = persistReducer(hcoFavoritesPersistConfig, hcoFavoritesReducer);

const appStore = configureStore({
    reducer:{
        filter: persistedFilterReducer,
        user:persistedUserReducer,
        favorites:persistedFavoritesReducer,
        filteredDoctors:filteredDoctorsReducer1,
        groups:persistedDoctorGroupsReducer,
        sideSearchResults:persistedSideSearchResultsReducer,
        hcoFavorites: persistedHcoFavoritesReducer, 
        reachFlag: reachFlagReducer,

    },
    middleware : (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})

export const persistor = persistStore(appStore)

export default appStore;