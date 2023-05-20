const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app=express();
const port=process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tefm3zp.mongodb.net/?retryWrites=true&w=majority`;


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
    // await client.connect();

    const toysCollection=client.db('toysDB').collection('toys')
const limit=20
   app.get('/alltoys',async(req,res)=>{
    const cursor=toysCollection.find().limit(limit);
     const result=await cursor.toArray();
     res.send(result)
   });

   app.get('/mytoys', async(req,res)=>{
   
    let query={}
    if(req.query?.email){
     query={email:req.query.email}
    }
    const cursor=toysCollection.find(query);
    const result=await cursor.toArray();
    res.send(result)
   });
   app.get('/categories', async(req,res)=>{
   
    let query={}
    if(req.query?.category){
     query={category:req.query.category}
    }
    const cursor=toysCollection.find(query);
    const result=await cursor.toArray();
    res.send(result)
   });

   app.get('/mytoys/:id', async(req,res)=>{
    const id=req.params.id;
    const query={_id: new ObjectId(id)};
    const result= await toysCollection.findOne(query);
    res.send(result);
   })

   app.get('/search',async(req,res)=>{
    const query = { name: req.query.name}
    const result=await toysCollection.find(query).toArray()
    res.send(result)
   })
   app.put('/mytoys/:id',async(req,res)=>{
    const id =req.params.id;

    const filter={_id:new ObjectId(id)};
    const option={upsert:true};
    const toyInfo=req.body;
    console.log(toyInfo)
    const updatedInfo={
     $set:{
      price:toyInfo.price,
       quantity:toyInfo.quantity,
       details:toyInfo.details,
     }
    }
    const result=await toysCollection.updateOne(filter,updatedInfo,option,);
    res.send(result)
   })

   
   app.post('/alltoys',async(req,res)=>{
    const toy=req.body
    const result=await toysCollection.insertOne(toy);
    res.send(result)
    
   });
   
   app.delete('/mytoys/:id', async(req,res)=>{
    const id=req.params.id;
    const query={_id: new ObjectId(id)};
    const result=await toysCollection.deleteOne(query);
    res.send(result)
   })
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
 res.send('assignment ten is running')
})
app.listen(port)