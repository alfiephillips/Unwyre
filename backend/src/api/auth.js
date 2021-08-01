const express = require('express');
const User = require("../models/User")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const dotenv = require("dotenv").config()

const auth = require("../middleware/auth")

const router = express.Router();

router.get("/@me", auth, async (req, res) => {
    const currentUserId = req.userId;
    let currentUser;

    try {
        currentUser = await User.findOneById(currentUserId);
    } catch (err) {
        return res.status(500).json({
            path: req.originalUrl,
            message: "Internal Server Error",
            stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
        })
    }

    return res.status(200).json({
        user: currentUser,
    })
})

router.post("/register", async (req, res) => {
    const {username, email, password} = req.body;
    let newUser;

    const existingUserByUsername = User.exists({username: username})
    const existingUserByEmail = User.exists({email: email})

    if (existingUserByUsername) {
        return res.status(400).json({
            path: req.originalUrl,
            message: "A User with that username already exists.",
        })
    }

    if (existingUserByEmail) {
        return res.status(400).json({
            path: req.originalUrl,
            message: "A User with that email already exists.",
        })
    }

    if (username.length < 3) {
        return res.status(400).json({
            path: req.originalUrl,
            message: "Username length must be greater than 3 characters."
        })
    }

    if (username.length > 20) {
        return res.status(400).json({
            path: req.originalUrl,
            message: "Username length must be less than 20 characters."
        })
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({
            path: req.originalUrl,
            message: "Invalid email"
        })
    }

    const salt = await bcrypt.genSalt(10;)
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        newUser = await User.create({
            username: username,
            email: email,
            password: hashedPassword
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({
              path: req.originalUrl,
              message: "Internal Server Error",
              stack:  process.env.NODE_ENV === "production" ? "🥞" : err.stack,
          })
    }

    const token = jwt.sign({
        id: newUser._id,
        username: newUser.username,
        password: newUser.password,
        urls: newUser.urls
    }, process.env.SESSION_SECRET, {
        expiresIn: "8h"
    })

    return res.status(200).json({
        message: "User created.",
        token: token
    })
})

module.exports = router;

