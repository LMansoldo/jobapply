import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './config/db';
import app from './app';

const PORT = parseInt(process.env.PORT ?? '3000', 10);

async function main() {
  await connectDB();
  const server = app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));

  function shutdown(signal: string) {
    console.log(`${signal} received, shutting down gracefully`);
    server.close(async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

main();
