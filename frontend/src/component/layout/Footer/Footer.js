import React from 'react'
import playStore from '../../../images/playstore.png'
import appStore from '../../../images/Appstore.png'
import './Footer.css'

const Footer = () =>{
    return (
       <footer id='footer'>
        <div className='leftFooter'>
            <h4>Download Our App.</h4>
            <p>Download App for Android and IOS</p>
            <img src={playStore} alt='playstore' />
            <img src={appStore} alt='AppStore' />
        </div>
        <div className='midFooter'>
            <h1>ECOMMERCE</h1>
            <p>High Quality is Our first priority</p>
 
            <p>Copyrights 2021 &copy; HarshGarg</p>
        </div>
        <div className='rightFooter'>
            <h4>Follow Us.</h4>
            <a href='http://instagram.com/2930harsh'>Instagram</a>
            <a href='http://instagram.com/2930harsh'>Facebook</a>
            <a href='http://instagram.com/2930harsh'>Whatsapp</a>
        </div>
       </footer>
    )
}

export default Footer