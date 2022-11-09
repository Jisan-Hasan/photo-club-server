const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lxf9vua.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

app.get("/", (req, res) => {
    res.send("Server is responding");
});

async function run() {
    try {
        const serviceCollection = client.db("photoClub").collection("services");
        const reviewCollection = client.db("photoClub").collection("reviews");

        app.post("/addservice", async (req, res) => {
            const service = req.body;
            // console.log(service);
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        });

        app.get("/service", async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query).limit(3);
            const result = await cursor.toArray();
            res.send(result);
        });
        app.get("/allservices", async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });
        app.get("/service/:id", async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.findOne(query);
            res.send(result);
        });

        // add review
        app.post("/addreview", async (req, res) => {
            const reviewInfo = req.body;
            // console.log(reviewInfo);
            const result = await reviewCollection.insertOne(reviewInfo);
            res.send(result);
        });

        // show review
        app.get("/reviews/:id", async (req, res) => {
            const id = req.params.id;
            const query = { serviceId: id };
            const cursor = reviewCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });
        app.get("/myreviews/:id", async (req, res) => {
            const id = req.params.id;
            const query = { reviewerId: id };
            const cursor = reviewCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        // Delete review by id
        app.delete("/myreviews/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        });
    } finally {
    }
}

run().catch((e) => console.log(e));

app.listen(port, () => {
    console.log("Server is running on port: ", port);
});
