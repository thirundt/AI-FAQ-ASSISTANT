const mongoose = require('mongoose');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai_faq_assistant');
  console.log('MongoDB connected successfully');
  return conn;
};

module.exports = connectDB;
