const express = require("express")
const router = express.Router();
const User = require("../models/User");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticationToken } = require("../utilities");


router.post("/register", async (req, res) => {
    // get all data from body/ params(if data is in url)
    const { fullname, email, password } = req.body
    try {
        // all data should exists
        if (!(fullname && email && password)) {
            // always use return while sending error otherwise server try to send below response as well which crash it 
            return res.status(400).json({ error: true, message: "All fields are compulsary" });
        }

        // check if user already exists
        const userCheck = await User.findOne({ email });
        if (userCheck) {
            return res.status(401).json({ error: true, message: "User with this email already exists" });
        }

        // encrypt the password. it autogenrate salt and encrypt it by performing some round on in
        const encryptPass = await bycrypt.hash(password, 10); // 10 => number of round

        // save the user into the database
        const user = await User.create({
            fullname,
            email,
            password: encryptPass,
        })

        // genrate a token and send it
        const token = jwt.sign({ id: user._id }, "1dsad3232rfkfuy429u4udy3iiufasdb49039hufbfayggj", {
            expiresIn: "2d"
        })

        user.password = undefined;

        return res.status(200).json({ error: false, token, user, message: "Registration successfull" });

    } catch (err) {
        console.log(err);
        await User.deleteOne({ email });
        return res.status(501).json({ error: true, message: "Internal server error" });
    }
})

router.post("/login", async (req, res) => {
    try {
        // get all data from frontend
        const { email, password } = req.body;
        // validation
        if (!(email && password)) {
            return res.status(400).json({ error: true, message: "All fields are compulsory to send" });
        }
        // find user in DB
        const user = await User.findOne({ email });
        // console.log(email);
        // console.log(user);
        // match the password if user exists
        if (!user) {
            return res.status(401).json({ error: true, message: "User doesn't found" })
        }

        if (user.email === email) {
            if (bycrypt.compare(password, user.password)) {

                const token = jwt.sign({
                    id: user._id
                }, "1dsad3232rfkfuy429u4udy3iiufasdb49039hufbfayggj", {
                    expiresIn: "2d"
                })

                // cookies manage of user
                const options = {
                    expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // create obj of date (curr date + after how many days you want to expire it + number of hours in daya + number of minute in hour + number of sec in min + number of millisec in sec)
                    httpOnly: true,// only server can manipulate cookie not manipulate by user though browers
                }

                // console.log(token);

                // want to send?              // name of cookie in cookies token
                return res.status(200).cookie("token", token, options).json({
                    error: false,
                    message: "Login Successfully",
                    email,
                    token
                })
            }
            else {
                return res.status(400).json({
                    error: true,
                    message: "Invalid Credentials"
                })
            }
        }
        else {
            return res.status(400).json({
                error: true,
                message: "Invalid Credentials"
            })
        }

    } catch (error) {
        // console.log(error);
        return res.status(501).json({ error: true, message: "Internal Server Error" });
    }
})

router.get("/get-user", authenticationToken, async (req, res) => {
    const user = req.user;

    const isUser = await User.findOne({ _id: user._id });

    if (!isUser) {
        return res.sendStatus(401);
    }

    return res.status(200).json({
        error: false,
        user: {
            fullname: isUser.fullname,
            email: isUser.email,
            "_id": isUser._id,
            createdOn: isUser.createdOn
        },
        message: "Fetched successfully"
    })
})

router.get("/logout", (req, res) => {
    try {
        // when we click on the logout button our cookies get null and we use window reload method in frontend(in logout section) due to user get logout
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        })
        res.status(201).json({
            success: true,
            message: "Log out successful!",
        });
    } catch (error) {
        return res.status(501).json({ error: true, message: "Internal Server Error" });
    }
})

module.exports = router;