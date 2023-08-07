const express = require('express');
const { getAllProducts , createProduct, updateProduct, deleteProduct, getProductDetails, createNewReview, getAllReviews, deleteReview, getAdminProducts} = require('../controllers/productController');
const { isAuthenticatedUser , authorizRoles } = require('../middleware/auth');
const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/admin/product/new").post(isAuthenticatedUser,authorizRoles("admin"),createProduct);
router.route("/admin/product/:id")
.put(isAuthenticatedUser, authorizRoles("admin"),updateProduct)
.delete(isAuthenticatedUser,authorizRoles("admin"), deleteProduct)
.get(getProductDetails);


router.route("/admin/products").get(isAuthenticatedUser,authorizRoles("admin"),getAdminProducts)

router.route("/product/:id").get(getProductDetails);

router.route("/review").put(isAuthenticatedUser,createNewReview)

router.route("/reviews").get(getAllReviews).delete(isAuthenticatedUser,deleteReview) 
module.exports = router;