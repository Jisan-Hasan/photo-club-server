const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lxf9vua.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



app.get("/", (req, res) => {
    res.send("Server is responding");
});


async function run(){
    try{
        const serviceCollection = client.db('photoClub').collection('services');


        app.post('/addservice', async(req,res) => {
            const service = req.body;
            // console.log(service);
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        })
    } finally{}
}

run().catch(e => console.log(e));


app.listen(port, () => {
    console.log("Server is running on port: ", port);
});
