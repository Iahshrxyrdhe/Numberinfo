const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

const MEILI_HOST = process.env.MEILI_HOST;
const MEILI_KEY = process.env.MEILI_KEY;
const CSV_URL = process.env.CSV_URL;

// Import function
async function runImport() {
  const response = await fetch(CSV_URL);
  const text = await response.text();

  const lines = text.split("\n");
  const BATCH_SIZE = 100;

  for (let i = 0; i < lines.length; i += BATCH_SIZE) {
    const batch = lines.slice(i, i + BATCH_SIZE);

    const documents = batch.map((line, index) => ({
      id: i + index,
      content: line
    }));

    await fetch(`${MEILI_HOST}/indexes/numbers/documents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MEILI_KEY}`
      },
      body: JSON.stringify(documents)
    });
  }
}

// Routes
app.get("/", (req, res) => {
  res.send("Server running");
});

app.get("/import", async (req, res) => {
  try {
    await runImport();
    res.send("Import done ✅");
  } catch (err) {
    res.status(500).send("Import failed ❌");
  }
});

app.get("/search", async (req, res) => {
  const query = req.query.q;

  try {
    const response = await fetch(
      `${MEILI_HOST}/indexes/numbers/search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MEILI_KEY}`
        },
        body: JSON.stringify({ q: query })
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).send("Search failed ❌");
  }
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
