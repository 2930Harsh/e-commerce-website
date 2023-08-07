import "./App.css"
import Header from './component/layout/Header/Header.js'
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import webFont from 'webfontloader'
import React from 'react'
import Footer from './component/layout/Footer/Footer.js'
import Home from './component/Home/Home.js'
import ProductDetails from './component/Product/ProductDetails.js'
import Products from './component/Product/Products.js'
import Search from './component/Product/Search.js'
import LoginSignUp from "./component/User/LoginSignUp"
import store from './store'
import { loadUser } from "./actions/userAction"
import UserOptions from './component/layout/Header/userOptions.js'
import { useSelector } from "react-redux"
import Profile from './component/User/Profile.js'
import ProtectedRoute from "./component/Route/ProtectedRoute"
import UpdateProfile from './component/User/UpdateProfile.js'
import UpdatePassword from './component/User/UpdatePassword.js'
import ForgotPassword from './component/User/ForgotPassword.js'
import ResetPassword from './component/User/ResetPassword.js'
import Cart from './component/Cart/Cart.js'
import Shipping from './component/Cart/Shipping.js'
import ConfirmOrder from './component/Cart/ConfrimOrder.js'
import Payment from './component/Cart/Payment.js'
import OrderSuccess from './component/Cart/OrderSuccess.js'
import MyOrders from './component/Order/MyOrders.js'
import OrderDetails from './component/Order/OrderDetails.js'
import Dashboard from './component/admin/Dashboard.js'
import ProductList from './component/admin/ProductList.js'
import NewProduct from "./component/admin/NewProduct"
import UpdateProduct from './component/admin/UpdateProduct.js'
import OrderList from "./component/admin/orderList"
import ProcessOrder from "./component/admin/processOrder"
import UsersList from "./component/admin/UsersList"
import UpdateUser from "./component/admin/UpdateUser"
import ProductReviews from "./component/admin/ProductReviews"
import Contact from "./component/layout/Contact/Contact.js";
import About from "./component/layout/About/About.js";
import NotFound from "./component/layout/Not Found/NotFound.js";


function App(){

    const {isAuthenticated,user} = useSelector((state) => state.user);
    
    console.log(isAuthenticated);
    console.log(user);

    React.useEffect(()=>{
        webFont.load({
            google:{
                families:["Roboto" , "Droid Sans" , "Chilanka"]
            }
        })
        console.log("1");
        setTimeout(()=>{
            store.dispatch(loadUser());
        },100)
        

    },[])


    return <Router>
        <Header/>
        
        
        <Routes>
            <Route path="/" element={<Home/>} /> 
            <Route path="/product/:id" element={<ProductDetails />} /> 
            <Route path="/products" element={<Products />} /> 
            <Route path="/products/:keyword" element={<Products />} /> 
            <Route path="/search" element={<Search/>} /> 
            <Route path="/login" element={<LoginSignUp/>} /> 
            <Route path="/cart" element={<Cart/>} /> 
            <Route exact path = '/password/forgot' element = {<ForgotPassword/>} />
            <Route exact path = '/password/reset/:token' element = {<ResetPassword/>} />
            <Route path="/process/payment" element= {<Payment />} />
            <Route path = '/success' element={<OrderSuccess />} />
            <Route path = '/orders' element={<MyOrders />} />
            <Route path = '/order/confirm' element ={<ConfirmOrder/>} />
            <Route path = '/order/:id' element={<OrderDetails />} />
            <Route path = '/admin/dashboard' element={<Dashboard />} />
            <Route path = '/admin/products' element={<ProductList />} />
            <Route path = '/admin/product' element={<NewProduct />} />
            <Route path = '/admin/product/:id' element={<UpdateProduct />} />
            <Route path = '/admin/orders' element={<OrderList />} />
            <Route path = '/admin/order/:id' element={<ProcessOrder />} /> 
            <Route path = '/admin/users' element={<UsersList />} />
            <Route path = '/admin/user/:id' element={<UpdateUser />} />
            <Route path = '/admin/reviews' element={<ProductReviews />} />
            <Route path = '/contact' element={<Contact />} />
            <Route path = '/about' element={<About/>} />
            {/* <Route path = '/account' element={<Profile/>} /> */}
            {/* <Route path = '/me/update' element={<UpdateProfile/>} /> */}


            <Route exact path = '/account' element = 
                {<ProtectedRoute>
                    <Profile />
                </ProtectedRoute>} >
            </Route> 
            <Route exact path = '/me/update' element = 
                {<ProtectedRoute>
                    <UpdateProfile />
                </ProtectedRoute>} >
            </Route>
            <Route exact path = '/password/update' element = 
                {<ProtectedRoute>
                    <UpdatePassword />
                </ProtectedRoute>} >
            </Route>
            <Route exact path = '/shipping' element = 
                {<ProtectedRoute>
                    <Shipping />
                </ProtectedRoute>} >
            </Route>

            <Route path='*' element={<NotFound/>} />


                    {/* <Route path = '/admin/dashboard' element = 
                        {<ProtectedRoute isAdmin={true}>
                            <Dashboard />
                        </ProtectedRoute>} >
                    </Route>  */}
            {/* <Route exact path = '/order/confirm' element = 
                {<ProtectedRoute>
                    <ConfirmOrder />
                </ProtectedRoute>} >
            </Route> */}
            {/* <Route path = '/process/payment' element= {
                <ProtectedRoute>
                    <Payment />
                </ProtectedRoute>
            } />
            <Route path = '/success' element= {
                <ProtectedRoute>
                    < OrderSuccess />
                </ProtectedRoute>
            } /> */}
            {/* <Route element={<ProtectedRoute />}>
                <Route element={<Profile />} path="/account"/>]
                <Route element={<UpdateProfile />} path="/me/update" />
            </Route> */}
             {/* <Route path="/login" element={<LoginSignUp/>}> */}
                {/* <Route path="/login" element={<LoginSignUp/>} /> */}
                {/* <Route path="/account" element={<Profile/>} />
                <Route path="/me/update" element={<UpdateProfile/>} />

            </Route>  */}
            
            
 
        </Routes>

        {isAuthenticated && <UserOptions user={user}/>}
        <Footer/>
    </Router>
}

export default App