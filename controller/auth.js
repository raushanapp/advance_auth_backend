const User = require("../models/User");

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
        res.status(500).json({
            success: false,
            err: err.message
        });
    }
    // res.send("Register router");
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({
            success: false,
            error:"Please Provide email and password"
        })
    }
    try {
        const user = await User.findOne({ email }).select("+password");    // select password and match the password through methods matchpassword
        if (!user) send.status(404).json({ success: false, error: "Invalid credentials" });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) send.status(404).json({ success: false, error: "Invalid credentials" });

        res.status(200).json({success:true,token:"fdhjfa123snb"})
    } catch (err) {
        res.status(500).json({ success: false, err: err.message });
    }
    res.send("Login router");
};

exports.forgotpassword = (req, res, next) => {
    res.send("Forgetpassword router");
};
exports.resetpassword = (req, res, next) => {
    res.send("Resetpassword router");
};