const MEILI_HOST = process.env.MEILI_HOST;
const MEILI_KEY = process.env.MEILI_KEY;
const CSV_URL = process.env.CSV_URL;

async function runImport() {
  console.log("Starting import...");

  const response = await fetch(CSV_URL);
  const text = await response.text();

  const lines = text.split("\n");

  const BATCH_SIZE = 100; // small chunks

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

    console.log(`Imported batch ${i} - ${i + BATCH_SIZE}`);
  }

  console.log("Import completed ✅");
}

module.exports = runImport;
