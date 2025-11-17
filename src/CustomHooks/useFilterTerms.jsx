import React from 'react'
import {useSelector} from 'react-redux'
const useFilterTerms = () => {
    const {scientific, clinical, location, digital} = useSelector((state) => state.filter);
    return [scientific,clinical,location,digital].filter(Boolean)
}

export default useFilterTerms