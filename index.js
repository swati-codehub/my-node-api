require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');   //class
const app = express();
const port = 3000;
const client = new MongoClient(process.env.MONGO_URI); //object
client.connect();
console.log('Connected to MongoDB');
const testdb = client.db("testdb")

app.use(express.json()); //convert body from the request to request. body object

app.get('/', (req, res) => {
    res.send('Hello, World!');//send will send the text message
});



app.get('/api/data', async (req, res) => {
    console.log('Received request with query parameters:', req.query);
    console.log('Received request for ID:', req.params);
    let id = req.query.id;  //query parameter id from url
     // let data = await testdb.collection("data").find().toArray();
    let data = await testdb.collection("data").findOne({ name: id });
    res.json(data);//send an object (internally stringify this and use the send to the send the message)
});
app.get('/api/data/:id', (req, res) => {
    console.log('Received request for ID:', req.params);
    console.log('Received request for ID:', req.query);
    let id = req.params.id;
    const data = {
        message: 'This is some sample data for' + id,
        timestamp: new Date()
    };
    res.json(data);
});

app.post('/api/data', (req, res) => {
    console.log('Received POST request with body:', req.body);
    //call api - save that data from body to db
    testdb.collection("data").insertOne(req.body);

    res.json({ message: "successfully saved data" });
});

app.delete('/api/data/:id', async(req, res) =>{
    const id = req.params.id;

    const result= await testdb.collection("data").deleteOne({_id:new ObjectId(id)});
    if(result.deletedCount ===0 ){
        return res.status(404).json({message:"document not found"});
    }else{
   
    res.json(result);
    }
});

app.put('/api/data/:id' ,async (req,res) => {

    const id=req.params.id;

    const result = await testdb.collection("data").updateOne({
        _id: new ObjectId(id)},
        {$set:req.body }
    );
    if(result.matchedCount ===0 ){
        return res.status(404).json({message:"document not found"});
    } else {
   
    res.json(result);}

    });

app.patch('/api/data/:id',async (req,res)=>{
     const id=req.params.id;

    const result = await testdb.collection("data").updateOne({_id: new ObjectId(id)},
        {$set:req.body }
);res.json(result);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//request and response object
//request-when we send something from the user side