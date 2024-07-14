import express, {Express} from "express";
import cors from "cors";
import {startDatabase} from "./database.connect";
import {runAuthController} from "./controller/auth.controller";
import {runProductController} from "./controller/product.controller";
import bodyParser = require("body-parser");
import {runReviewController} from "./controller/review.controller";
import {runPayController} from "./controller/pay.controller";
import {runUserController} from "./controller/user.controller";

export const log = (tag: string, title: string, body: object) => {
    console.log(`=================================${tag}==================================`)
    console.log("title: ", title)
    console.log("body: ", body)
}

const runService = (app: Express) => {
    runProductController(app);
    runAuthController(app);
    runPayController(app);
    runUserController(app);
    runReviewController(app);
}


const runServer = () => {
    startDatabase().catch(() => {
        console.log("Failed to connect to MongoDB")
    });

    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.get("/", (req, res) => {
        res.send("Hello World");
    });

    app.listen(1305, () => {
        console.log("Server dep zai da chay o port 1305");
    });

    runService(app);
}


runServer();