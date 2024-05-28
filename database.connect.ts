import {MongoClient, ServerApiVersion} from "mongodb";

const uri = 'mongodb+srv://thuong_mai_dien_tu:123@atlascluster.bgh4mht.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster';
const database = 'Ban_Xe_Dap';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db(database).command({ping: 1});
    } finally {
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
}

async function close() {
    await client.close();
}

async function getAll() {
    return await client.db(database).collection('xe_dap').find().toArray();
}

export {run, close, getAll};

