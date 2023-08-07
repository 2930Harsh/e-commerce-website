import React, { Fragment } from 'react'
import './Cart.css'
import CartItemCard from './CartItemCard.js'
import { useDispatch, useSelector } from 'react-redux'
import { addItemsToCart, removeItemsFromCart } from '../../actions/cartActions'
import { Typography } from '@material-ui/core'
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import MetaData from '../layout/MetaData'

const Cart = () => {

    const dispatch = useDispatch();
    const { cartItems } = useSelector((state) => state.cart);
    const navigate = useNavigate();

    const increaseQauntity = (id, quantity, stock) => {
        const newQty = quantity + 1;
        if (stock <= quantity) {
            return;
        }
        dispatch(addItemsToCart(id, newQty));
    }

    const decreaseQauntity = (id, quantity) => {
        const newQty = quantity - 1;
        if (1 >= quantity) {
            return;
        }
        dispatch(addItemsToCart(id, newQty));
    }

    const deleteCartItems = (id) => {
        dispatch(removeItemsFromCart(id));
    }

    const checkOutHandler = () => {
        navigate('/login?redirect=shipping');
    }


    return (
        <Fragment>
            {cartItems.length !== 0 ?
                <Fragment>
                    <MetaData title = "CART -- ECOMMERCE" />
                    <div className='cartPage'>
                        <div className='cartHeader'>
                            <p>Product</p>
                            <p>Quantity</p>
                            <p>Subtotal</p>
                        </div>
                        {cartItems && cartItems.map((item) => (
                            <div className='cartContainer' key={item.product}>
                                <CartItemCard item={item} deleteCartItems={deleteCartItems} />
                                <div className='cartInput'>
                                    <button onClick={() => decreaseQauntity(item.product, item.quantity)}>-</button>
                                    <input type='number' readOnly value={item.quantity} />
                                    <button onClick={() => increaseQauntity(item.product, item.quantity, item.stock)}>+</button>
                                </div>
                                <p className='cartSubtotal'>{`₹ ${item.price * item.quantity}`}</p>
                            </div>
                        ))}


                        <div className='cartGrossTotal'>
                            <div></div>
                            <div className='cartGrossTotalBox'>
                                <p>Gross Total</p>
                                <p>{`₹${cartItems.reduce(
                                    (acc,item) => acc + item.quantity * item.price,
                                    0
                                )}`}</p>
                            </div>
                            <div></div>
                            <div className='checkOutBtn'>
                                <button onClick={checkOutHandler}>Check Out</button>
                            </div>
                        </div>
                    </div>
                </Fragment>
                :
                (
                    <div className='emptyCart'>
                        <RemoveShoppingCartIcon />
                        <Typography>No Product In Your Cart</Typography>
                        <Link to='/products'>View Products</Link>
                    </div>
                )
            }
        </Fragment>
    )
}

export default Cart