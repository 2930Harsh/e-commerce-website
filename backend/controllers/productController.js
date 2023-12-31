const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require('cloudinary')

//create a product --> Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {

    let images = [];

    if (typeof req.body.images === 'string') {
        images.push(req.body.images);
    }
    else {
        images = req.body.images
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {

        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }

    req.body.images = imagesLinks

    req.body.user = req.user.id

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
});

//Update Product --> Admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    //Images Start Here
    let images = [];

    if (typeof req.body.images === 'string') {
        images.push(req.body.images);
    }
    else {
        images = req.body.images
    }

    if (images !== undefined) {
        //Deleting Cloudinary Images
        for (let i = 0; i < product.images.length; i++) {
            const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }
        const imagesLinks = [];
    
        for (let i = 0; i < images.length; i++) {
    
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
            });
    
            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        } 

        req.body.images = imagesLinks 
    }


    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        product
    })
})

//Delete a product --> ADMIN
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {


    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    //Deleting Cloudinary Images
    for (let i = 0; i < product.images.length; i++) {

        const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    product = await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        product
    })

})

//Get all products
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {

    const resultPerPage = 8
    const productsCount = await Product.countDocuments();

    const apiFeatures = new ApiFeatures(Product.find(), req.query).search().filter();
    let products = await apiFeatures.query;
    let filteredProductsCount = products.length

    const apiFeatures2 = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage);
    products = await apiFeatures2.query;


    res.status(200).json({
        success: true,
        products,
        resultPerPage,
        productsCount,
        filteredProductsCount
    });

})

//get all products(admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {

    const products = await Product.find();

    res.status(200).json({
        success: true,
        products,
    });

})


//Get Proudcut Details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    console.log(product);

    res.status(200).json({
        success: true,
        product,
    })

})

//create new review or update the existing one
exports.createNewReview = catchAsyncErrors(async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(rev => rev.user.toString() === req.user._id.toString());

    if (isReviewed) {
        product.reviews.forEach(rev => {
            if (rev.user.toString() === req.user._id.toString()) {
                rev.rating = rating,
                    rev.comment = comment
            }
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }

    let avg = 0;

    product.reviews.forEach(rev => avg += rev.rating);

    product.ratings = avg / product.reviews.length

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    })

})

//get all reviews of a product
exports.getAllReviews = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.query.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    // console.log(product.reviews);

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})

//Delete a review of a product
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    const reviews = product.reviews.filter(
        rev => (rev._id.toString() !== req.query.id.toString()
        ))

    let avg = 0;

    reviews.forEach(rev => avg += rev.rating);

    let ratings  = 0;
    if(reviews.length !== 0){
        ratings = avg / reviews.length
    }

    const numOfReviews = reviews.length

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
    })
})
