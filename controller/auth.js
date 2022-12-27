const User = require("../models/User");
const ErrorResponse=require("../utils/errorResponse")
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
        
    } catch (error) {
        
    }
    res.send("Forgetpassword router");
};
exports.resetpassword = (req, res, next) => {
    res.send("Resetpassword router");
};

const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken();
    res.status(statusCode).json({
        sucess: true,
        token
    })
}