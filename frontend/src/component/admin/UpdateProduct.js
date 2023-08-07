import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, updateProduct, getProductDetails } from "../../actions/productAction";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import DescriptionIcon from "@material-ui/icons/Description";
import StorageIcon from "@material-ui/icons/Storage";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import { UPDATE_PRODUCT_RESET } from "../../constants/productConstants";
import Sidebar from "./Sidebar";
import { useNavigate, useParams } from "react-router-dom";

const UpdateProduct = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const alert = useAlert();
    const {id} = useParams();

    const {error,product} = useSelector((state)=>state.productDetails);
    const {loading ,error:updateError ,isUpdated} = useSelector((state)=> state.product);

    const [name,setName] = useState("");
    const [price,setPrice] = useState(0);
    const [description,setDescription] = useState("");
    const [category,setCategory] = useState("");
    const [stock , setStock] = useState(0);
    const [images,setImages] = useState([]);
    const [oldImages,setOldImages] = useState([]);
    const [imagesPreview,setImagesPreview] = useState([]);

const categories = [   
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "SmartPhones"
]

const productId = id;

useEffect(()=>{

    if(product && product._id !== productId){
        dispatch(getProductDetails(productId));
    }
    else{
        setName(product.name);
        setDescription(product.description);
        setCategory(product.category);
        setStock(product.stock);
        setPrice(product.price);
        setOldImages(product.images);
    }

    if(error){
        console.log(error);
        alert.error(error);
        dispatch(clearErrors());
    }
    if(updateError){
        console.log(error);
        alert.error(updateError);
        dispatch(clearErrors());
    }

    console.log("5");
    if(isUpdated){
        console.log("6");
        alert.success("Product Updated Successfully");
        navigate('/admin/products');
        dispatch({
            type: UPDATE_PRODUCT_RESET
        })
    }
},[dispatch ,error ,alert,navigate , isUpdated ,product, productId,updateError ]);
    

const updateProductSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name",name);
    myForm.set("price",price);
    myForm.set("description",description);
    myForm.set("stock",stock);
    myForm.set("category",category);

    images.forEach((image)=> (
        myForm.append("images",image)
    ))

    dispatch(updateProduct(productId,myForm));
    console.log("2");

}

const updateProductImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);
    setOldImages([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <Fragment>
        <MetaData title={`Create Product`}/>
        <div className="dashboard">
            <Sidebar />
            <div className="newProductContainer" >
                <form 
                    className="createProductForm"
                    encType="multipart/form-data"
                    onSubmit={updateProductSubmitHandler}
                >
                    <h1>Create Product</h1>
                    <div>
                        <SpellcheckIcon />
                        <input 
                            type="text"
                            placeholder="Product Name"
                            required
                            value={name}
                            onChange={(e)=>setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <AttachMoneyIcon />
                        <input
                            type="number"
                            placeholder="Price"
                            required
                            value={price}
                            onChange={(e)=>setPrice(e.target.value)}
                        />
                    </div>
                    <div>
                        <DescriptionIcon />
                        <textarea
                            placeholder="Product Description"
                            value={description}
                            onChange={(e)=>setDescription(e.target.value)}
                            cols={`30`}
                            rows={`1`}
                        ></textarea>
                    </div>
                    <div>
                        <AccountTreeIcon />
                        <select value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="">Choose Category</option>
                            {categories.map((ctgr)=>(
                                <option key={ctgr} value={ctgr}>
                                    {ctgr}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <StorageIcon />
                        <input 
                            type="number"
                            placeholder="Stock"
                            required
                            onChange={(e)=>setStock(e.target.value)}
                            value={stock}
                        />
                    </div>
                    <div id="createProductFormFile">
                        <input 
                            type="file"
                            name="avatar"
                            accept="image/*"
                            multiple
                            onChange={updateProductImagesChange}
                        />
                    </div>
                    <div id="createProductFormImage">
                        {oldImages && oldImages.map((image,index)=>(
                            <img key={index} src={image.url} alt="Old Product Preview" />
                        ))}
                    </div>
                    <div id="createProductFormImage">
                        {imagesPreview.map((image,index)=>(
                            <img key={index} src={image} alt="Product Preview" />
                        ))}
                    </div>
                    <Button
                        id="createProductBtn"
                        type="submit"
                        disabled= {loading ? true : false}
                    >Create Product</Button>
                </form>
            </div>
         </div>
    </Fragment>
  )
}

export default UpdateProduct