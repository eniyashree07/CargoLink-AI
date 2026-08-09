require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const dns = require('dns');
const cors = require('cors');

// Use public DNS servers to resolve MongoDB Atlas SRV records
dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
const dbUri = process.env.MONGODB_URI?.trim();
const fallbackDbUri = 'mongodb://127.0.0.1:27017/cargolink';
mongoose.set('strictQuery', false);

const mongooseOptions = {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
};

async function connectToDatabase(uri) {
  try {
    await mongoose.connect(uri, mongooseOptions);
    console.log(`MongoDB Connected Successfully to ${uri}`);
    return true;
  } catch (err) {
    console.error(`MongoDB Connection Error: Failed to connect to ${uri}`);
    console.error(err.message);
    if (uri.startsWith('mongodb+srv://')) {
      console.error('If you are using Atlas, confirm your IP address is added to the cluster IP access list and your connection string includes the target database name.');
    }
    return false;
  }
}

(async () => {
  const primaryUri = dbUri || fallbackDbUri;
  const connected = await connectToDatabase(primaryUri);

  if (!connected && dbUri && dbUri !== fallbackDbUri) {
    console.warn('Attempting fallback to local MongoDB...');
    const fallbackConnected = await connectToDatabase(fallbackDbUri);

    if (!fallbackConnected) {
      console.error('Server will continue running without database. API calls requiring the database will fail.');
    } else {
      console.warn('Connected to local MongoDB instead of Atlas.');
    }
  } else if (!connected) {
    console.error('Server will continue running without database. API calls requiring the database will fail.');
  }
})();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/trips', require('./routes/trips'));
app.use('/api/drivers', require('./routes/drivers'));
app.use('/api/driver', require('./routes/voiceAssistant'));
app.use('/api/tracking', require('./routes/tracking'));

// Start Server
const PORT = Number(process.env.PORT) || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please stop the existing process or use a different PORT.`);
  } else {
    console.error(err);
  }
  process.exit(1);
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: err.message || 'Internal Server Error' 
  });
});
