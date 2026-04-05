const express = require('express');
const { handleGenerateShortURL,handleAnalytics } = require('../controllers/url');
const router = express.Router();

router.post("/", handleGenerateShortURL);

router.get("/analytics/:shortId", handleAnalytics);

module.exports = router;