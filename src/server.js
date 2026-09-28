require('dotenv').config();

const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = require('./app');
const connectDB = require('./config/db');

const sanitizeErrorMessage = (error) => {
  let message = error.message || String(error);

  for (const secret of [process.env.MONGO_URI, process.env.JWT_SECRET, process.env.GEMINI_API_KEY]) {
    if (secret) {
      message = message.split(secret).join('[REDACTED]');
    }
  }

  return message.replace(/mongodb(?:\+srv)?:\/\/[^\s"'`]+/gi, '[REDACTED_MONGO_URI]');
};

const startServer = async () => {
  const PORT = process.env.PORT || 5000;

  try {
    await connectDB();
  } catch (error) {
    console.error(`MongoDB connection failed: ${sanitizeErrorMessage(error)}`);
    process.exitCode = 1;
    return;
  }

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    console.error(`Unhandled Rejection: ${sanitizeErrorMessage(err)}`);
    // Close server & exit process
    server.close(() => process.exit(1));
  });
};

startServer();
