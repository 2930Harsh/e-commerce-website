import React, { Fragment, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import MetaData from '../layout/MetaData';
import CheckOutSteps from '../Cart/CheckOutSteps';
import { Typography } from '@material-ui/core';
import { Link, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import { getOrderDetails,clearErrors, updateOrder } from '../../actions/orderAction';
import { useEffect } from 'react';
import Loading from '../layout/Loading/Loading';
import { useAlert } from 'react-alert';
import AccountTreeIcon from '@material-ui/icons/AccountTree'
import {Button} from '@material-ui/core'
import { UPDATE_ORDERS_RESET } from '../../constants/orderConstants';
import './processOrder.css'


const ProcessOrder = () => {

    const {order,error,loading} = useSelector((state)=> state.orderDetails);
    const {error:updateError,isUpdated} = useSelector((state)=> state.order);

    // const navigate = useNavigate();
    const {id} = useParams();
    const dispatch = useDispatch();
    const alert = useAlert();
    const [status,setStatus] = useState("");

    const updateOrderSubmitHandler = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set("status",status);

        dispatch(updateOrder(id,myForm))
    }

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (updateError) {
            alert.error(updateError);
            dispatch(clearErrors());
        }
        if (isUpdated) {
            alert.success("Order Updated Successfully");
            // navigate('/admin/dashboard')
            dispatch({
                type:  UPDATE_ORDERS_RESET
            });
        }
        

        dispatch(getOrderDetails(id));

    }, [error, alert, dispatch, id,isUpdated,updateError])


    return (
        <Fragment>
            <MetaData title={`Update Order`} />
            <div className="dashboard">
                <Sidebar />
                <div className="newProductContainer" >
                    {loading ? <Loading />:(
                        <Fragment>
                            <CheckOutSteps activeStep={1} />
                    <div className='confirmOrderPage'
                        style={{
                            display: order.orderStatus === 'Delivered' ? "block" : "grid"
                        }}
                    >
                        <div>
                            <div className='confirmShippingArea'>
                                <Typography>Shipping Info </Typography>
                                <div className='orderDetailsContainerBox'>
                                <div>
                                    <p>Name:</p>
                                    <span>{order.user && order.user.name}</span>
                                </div>
                                <div>
                                    <p>Phone:</p>
                                    <span>{order.shippingInfo && order.shippingInfo.phoneNo}</span>
                                </div>
                                <div>
                                    <p>Address:</p>
                                    <span>{order.shippingInfo &&
                                        `${order.shippingInfo.address} , ${order.shippingInfo.city} ,${order.shippingInfo.state} ,${order.shippingInfo.pinCode},${order.shippingInfo.country}`}
                                    </span>
                                </div>
                            </div>
                                <Typography>Payment</Typography>
                                <div className='orderDetailsContainerBox'>
                                    <div>
                                        <p
                                            className={
                                                order.paymentInfo &&
                                                    order.paymentInfo.status === "succeeded" ?
                                                    "greenColor" : "redColor"
                                            }
                                        >
                                            {
                                                order.paymentInfo &&
                                                    order.paymentInfo.status === "succeeded" ?
                                                    "PAID" : "NOT PAID"
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <p>Amount:</p>
                                        <span>{order.totalPrice && order.totalPrice}</span>
                                    </div>
                                </div>
                                <Typography>Order Status</Typography>
                                <div className='orderDetailsContainerBox'>
                                    <div>
                                        <p
                                            className={
                                                order.orderStatus &&
                                                    order.orderStatus === "Delivered" ?
                                                    "greenColor" : "redColor"
                                            }
                                        >
                                            {order.orderStatus && order.orderStatus}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className='confirmCartItems'>
                                <Typography>Your Cart Items:</Typography>
                                <div className='confirmCartItemsContainer'>
                                    {order.orderItems && order.orderItems.map((item) => (
                                        <div key={item.product}>
                                            <img src={item.image} alt='Product' />
                                            <Link to={`/product/${item.product}`}>
                                                {item.name}
                                            </Link>
                                            <span>
                                                {item.quantity}    X    ₹{item.price} =
                                                <b>₹{item.quantity * item.price}</b>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div
                            style={{
                                display: order.orderStatus === 'Delivered' ? 'none' : 'block'
                            }}
                        >
                        <form 
                    className="updateOrderForm"
                    encType="multipart/form-data"
                    onSubmit={updateOrderSubmitHandler}
                >
                    <h1>Process Order</h1>
                    
                    <div>
                        <AccountTreeIcon />
                        <select onChange={(e) => setStatus(e.target.value)}>
                            <option value="">Choose Category</option>
                            {order.orderStatus==='Processing' &&
                            (<option value="Shipped">Shipped</option>)}
                            {order.orderStatus==='Shipped' &&(
                                <option value="Delivered">Delivered</option>
                            )}
                        </select>
                    </div>
                    
                    
                    <Button
                        id="createProductBtn"
                        type="submit"
                        disabled= {loading ? true : false || status === "" ? true : false}
                    >Update</Button>
                </form>
                        </div>
                    </div>
                        </Fragment>
                    )}
                </div>
            </div>
        </Fragment>

    )
}

export default ProcessOrder