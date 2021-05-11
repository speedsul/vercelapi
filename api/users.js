// Import Dependencies
import { parse } from 'url';
import assert from 'assert';
import { MongoClient } from 'mongodb';

// Create cached connection variable
let cachedDb = null

// A function for connecting to MongoDB,
// taking a single parameter of the connection string
async function connectToDatabase(uri) {
  // If the database connection is cached,
  // use it instead of creating a new connection
  if (cachedDb) {
    return cachedDb
  }

  // If no connection is cached, create a new one
  const client = await MongoClient.connect(uri, { useNewUrlParser: true,  useUnifiedTopology: true   })

  // Select the database through the connection,
  // using the database path of the connection string
  const db = client.db(parse(uri).pathname.substr(1))

  // Cache the database connection and return the connection
  cachedDb = db
  return db
}

// The main, exported, function of the endpoint,
// dealing with the request and subsequent response
export default async (req, res) => {
  // Get a database connection, cached or otherwise,
  // using the connection string environment variable as the argument
  const db = await connectToDatabase(process.env.MONGODB_URI)

  // Select the "users" collection from the database
  const collection = await db.collection('ubinet')

  // Select the users collection from the database
  const svg = await collection.find({}).toArray()
console.log(svg)
  // Respond with a JSON string of all users in the collection
  res.status(200).json({ svg })
}