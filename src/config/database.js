const dns = require('dns');

const DB_SECRET_KEY = process.env.DB_SECRET_KEY;

dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');

const connectDB = async() => {
 await  mongoose.connect(DB_SECRET_KEY);
}

module.exports = connectDB;



