const express = require("express");
const { MeiliSearch } = require("meilisearch");

const app = express();

// Environment variables (Render pe set karna)
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

// Start server
app.listen(process.env.PORT || 3000, () => {
    console.log("🚀 Server running");
});
