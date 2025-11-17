import React,{ StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import store from './utils/appStore'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import {persistor } from './utils/appStore' 
import './index.css'
import App from './App'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate  loading={null} persistor={persistor}>
    <App />
    </PersistGate>
    </Provider>
  </StrictMode>,
)
