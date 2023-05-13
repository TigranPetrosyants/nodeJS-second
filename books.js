const express = require("express");

const { MongoClient } = require('mongodb');

const PORT = 5000;

const dbName = 'node-books';
const dbRemote = "mongodb+srv://tigranpetrosyantsfd:aRiuy35fRUVNBnfN@booksapi.c4zyaa1.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(dbRemote);

async function main() {

  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);

  const collection = db.collection('books');

  const app = express();

  app.get('/', async (req, res) => {
    const books = await collection.find().toArray();
    res.status(200).send(books);
  })

  app.listen(PORT, () => {
    console.log('Server running on 5000 port');
  })


  return 'done.';
}

main()
  .then(console.log)
  .catch(console.error)

