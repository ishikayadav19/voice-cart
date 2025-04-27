const { Schema, model } = require('../connection'); // import the connection //schema class=> structure, model=>function hota h
const mySchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    password: { type: String, required: true },

    city: { type: String, default: "unknown" },
    createdAt: { type: Date, default: Date.now },
}) //schema class ka object bna rhe h

module.exports = model('usersdata', mySchema); //model class ka object bna rhe h, user is the name of the collection in the database, mySchema is the schema we created above