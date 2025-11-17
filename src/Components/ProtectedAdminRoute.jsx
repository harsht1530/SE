import {Navigate} from "react-router-dom"

import {useSelector} from 'react-redux'

const ProtectedAdminRoute = ({children}) => {

    const isAdmin = useSelector(state => state.user)

    if(isAdmin.role !== 'admin'){
        return <Navigate to="/newsFeed" replace />
    }

    return children;
}

export default ProtectedAdminRoute;