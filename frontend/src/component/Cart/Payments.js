import React, { Fragment, useEffect, useRef} from 'react'
import './Payment.css'
import CreditCardIcon from '@material-ui/icons/CreditCard'
import EventIcon from '@material-ui/icons/Event'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import MetaData from '../layout/MetaData'
import CheckOutSteps from './CheckOutSteps'
import { Typography } from '@material-ui/core'
import {
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    useStripe,
    useElements,
}from '@stripe/react-stripe-js'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { useNavigate } from 'react-router-dom'
import { clearErrors, createOrder } from '../../actions/orderAction'

const Payments = () => {
    // const [stripeApiKey , setStripeApiKey] = useState("");


    const dispatch = useDispatch()
    const alert = useAlert();
    const elements = useElements();

    const stripe = useStripe();
    const payBtn = useRef(null);
    const navigate = useNavigate();

    const {shippingInfo,cartItems} = useSelector((state)=>state.cart)
    const {user} = useSelector((state)=> state.user);
    const {error} = useSelector((state) => state.newOrder);
    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

    const paymentData = {
        amount: Math.round(orderInfo.totalPrice * 100)
    }


    const order = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice: orderInfo.subtotal,
        taxPrice: orderInfo.tax,
        shippingPrice: orderInfo.shippingCharges,
        totalPrice: orderInfo.totalPrice
    }


    // async function getStripeApiKey(){
    //     const {data} = await axios.get("/api/v1/stripeapikey");

    //     setStripeApiKey(data.stripeApiKey);
    // }

    // getStripeApiKey();



    const submitHandler = async (e) => {
        e.preventDefault();

        payBtn.current.disabled = true;
        try {
            
            const config = {
                headers:{
                    "Content-Type": "application/json"
                }
            }

            const {data} = await axios.post("/api/v1/payment/process",paymentData,config); 

            console.log(data);

            const client_secret = data.client_secret

            if(!stripe || !elements) return;

            console.log("1");

            const result = await stripe.confirmCardPayment(client_secret,{
                payment_method:{
                    card: elements.getElement(CardNumberElement),
                    billing_details:{
                        name: user.name,
                        email: user.email,
                        address:{
                            line1: shippingInfo.address,
                            city:  shippingInfo.city,
                            state: shippingInfo.state,
                            postal_code: shippingInfo.pinCode,
                            country: shippingInfo.country 
                        }
                    }
                }
            })

            console.log(result);
            
            if(result.error){
                payBtn.current.disabled = false

                alert.error(result.error.message);
            }else{
                if(result.paymentIntent.status === "succeeded"){

                    order.paymentInfo = {
                        id: result.paymentIntent.id,
                        status: result.paymentIntent.status
                    }

                    dispatch(createOrder(order));

                    navigate('/success');
                }else{
                    alert.error("There is some issue while processing the payment")
                }
            }

        } catch (error) {
            payBtn.current.disabled = false;
            // alert.error(error.response.data.message);
            alert.error(error + "  Hey");
        }
    }

    useEffect(()=>{
        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }
    },[error,alert,dispatch])


  return (
    <Fragment>
        <MetaData title="Payment"/>
        <CheckOutSteps activeStep={2} />
        <div className='paymentContainer'>
            <form className='paymentForm' onSubmit={(e) => submitHandler(e)}>
                <Typography>Card Info</Typography>
                <div>
                    <CreditCardIcon />
                    <CardNumberElement className="paymentInput" />
                </div>
                <div>
                    <EventIcon />
                    <CardExpiryElement className="paymentInput" />
                </div>
                <div>
                    <VpnKeyIcon />
                    <CardCvcElement className="paymentInput" />
                </div>

                <input 
                    type='submit'
                    value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
                    ref={payBtn}
                    className='paymentFormBtn'
                />
            </form>
        </div>
    </Fragment>
  )
}

export default Payments