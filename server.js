const express = require("express");
const { MeiliSearch } = require("meilisearch");
const { exec } = require("child_process");

const app = express();

// Environment variables
const client = new MeiliSearch({
    host: process.env.MEILI_HOST,
    apiKey: process.env.MEILI_KEY
});

const index = client.index("data");

// Home route
app.get("/", (req, res) => {
    res.send("API Running ⚡");
});

// Search API
app.get("/data", async (req, res) => {
    const query = req.query.search;

    if (!query) {
        return res.json({ error: "Use ?search=" });
    }

    try {
        const result = await index.search(query, {
            limit: 50
        });

        res.json({
            search: query,
            count: result.hits.length,
            results: result.hits
        });
    } catch (err) {
        res.json({ error: err.message });
    }
});

// 🔥 Import trigger route (no shell needed)
app.get("/import", (req, res) => {
    exec("node import.js", (err, stdout, stderr) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.send("✅ Import started...\n\n" + stdout);
    });
});

// Start server
app.listen(process.env.PORT || 3000, () => {
    console.log("🚀 Server running");
});
