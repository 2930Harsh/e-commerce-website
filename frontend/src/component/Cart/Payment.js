import React, { useState } from 'react'
import './Payment.css'
import { Elements } from '@stripe/react-stripe-js'
import axios from 'axios'
import { loadStripe } from '@stripe/stripe-js'
import Payments from './Payments'

const Payment = () => {

    const [stripeApiKey , setStripeApiKey] = useState("");

    async function getStripeApiKey(){
        const {data} = await axios.get("/api/v1/stripeapikey");

        setStripeApiKey(data.stripeApiKey);
    }

    getStripeApiKey();

  return (
        <Elements stripe={loadStripe(stripeApiKey)}>
            <Payments />
        </Elements>
  )
}

export default Payment