const admin = require("firebase-admin");
const dotenv = require('dotenv');

dotenv.config()

admin.initializeApp({
  credential: admin.credential.cert("./serviceAccountKey.json"),
  databaseURL: process.env.FB_DATABASE_URL
})

const database = admin.database();
database.goOnline()
module.exports = database;