import express from "express";
import cors from "cors";
import {getAll, run} from "./database.connect";

run().catch(() => {
    console.log("Failed to connect to MongoDB")
});

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/all", (req, res) => {
    getAll().then((data) => {
        res.send(data);
    }).catch(() => {
        res.send("Failed to get data");
    });
});

app.listen(1305, () => {
    console.log("Server dep zai da chay o port 1305");
});