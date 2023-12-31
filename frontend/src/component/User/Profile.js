import React, { Fragment } from 'react'
import MetaData from '../layout/MetaData'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import Loading from '../layout/Loading/Loading';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './Profile.css'

const Profile = () => {

    const {user,loading,isAuthenticated} = useSelector((state)=>state.user);
    const navigate = useNavigate();
    
    useEffect(() => {
        console.log(isAuthenticated);
        if(isAuthenticated===false){
            navigate('/login');
        }
      
    }, [isAuthenticated,navigate])
    

  return (
    <Fragment>
        {(loading) ? <Loading /> : (<Fragment>
            <MetaData title={`${user.name} -- ECOMMERCE`} />
        <div className='profileContainer'>
            <div>
              <h1>My Profile</h1>
              <img src={user.avatar.url} alt={user.name} />
              <Link to="/me/update">Edit Profile</Link>
            </div>
            <div>
            <div>
                <h4>Full Name</h4>
                <p>{user.name}</p>
            </div>
            <div>
                <h4>Email</h4>
                <p>{user.email}</p>
            </div>
            <div>
                <h4>Joined On</h4>
                <p>{String(user.createdAt).substring(0,10)}</p>
            </div>
            <div>
                <Link to="/orders">My Orders</Link>
                <Link to="/password/update">Change Password</Link>
            </div>
            </div>
        </div>
        </Fragment>)}
    </Fragment>
  )
}

export default Profile