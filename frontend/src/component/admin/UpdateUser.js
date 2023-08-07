import React, { Fragment, useEffect, useState } from "react";
import "./NewProduct.css";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import MailOutLineIcon from '@material-ui/icons/MailOutline'
import PersonIcon from '@material-ui/icons/Person'
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser'
import Sidebar from "./Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import { UPDATE_USER_RESET } from "../../constants/userConstants";
import { clearErrors, getUserDetails, updateUser } from "../../actions/userAction";
import Loading from "../layout/Loading/Loading";

const UpdateUser = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const alert = useAlert();
    const {id} = useParams();
    const userId = id;

    const {loading,error ,user} = useSelector((state)=> state.userDetails);
    const {loading: updateLoading ,error: updateError ,isUpdated} = useSelector((state)=> state.profile);
    console.log(user);
    // console.log(useSelector((state)=>state.profile));
    console.log(isUpdated);

    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [role,setRole] = useState("");

useEffect(()=>{
    if(user && user._id !== userId){
        dispatch(getUserDetails(userId));
    }
    else{
        setName(user.name);
        setEmail(user.email);
        setRole(user.role);
        
    }
    if(error){
        console.log(error);
        alert.error(error);
        dispatch(clearErrors());
    }

    if(updateError){
        alert.error(updateError);
        dispatch(clearErrors());
    }

    if(isUpdated){
        alert.success("User Updated Successfully");
        navigate('/admin/users');
        dispatch({
            type: UPDATE_USER_RESET
        })
    }

    

},[dispatch ,error, isUpdated ,alert,navigate,updateError,user,userId]);
    

const updateUserSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name",name);
    myForm.set("role",role);
    myForm.set("email",email);
    
    dispatch(updateUser(userId,myForm));

}
 

  return (
    <Fragment>
        <MetaData title={`Update User`}/>
        <div className="dashboard">
            <Sidebar />
            <div className="newProductContainer" >
                {loading ? <Loading /> :
                <form 
                    className="createProductForm"
                    onSubmit={updateUserSubmitHandler}
                >
                    <h1>Update User</h1>
                    <div>
                        <PersonIcon />
                        <input 
                            type="text"
                            placeholder="Name"
                            required
                            value={name}
                            onChange={(e)=>setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <MailOutLineIcon />
                        <input
                            type="email"
                            placeholder="Email"
                            required
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <VerifiedUserIcon />
                        <select value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="">Choose Role</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                            
                        </select>
                    </div>
                    
                    
                    <Button
                        id="createProductBtn"
                        type="submit"
                        disabled= {updateLoading ? true : false || role==="" ? true : false}
                    >Update</Button>
                </form>}
            </div>
         </div>
    </Fragment>
  )
}

export default UpdateUser