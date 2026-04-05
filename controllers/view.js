const { nanoid } = require("nanoid");
const URL = require("../models/url");

async function renderHome(req, res) {
    return res.render("home");
}

async function handleGenerateShortURLView(req, res) {
    const body = req.body;

    if (!body.url) {
        return res.render("home", { error: "URL is required" });
    }

    const shortID = nanoid(6);

    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visitHistory: [],
    });

   const baseURL = req.protocol + "://" + req.get("host");

return res.render("result", {
    shortUrl: `${baseURL}/${shortID}`
});
}

async function renderAnalytics(req, res) {
    const shortId = req.params.shortId;

    const result = await URL.findOne({ shortId });

    if (!result) {
        return res.send("URL not found");
    }

    return res.render("analytics", {
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
}

module.exports = {
    renderHome,
    handleGenerateShortURLView,
    renderAnalytics
};