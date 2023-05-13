const express = require("express");
const bodyParser = require('body-parser');

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

  const findResult = await collection.find({}).toArray();

  const app = express();

  app.use(bodyParser.json());

  app.get('/', async (req, res) => {
    const books = await collection.find().toArray();
    res.status(200).send(books);
  })

  app.post('/', (req, res) => {
    if (req.body.title && req.body.author) {
        const {title, author} = req.body;
        const newBook = {
            date: new Date(),
            title,
            author,
        }
        collection.insertOne(newBook);
        res.status(201).send(newBook);
    }else {
        res.status(404).send('The Title or Author fields are empty.');
    }
  })


  app.listen(PORT, () => {
    console.log('Server running on 5000 port');
  })


  return 'done.';
}

main()
  .then(console.log)
  .catch(console.error)

