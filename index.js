const express = require('express');
const app = express();

const urlRoutes = require('./routes/url');
const { connectDB } = require("./connection");
const URL = require("./models/url");
const { handleGenerateShortURLView } = require("./controllers/view"); 

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// EJS setup
app.set("view engine", "ejs");
app.set("views", "./views");

// API routes
app.use('/url', urlRoutes);

// UI routes
app.get("/", (req, res) => {
    res.render("home");
});

app.post("/", handleGenerateShortURLView);

app.get("/:shortId", async (req, res) => {
    try {
        const shortId = req.params.shortId;

        const entry = await URL.findOneAndUpdate(
            { shortId },
            {
                $push: {
                    visitHistory: {
                        timestamp: Date.now(),
                    }
                }
            },
            { new: true }
        );

        if (!entry) {
            return res.status(404).send("URL not found");
        }

        res.redirect(entry.redirectURL);

    } catch (err) {
        res.status(500).send("Server Error");
    }
});

const PORT = 8000;

// connect DB 
connectDB("mongodb://127.0.0.1:27017/short-url")
.then(() => {
    console.log("Connected to DB");

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch((err) => {
    console.log("Error connecting to DB", err);
    process.exit(1);
});