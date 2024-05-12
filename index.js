const express = require('express')
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 8000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(
  cors({
    origin: [
      "http://localhost:5173"
    ],
    credentials: true,
  })
);
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running')
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})


//   const uri = "mongodb://localhost:27017"; 
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.xygzlb8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)

    const database = client.db("BloggingVoyage");
    const itemCollection = database.collection("Blogs");
    const itemCollection2 = database.collection("wishListBlogs")
    const itemCollection3 = database.collection("comments")

    app.get('/blogs', async (req, res) => {
      const cursor = itemCollection.find()
      try {
        const result = await cursor.toArray();
        res.send(result)
      }
      catch (error) {
        console.log(error)
      }

    })

    app.get('/wishlist', async (req, res) => {
      const cursor = itemCollection2.find()
      try {
        const result = await cursor.toArray();
        res.send(result)
      }
      catch (error) {
        console.log(error)
      }

    })

    app.get('/wishlists/:id', async (req, res) => {
      
      try {
        const result = await itemCollection2.findOne({ _id: new ObjectId(req.params.id) });
        res.send(result)
      }
      catch (err) {
        console.log(err)
      }
    })

    app.get('/wishlist/:email', async (req, res) => {
      
      try {
        const result = await itemCollection2.find({ wishListersEmail: req.params.email }).toArray();
        res.send(result)
      }
      catch (err) {
        console.log(err)
      }

    })

    app.get('/comments', async (req, res) => {
      const cursor = itemCollection3.find()
      try {
        const result = await cursor.toArray();
        res.send(result)
      }
      catch (error) {
        console.log(error)
      }
      })

      app.get('/comments/:postId', async (req, res) => {
      
        try {
          const result = await itemCollection3.find({ postId: req.params.postId }).toArray();
          res.send(result)
        }
        catch (err) {
          console.log(err)
        }
  
      })

    app.post('/blogs', async (req, res) => {
      const item = req.body;
      // console.log(user, "from server")
      try {
        const result = await itemCollection.insertOne(item);
        res.send(result);
      }
      catch (err) {
        console.log(err)
      }
    });

    app.post('/wishlist', async (req, res) => {
      const item = req.body;
      // console.log(user, "from server")

      try {
        const result = await itemCollection2.insertOne(item);
        res.send(result);
      }
      catch (error) {
        console.log(error.errmsg)
      }

    });

    app.post('/comments', async (req, res) => {
      const item = req.body;
      console.log(item, "from server")
      try {
        const result = await itemCollection3.insertOne(item);
        res.send(result);
      }
      catch (err) {
        console.log(err)
      }
    });

   

   

    app.delete('/wishlists/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      try {
        const result = await itemCollection2.deleteOne(query);
        res.send(result);
      }
      catch (err) {
        console.log(err)
      }

    })



    app.get('/blogs/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await itemCollection.findOne(query);
      res.send(result);
    })

    app.delete('/blogs/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      try {
        const result = await itemCollection.deleteOne(query);
        res.send(result);
      }
      catch (err) {
        console.log(err)
      }

    })

    app.get('/blogs-cat/:category', async (req, res) => {
      console.log(req.params.category)

      try {
        const result = await itemCollection.find({ category: req.params.category }).toArray();
        res.send(result)
      }
      catch (err) {
        console.log(err)
      }

    })

    /* API to search text from title */
    app.get('/blogs-head/:title', async (req, res) => {
      const text = (req.params.title)

      try {
        const result = await itemCollection.find({ title: new RegExp(text, 'i') }).toArray();
        res.send(result)
      }
      catch (err) {
        console.log(err)
      }

    })

    app.put('/blogs/:id', async (req, res) => {
      const id = req.params.id;
      const updateData = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          ...updateData,
        },
      };
      try {
        const result = await itemCollection.updateOne(filter, updateDoc, options);
        res.send(result);
      }
      catch (err) {
        console.log(err)
      }

    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }

  finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
