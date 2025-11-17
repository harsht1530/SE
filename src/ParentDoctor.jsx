import React,{useRef,Suspense} from 'react'
import { HashRouter as Router, Routes, Route,useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import ChatwootWidget from './Components/ChatwootWidget'
const  ProfilePage = React.lazy(() => import('./Pages/ProfilePage')) 
const NewsfeedPage = React.lazy(() => import('./Pages/NewsfeedPage')) 
const  ScientificProfileListPage = React.lazy(() => import('./Pages/ScientificProfileListPage')) 
import AdminDashboard from './Pages/AdminDashboard'
import LoginPage from './Pages/LoginPage'
import { Provider } from 'react-redux'
// import { persistor } from './utils/appStore'
import store from './utils/appStore'
import ProtectedRoute from './Components/ProtectedRoute'
import ProtectedAdminRoute from './Components/ProtectedAdminRoute'
import RegistrationPage from './Pages/RegistrationPage'
const FavouritesPage = React.lazy(() => import('./Pages/FavouritesPage'))
import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from './utils/appStore'
import ProductTour from './Pages/ProductTour'
import InsightsPage from './Pages/InsightsPage';
import { TrendsPage }from './Pages/TrendsPage'
const Header = React.lazy(() => import('./Components/Header')) 
import './App.css'
import 'shepherd.js/dist/css/shepherd.css'

const queryClient = new QueryClient();

const HeaderWrapper = ({ onStartTour }) => {
  const location = useLocation();
  
  // Don't render Header on login page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <Suspense fallback={<h1>loading header..</h1>}>
    <Header onStartTour={onStartTour} />
    </Suspense>
  );
};




const ParentDoctor = () => {
  const productTourRef = useRef(null);

  return (
    <div>
      
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
        
          <Router>
          <HeaderWrapper 
              onStartTour={() => {
                console.log('Starting tour from Header');
                productTourRef.current?.startTour();
              }} 
            />
          <ProductTour ref={productTourRef} />
            <Routes>
            <Route path="/trends" element={
                <Suspense fallback={<h1>loading trends ... </h1>}>
                <ProtectedRoute>
                  <div className='mt-24'>
                    <InsightsPage />
                    <ChatwootWidget />
                  </div>
                </ProtectedRoute>
                </Suspense>
              } />
              <Route path="/newsFeed" element={
                <Suspense fallback={<h1>loading newsFeed ... </h1>}>
                <ProtectedRoute>
                  <>
                  <QueryClientProvider client={queryClient}>
                    <NewsfeedPage />
                  </QueryClientProvider>
                    <ChatwootWidget />
                  </>
                </ProtectedRoute>
                </Suspense>
              } />
              <Route path="/favourites" element={
                <Suspense fallback={<h1>loading favorites...</h1>}>
                <ProtectedRoute>
                  <>
                    <FavouritesPage />
                    <ChatwootWidget />
                  </>
                </ProtectedRoute>
                </Suspense>
              } />
              <Route path="/scientific-profiles" element={
                <Suspense fallback={<h1>loading scientifics...</h1>}>
                <ProtectedRoute>
                  <>
                    <ScientificProfileListPage />
                    <ChatwootWidget />
                  </>
                </ProtectedRoute>
                </Suspense>
              } />
              <Route path="/profile/:encryptedProfileId" element={
                <Suspense fallback={<h1>loading profiles...</h1>}>
                <ProtectedRoute>
                  <>
                 
                    <ProfilePage />
                    <ChatwootWidget />
                  </>
                </ProtectedRoute>
                </Suspense>
              } />
              <Route path="/" element={<LoginPage />} />
            </Routes>
            
          </Router>
         
        </PersistGate>
      </Provider>
      
    </div>
  )
}

export default ParentDoctor