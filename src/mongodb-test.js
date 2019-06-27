const { MongoClient } = require("mongodb");

module.exports = async () => {
  const client = await MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
  });

  console.log("Connected to MongoDB");

  const db = client.db("test");
  const collection = db.collection("testDocs");

  const docs = await collection.find({}).toArray();
  console.log(docs);

  client.close();
};
