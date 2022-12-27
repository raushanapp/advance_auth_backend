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
        res.status(201).json({
            success: true,
            user
        });
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
        if (!isMatch) return next(new ErrorResponse("Invalid credentials",401));

        res.status(200).json({success:true,token:"fdhjfa123snb"})
    } catch (err) {
       next(err);
    }
    // res.send("Login router");
};

exports.forgotpassword = (req, res, next) => {
    res.send("Forgetpassword router");
};
exports.resetpassword = (req, res, next) => {
    res.send("Resetpassword router");
};