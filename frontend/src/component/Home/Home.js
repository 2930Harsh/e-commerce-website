import React, {Fragment, useEffect} from 'react';
import './Home.css'
import MetaData from '../layout/MetaData'
import { clearErrors, getProduct } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loading from '../layout/Loading/Loading';
import { useAlert } from 'react-alert';
import ProductCard from './ProductCard.js';


const Home = () =>{

    const alert = useAlert()
    const dispatch = useDispatch();

    const { loading, error, products} = useSelector(
        (state) => state.products
    );

    useEffect (() => {

        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }

        dispatch (getProduct());
    }, [dispatch,error,alert]);

    return (<Fragment>
        {loading ? <Loading/> : <Fragment>
        <MetaData title="ECOMMERCE"/>
        <div className='banner'>
            <p>Welcome To Ecommerce.</p>
            <h1>Find Amazing Products Below.</h1>

            <a href='#container'>
                <button>
                    Scroll 
                </button>
            </a>

        </div>
        <h2 className='homeHeading'>Featured Products</h2>

        <div className='container' id='container'>
        {products && products.map((product) => <ProductCard product={product} key={product._id}/>)}
        </div>
        </Fragment>}
        

    </Fragment>)
}

export default Home