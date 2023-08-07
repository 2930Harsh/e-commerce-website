import React, { Fragment } from "react";
import { useSelector} from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({isAdmin,children}) => {
  
  // const [ok, setOk] = useState();
  let { loading, isAuthenticated,user} = useSelector ((state) => state.user);


  return (
    <Fragment>
        {console.log(isAuthenticated)}
        {console.log(loading)}
        {console.log(isAdmin)}
        {console.log(children)};
        {console.log(user)};
        {/* {(isAuthenticated===false) ? (<> <Navigate to = '/login' /> {console.log("login")} </>): <>{console.log("Children")} {children}</> } */}
        {
          loading === false && 
          isAuthenticated===false ? <Navigate to='/login'/> 
          : (
            (isAdmin === true && user.role!=="admin") ?
            <Navigate to='/login' /> :
            <>{children}</>)
        }
    </Fragment>
  )
}

export default ProtectedRoute