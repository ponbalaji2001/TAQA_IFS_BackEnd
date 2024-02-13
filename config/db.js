const mongoose = require('mongoose');
const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        dbName: 'TAQA_IFS',
        useNewUrlParser: true,
        useUnifiedTopology: true,
        
      });
      console.log('MongoDB Connected...');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error.message);
      process.exit(1); 
    }
  };
  
  connectDB();
  
  module.exports = mongoose.connection;