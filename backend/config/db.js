const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://sridarsh04_db_user:h0PzuB0k2ZOmeFsv@ac-gmxjgdd-shard-00-00.gtsbhaa.mongodb.net:27017,ac-gmxjgdd-shard-00-01.gtsbhaa.mongodb.net:27017,ac-gmxjgdd-shard-00-02.gtsbhaa.mongodb.net:27017/?ssl=true&replicaSet=atlas-f3fql2-shard-0&authSource=admin&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
