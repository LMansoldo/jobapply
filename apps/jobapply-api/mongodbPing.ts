/**
 * MongoDB Atlas connectivity check
 *
 * Install: npm install mongoose dotenv
 * Run:     npx ts-node mongodbPing.ts
 */

import 'dotenv/config'; // loads .env into process.env before anything else
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ MONGODB_URI is not set. Add it to your .env file.');
  process.exit(1);
}

async function ping() {
  console.log('⏳ Connecting to MongoDB Atlas...');

  // serverSelectionTimeoutMS limits how long the driver waits to find
  // a reachable server — keeps the script from hanging indefinitely
  await mongoose.connect(uri!, { serverSelectionTimeoutMS: 5000 });

  console.log('✅ Connected. Running ping...');

  // db.admin().ping() sends { ping: 1 } — the lightest possible command,
  // no data read/write, just confirms the server is reachable and responsive
  await mongoose.connection.db!.admin().command({ ping: 1 });

  console.log('✅ Ping successful — Atlas is reachable and your credentials are valid.');
}

ping()
  .catch((err: Error) => {
    // Common causes: wrong URI, IP not whitelisted in Atlas, bad credentials
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  })
  .finally(async () => {
    // Always close the connection — otherwise the process hangs waiting for it
    await mongoose.connection.close();
    console.log('🔌 Connection closed.');
  });
