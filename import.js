const axios = require("axios");
const csv = require("csv-parser");
const fs = require("fs");
const { MeiliSearch } = require("meilisearch");

const client = new MeiliSearch({
    host: process.env.MEILI_HOST,
    apiKey: process.env.MEILI_KEY
});

const index = client.index("data");

async function downloadCSV() {
    const writer = fs.createWriteStream("data.csv");

    const response = await axios({
        url: process.env.CSV_URL,
        method: "GET",
        responseType: "stream"
    });

    response.data.pipe(writer);

    return new Promise((resolve) => {
        writer.on("finish", resolve);
    });
}

async function run() {
    await downloadCSV();

    const records = [];

    fs.createReadStream("data.csv")
        .pipe(csv())
        .on("data", (row) => {
            const text = Object.values(row).join(" ");
            records.push({ id: records.length + 1, text });
        })
        .on("end", async () => {
            await index.addDocuments(records);
            console.log("✅ Data uploaded to Meilisearch");
        });
}

run();
