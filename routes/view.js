const express = require("express");
const router = express.Router();

const {
    renderHome,
    handleGenerateShortURLView
} = require("../controllers/view");

router.get("/", renderHome);
router.post("/", handleGenerateShortURLView);

const { renderAnalytics } = require("../controllers/view");

router.get("/analytics/:shortId", renderAnalytics);

module.exports = router;