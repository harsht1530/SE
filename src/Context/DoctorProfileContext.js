import React from "react"

const DoctorProfileContext = React.createContext({
    doctorProfile:null
})

export const DoctorProfileProvider = DoctorProfileContext.Provider

export const useDoctorProfile = () => React.useContext(DoctorProfileContext);

export default DoctorProfileContext;