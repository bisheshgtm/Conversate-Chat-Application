const asyncHandler = require("express-async-handler");
// async handler is used to handle the errors in the async functions

const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, picture } = req.body;

    if (!name || !email || !password) {
        res.status(422).json({ error: "Please add all the fields" });
    }

    // if user already exists
    const userExist = await User.findOne({ email });

    if (userExist) {
        res.status(422).json({ error: "User already exists" });
    }

    const user = await User.create({
        name,
        email,
        password,
        picture,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            picture: user.picture,
            token: generateToken(user._id),

        })
    }
    else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            picture: user.picture,
            token: generateToken(user._id),
        });

    }
    else {
        res.status(401);
        throw new Error("Invalid email or password");
    }

});

// /api/user?search=xyz => req.query.search
const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } }, // i means case insensitive
            { email: { $regex: req.query.search, $options: "i" } },
        ],
    }
        : {};

    // $ne means not equal to 
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }); // req.user._id is the id of the user who is logged in
    res.send(users);
});

module.exports = { registerUser, authUser, allUsers }; 