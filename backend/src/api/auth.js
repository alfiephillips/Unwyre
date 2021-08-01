const express = require('express');

const router = express.Router();

router.get("/@me", async (req, res) => {
    return res.status(200).json({
        message: "Current user!"
    })
})