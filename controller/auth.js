const crypto = require("crypto");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");
exports.register = async(req, res, next) => {
    const { username, email, password } = req.body;
    try {
        const user = await User.create({
            username,
            email,
            password,
        });
        sendToken(user, 201, res);
    } catch (err) {
        next(err);
    }
    // res.send("Register router");
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorResponse("Please Provide email and password",400));
    }
    try {
        const user = await User.findOne({ email }).select("+password");    // select password and match the password through methods matchpassword
        if (!user) return next(new ErrorResponse("Invalid credentials",401 ));
        const isMatch = await user.matchPassword(password);
        if (!isMatch) return next(new ErrorResponse("Invalid credentials", 401));
        
        sendToken(user, 200, res);
    } catch (err) {
       next(err);
    }
    // res.send("Login router");
};

exports.forgotpassword = async(req, res, next) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return next(new ErrorResponse("Email could not send", 404));

        const restToken = user.getResetPasswordToken();

        await user.save();
        const resetUrl = `http:localhost:3500/passwordreset/${restToken}`;
        const message = `
         <h1>You have requested a password reset</h1>
         <p>Please go to this link to reset your passwor </p>
         <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        `
        try {
            await sendEmail({
                to: user.email,
                subject: "Password Reset Request",
                text: message
            });
            res.status(200).json({
                sucess: true,
                data: "Email Sent"
            });
        } catch (err) {
            user.resetPasswordToken = undefined;
            user.restPasswordExpire = undefined;
            await user.save();
            return next(new ErrorResponse("Email could not be send",500))
        }
    } catch (error) {
        next(error);
    }
    // res.send("Forgetpassword router");
};
exports.resetpassword = async(req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.restToken).digest("hex");
    
    try {
        const user = await User.findOne({
            resetPasswordToken,
            restPasswordExpire: { $gt: Date.now() }
        });
        if (!user) {
            return next(new ErrorResponse("Invalid Reset Token",400))
        }
        user.password = res.body.password;
        user.resetPasswordToken = undefined;
        user.restPasswordExpire = undefined;
        await user.save();
        res.status(201).json({
            success: true,
            data:"Password Reset Success"
        })
    } catch (error) {
        next(error);
    }
    res.send("Resetpassword router");
};

const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken();
    res.status(statusCode).json({
        sucess: true,
        token
    })
}