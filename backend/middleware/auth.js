const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('./catchAsyncErrors')
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.isAuthenticatedUser = catchAsyncErrors( async (req,res,next) => {

    const {token} = req.cookies;

    if(!token){
        return next(new ErrorHandler("Please Login first to access this resource ", 401));
    }

    const decodedData = jwt.verify(token , process.env.JWT_SECRET);
    console.log(decodedData);

    req.user = await User.findById(decodedData.id);

    next();
})

exports.authorizRoles = (...roles) =>{
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`${req.user.role} is not allowed to acces this resource`, 403));
        }
        next();
    }

}