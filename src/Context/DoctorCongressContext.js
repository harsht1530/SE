import React from "react"

const DoctorCongressContext = React.createContext({
    doctorCongress:null
})

export const DoctorCongressProvider = DoctorCongressContext.Provider

export const useDoctorCongress = () => React.useContext(DoctorCongressContext);

export default DoctorCongressContext;