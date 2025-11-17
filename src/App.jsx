import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import ProfilePage from './Pages/ProfilePage'
import React,{useEffect} from 'react'
import NewsfeedPage from './Pages/NewsfeedPage'
import ScientificProfileListPage from './Pages/ScientificProfileListPage'
import AdminDashboard from './Pages/AdminDashboard'
import LoginPage from './Pages/LoginPage'
import { Provider } from 'react-redux'
// import { persistor } from './utils/appStore'
import store from './utils/appStore'
import ProtectedRoute from './Components/ProtectedRoute'
import ProtectedAdminRoute from './Components/ProtectedAdminRoute'
import RegistrationPage from './Pages/RegistrationPage'
import FavouritesPage from './Pages/FavouritesPage'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from './utils/appStore'
// import store from './utils/appStore'
import HCOProfilePage from './Pages/Hospitals/HCOProfilePage'
import ParentDoctor from './ParentDoctor'
import ParentHospital from './ParentHospital'
import './App.css'


/**
 * @component App
 * @description Root component of the application that handles routing and state management.
 * It wraps the entire application with Redux Provider and Redux Persist to manage global state
 * and state persistence. Uses React Router for navigation between different pages.
 * 
 * @example
 * // Basic usage in index.js
 * import App from './App';
 * ReactDOM.render(<App />, document.getElementById('root'));
 * 
 * @routes
 * - / : Login page (public)
 * - /newsFeed : News feed page (protected)
 * - /favourites : Favorites page (protected)
 * - /scientific-profiles : Scientific profiles list page (protected)
 * - /profile/:profileId : Individual profile page (protected)
 * 
 * @dependencies
 * - react-router-dom
 * - react-redux
 * - redux-persist
 * 
 * @returns {JSX.Element} The root application component with routing and state management setup
 */

function App() {
//   useEffect(() => {
//     if (process.env.NODE_ENV === 'development') {
//       const { whyDidYouUpdate } = require('why-did-you-update');
//       whyDidYouUpdate(React);
//     }
//   }, []);
  return (
    
    <ParentDoctor />
    // <ParentHospital />
       


  )
}

export default App
