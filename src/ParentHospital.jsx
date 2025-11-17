import React,{useState} from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import HCOProfilePage from './Pages/Hospitals/HCOProfilePage'
import HCOHospitalsPage from './Pages/Hospitals/HCOHospitalsPage'
import AdvanceSearchPage from './Pages/Hospitals/AdvanceSearchPage'
import HCOHospitalsBranchesPages  from './Pages/Hospitals/HCOHospitalsBranchesPages'
import { HCODoctorsDataProvider } from './Context/HCODoctorsDataContext';
import HCOFavouritesPage from './Pages/Hospitals/HCOFavouritesPage'

const ParentHospital = () => {
  const [hcoDoctorsData, setHCODoctorsData] = useState(null);
  return (
    <HCODoctorsDataProvider value={{ hcoDoctorsData, setHCODoctorsData }}>
      <Router >
        <Routes>
          <Route path="/" element={<HCOHospitalsPage />} />
          <Route path="/branches/:id" element={<HCOHospitalsBranchesPages />} />
          <Route path="/profile/:id" element={<HCOProfilePage />} />
          <Route path="/advanceSearch" element={<AdvanceSearchPage />} />
          <Route path="/favourites" element={<HCOFavouritesPage />} />
        </Routes>
      </Router>
    </HCODoctorsDataProvider>
  )
}

export default ParentHospital