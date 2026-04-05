const { nanoid } = require("nanoid");
const URL = require("../models/url");

async function handleGenerateShortURL(req, res) {
    const body = req.body;

    if (!body.url) {
        return res.status(400).json({
            error: "URL is required"
        });
    }

    const shortID = nanoid(6);

    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visitHistory: [],
    });

   const baseURL = req.protocol + "://" + req.get("host");

return res.json({
    shortUrl: `${baseURL}/${shortID}`
});
}

async function handleAnalytics(req, res) {
    const shortId = req.params.shortId;

    const result = await URL.findOne({ shortId });

    if (!result) {
        return res.status(404).json({
            error: "URL not found"
        });
    }

    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
}

module.exports = {
    handleGenerateShortURL,
    handleAnalytics
};