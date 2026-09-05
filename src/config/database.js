const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');

const connectDB = async() => {
 await  mongoose.connect('mongodb+srv://ganeshwalse1975_db_user:ganesh123@backend.ecxzmof.mongodb.net/devTinder');
}

module.exports = connectDB;



