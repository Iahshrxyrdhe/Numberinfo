const express = require("express");
const app = express();

const runImport = require("./import");

app.get("/", (req, res) => {
  res.send("Server running");
});

app.get("/import", async (req, res) => {
  try {
    await runImport();
    res.send("Import completed ✅");
  } catch (err) {
    console.error(err);
    res.status(500).send("Import failed ❌");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
