import React from 'react';

const ScientificProfileDataContext = React.createContext({
    scientificProfileData:null
})

export const ScientificProfileDataProvider = ScientificProfileDataContext.Provider

export const useScientificProfileData = () => React.useContext(ScientificProfileDataContext);

export default ScientificProfileDataContext;