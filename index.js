const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors({
    origin: "*",
}));
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ymuyr.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('CleanCo').collection('service');
        /* 
        get/get-service=>all data
        post/add-service=> create new data
        put/update-service => modify a data on collection
        delete/delete-service=> delete a data from collection
        */

        app.get('/get-service', async (req, res) => {
            const services = await serviceCollection.find({}).toArray();

            res.send(services)

        })

        //post
        app.post('/add-service', async (req, res) => {
            const data = req.body;
            const result = await serviceCollection.insertOne(data);
            res.send(result)
        })

        //put
        app.put('/update-service/:id', async (req, res) => {
            const { id } = req.params;
            const data = req.body;
            const filter = { _id: ObjectId(id) };
            const updateDoc = { $set: data };
            const option = { upsert: true };

            const result = await serviceCollection.updateOne(filter, updateDoc, option);
            res.send(result);
        });

        //delete
        app.delete('/delete-service/:id', async (req, res) => {
            const { id } = req.params;

            const query = { _id: ObjectId(id) };

            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        });
    }
    finally {

    }
}

run().catch(console.dir);

//Body
app.get('/dummy-route/user2', async (req, res) => {
    const data = req.body;


    res.json(data)
})

//Query
app.get('/dummy-route/user', async (req, res) => {
    const data = req.query;


    res.json(data)
})

//params
app.get('/dummy-route/user/:id', async (req, res) => {
    const { id } = req.params;

    console.log(id)
    res.json(id)
})

app.get('/', async (req, res) => {
    res.send('Cleaning Pro Service')
})

app.listen(port, () => {
    console.log('cleaning service port is running', port)
});

