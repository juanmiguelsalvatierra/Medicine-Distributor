require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGO_URI;

async function run() {
    try {
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });

        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("✅ Erfolgreich mit MongoDB verbunden!");

        await client.close();
    } catch (err) {
        console.error("❌ Verbindungsfehler:", err);
    }
}

run();
