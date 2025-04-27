require('dotenv').config();
const mongoose = require('mongoose');

const url = process.env.DB_URL;
// connect=> Asynchronous function  - returns a promise(use to know that the connection is established or not)
// to resolve this prommise - we use .then() and .catch() or async/await
mongoose.connect(url)
.then((result) => {
    console.log('Database connected successfully');
}).catch((err) => {
    console.log('Database connection failed', err);  
});

module.exports = mongoose; // export the connection to use in other files