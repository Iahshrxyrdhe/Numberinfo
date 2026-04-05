const MEILI_HOST = process.env.MEILI_HOST;
const MEILI_KEY = process.env.MEILI_KEY;
const CSV_URL = process.env.CSV_URL;

async function runImport() {
  console.log("Starting import...");

  const response = await fetch(CSV_URL);
  const data = await response.text();

  const documents = data.split("\n").map((line, index) => ({
    id: index,
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

  console.log("Import done ✅");
}

module.exports = runImport;
