 import React, { Fragment, useEffect,useState } from 'react'
 import './Products.css'
 import { useSelector,useDispatch } from 'react-redux'
 import { clearErrors,getProduct } from '../../actions/productAction'
 import Loading from '../layout/Loading/Loading'
 import ProductCard from '../Home/ProductCard'
 import { useParams } from 'react-router-dom'
 import Pagination from 'react-js-pagination'
 import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import {useAlert} from 'react-alert'
import MetaData from '../layout/MetaData'

const categories = [
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "SmartPhones"
]
 
 const Products =  () => {

    const dispatch = useDispatch();

    const alert = useAlert();

    let {keyword} = useParams();

    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([0,25000]);
    const [category,setCategory] = useState("");
    const [ratings,setRatings] = useState(0);

    const setCurrentPageNo = async (e) =>{
        setCurrentPage(e);
    }

    const {products,loading,error,resultPerPage,filteredProductsCount} =  useSelector((state) => state.products)

    const priceHandler = (event,newPrice)=>{
        setPrice(newPrice);
    }

    useEffect( () => {
        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }
       dispatch(getProduct(keyword,currentPage,price,category,ratings));
    }, [dispatch,keyword,currentPage,price,category,ratings,alert,error])

    let count = filteredProductsCount;


   return (
     <Fragment>
        {loading ? <Loading/> : 
            <Fragment>
                <MetaData title="PRODUCTS -- ECOMMERCE"/>
                <h2 className="productsHeading">Products</h2>
                <div className='products'>
                    {products && 
                        products.map((product)=>(
                            <ProductCard key={product._id} product={product}/>
                        ))
                    }
                </div>

                {count && <div className='filterBox'>
                    <Typography>
                        Price
                    </Typography>
                    <Slider
                        value={price}
                        onChange={priceHandler}
                        valueLabelDisplay='auto'
                        aria-labelledby='range-slider'
                        min={0}
                        max={25000}
                    />
                    <Typography>Categories</Typography>
                    
                    <ul className='categoryBox'>
                        {categories.map((category)=>(
                            <li
                                className='category-link'
                                key={category}
                                onClick={()=>setCategory(category)}
                            >
                                {category}
                            </li>
                        ))}
                    </ul>

                    <fieldset>
                        <Typography component="legend">Ratings Above</Typography>
                        <Slider
                            value={ratings}
                            onChange={(e,newRating)=>{
                                setRatings(newRating);
                            }}
                            aria-labelledby='continuous-slider'
                            min = {0}
                            max = {5}
                            valueLabelDisplay='auto'
                        >
                            
                        </Slider>
                    </fieldset>

                </div>}

               {(currentPage <= Math.ceil(count/resultPerPage)) && (
                   <div className='paginationBox'>
                    {console.log(currentPage)}
                    {console.log((currentPage-1)*resultPerPage)}
                    <Pagination 
                        activePage={currentPage}
                        itemsCountPerPage={resultPerPage} 
                        onChange={ setCurrentPageNo} 
                        totalItemsCount={filteredProductsCount} 
                        nextPageText="Next" 
                        prevPageText="Prev" 
                        firstPageText="1st" 
                        lastPageText="Last" 
                        itemClass="page-item"
                        linkClass="page-link"
                        activeClass="pageItemActive" 
                        activeLinkClass-="pageLinkActive"
                    />
                    {/* {console.log(productsCount)} */}
                </div>
                 )}
            </Fragment>
        }
     </Fragment>
   )
 }
 
 export default Products