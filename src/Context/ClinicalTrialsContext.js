import React from 'react';

const ClinicalTrialsContext = React.createContext({
    clinicalData:null,
    handleClinicalData:()=>{},
    clinicalDataByNctId:null
})


export const ClinicalTrialsProvider = ClinicalTrialsContext.Provider;
export const useClinicalTrials = () => React.useContext(ClinicalTrialsContext);

export default ClinicalTrialsContext;

