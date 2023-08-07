const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require('../models/userModel'); 
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const cloudinary = require('cloudinary');
const { ADDRGETNETWORKPARAMS } = require("dns");

//Register a user
exports.registerUser = catchAsyncErrors(async(req,res,next)=>{

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });

    const {name,email,password} = req.body

    const user = await User.create({
        name,email,password,
        avatar:{
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    });

    sendToken(user,201,res);
})

//To login 
exports.loginUser = catchAsyncErrors( async (req,res,next) => {

    const {email, password} = req.body

    //checking whether both are given by user
    if(!email || !password){
        return next(new ErrorHandler("Please enter Email and Password",400));
    }

    const user = await User.findOne({email}).select("+password"); //Here we are using select method because by default we have given password attribute as false when we defined user model. Hence the syntax

    if(!user){
        return next(new ErrorHandler("Invalid Email or Password" , 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password" , 401));
    }

    sendToken(user,200,res);
}) 

//Logout User
exports.logoutUser = catchAsyncErrors(async (req,res,next) => {

    res.cookie('token',null,{
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "Logged Out successfully"
    })
})

//forgot Password 
exports.forgotPassword = catchAsyncErrors(async ( req,res,next)=>{
    const user = await User.findOne({email : req.body.email});
    if(!user){
        return next(new ErrorHandler("User Not found", 404));
    }

    //Get Reset Password Token
    const resetToken = await user.getResetPasswordToken();

    await user.save({validateBeforeSave: false});
    
    // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`
    
    const message = `Your Password reset token is temp:- \n\n ${resetPasswordUrl} \n\n If you have not requested this email, then please ignore it`;
    
    try{
        
        await sendEmail({
            email: user.email,
            subject: `Ecommerce Password Recovery`,
            message
        })

        res.status(200).json({
            success: true,
            message: `Email Sent to ${user.email} successfully`
        })

    }catch(err){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave: false});

        return next(new ErrorHandler(err.message , 500));
    }
})

//reset Password
exports.resetPassword = catchAsyncErrors(async ( req,res,next)=>{
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()}
    })

    if(!user){
        return next(new ErrorHandler("Reset Password token is invalid or has been expired",400));
    }
    
    if(req.body.password!=req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match",400));
    }

    user.password = req.body.password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save();
    
    sendToken(user,200,res);
})

//get user details
exports.getUserDetails = catchAsyncErrors(async (req,res,next)=>{

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })

})

// update password
exports.updatePassword = catchAsyncErrors(async (req,res,next)=>{

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old Password is incorrect",400));
    }
    
    if(req.body.newPassword!=req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match",400));
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user,200,res);
})

//update profile
exports.updateProfile = catchAsyncErrors(async(req,res,next)=>{

    const newUserData = {
        email: req.body.email,
        name: req.body.name
    }

    if(req.body.avatar !== ""){
        const user = await User.findById(req.user.id);

        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder: "avatars",
            width: 150,
            crop: "scale"
        })

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    }

    await User.findByIdAndUpdate(req.user.id,newUserData,{
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })

})

//Get all users -> ADmin
exports.getAllUsers = catchAsyncErrors(async (req,res,next)=>{

    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })

})

//Get Single User details -> admin
exports.getSingleUser = catchAsyncErrors(async (req,res,next)=>{

    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`,400));
    }


    res.status(200).json({
        success: true,
        user
    })

})

//update user role --> Admin
exports.updateRole = catchAsyncErrors(async (req,res,next)=>{
    
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }
    
    let user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not exist with ${req.params.id}`,400));
    }
    
    user = await User.findByIdAndUpdate(req.params.id,newUserData,{
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    
    res.status(200).json({
        success: true
    })
    
})

//Delete a User --> Admin
exports.deleteUser = catchAsyncErrors(async (req,res,next)=>{

    const user = await User.findById(req.params.id);
    
    if(!user){
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`,400));
    }

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: "User Deleted successfully"
    })
})

