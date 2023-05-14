const express = require("express");
const bodyParser = require('body-parser');

const { MongoClient, ObjectId } = require('mongodb');

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

  app.use(bodyParser.json());

  function validObjectId(id) {
    return ObjectId.isValid(id) && (typeof id === 'string') && (id.length === 24);
  }

  app.get('/', async (req, res) => {
    const books = await collection.find().toArray();
    res.status(200).send(books);
  })
  
  app.get('/:id', async (req, res) => {
    if (validObjectId(req.params.id)) {
        const book = await collection.find(
            { _id: new ObjectId(req.params.id) }
        ).toArray();

        if (book.length > 0) {
            res.status(200).json(book);
        }else {
            res.status(404).send('Book not found');
        }
    
    }else {
        res.status(404).send('Invalid ObjectID');
    }
  })

  app.post('/', async (req, res) => {
    if (req.body.title && req.body.author) {
        const {title, author} = req.body;
        const newBook = {
            date: new Date(),
            title,
            author,
        }
        await collection.insertOne(newBook);
        res.status(201).send(newBook);
    }else {
        res.status(404).send('The Title or Author fields are empty.');
    }
  })

  app.put('/:id', async (req, res) => {
    if (validObjectId(req.params.id)) {

        const book = await collection.find(
            { _id: new ObjectId(req.params.id) }
        ).toArray();

        if (book.length > 0) {

            const {title, author} = req.body;
            const newBook = {
                updated: new Date(),
                title,
                author,
            }

            await collection.updateOne(
                { _id: new ObjectId(req.params.id) },
                { $set: newBook }
            );

            res.status(200).json(newBook);

        }else {
            res.status(404).send('Book not found');
        }
    }else {
        res.status(404).send('Invalid ObjectID');
    }
  })

  app.delete('/:id', async (req, res) => {

    if (validObjectId(req.params.id)) {

        const book = await collection.find(
            { _id: new ObjectId(req.params.id) }
        ).toArray();
    
        if (book.length > 0) {
    
            await collection.deleteOne(
                { _id: new ObjectId(req.params.id) }
            );
    
            res.status(200).send(`Book id: ${req.params.id} deleted`);
        }else {
            res.status(404).send('Book not found');
        }
    }else {
        res.status(404).send('Invalid ObjectID');
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

