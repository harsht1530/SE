import React from 'react';
const HCODoctorsDataContext = React.createContext({
    hcoDoctorsData: null,
    setHCODoctorsData: () => {}
});
export const HCODoctorsDataProvider = HCODoctorsDataContext.Provider;
export const useHCODoctorsData = () => React.useContext(HCODoctorsDataContext);