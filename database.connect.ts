import {MongoClient, ServerApiVersion} from "mongodb";

const uri = 'mongodb+srv://thuong_mai_dien_tu:123@atlascluster.bgh4mht.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster';
const database = 'Ban_Xe_Dap';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: false, // đặt false để cho phép sử dụng các truy vấn không được hỗ trợ, vd: như distinct
        deprecationErrors: true,
    }
});

async function startDatabase() {
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db(database).command({ping: 1}).then(() => {
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
        }
    ).catch(() => {
        console.log("Failed to ping your deployment. Please check your connection details.");
    });
}

async function close() {
    await client.close();
}

const connection = client.db(database);


export {startDatabase, close, connection};

