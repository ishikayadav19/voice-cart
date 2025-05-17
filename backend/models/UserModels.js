const mongoose = require('../connection'); // import the connection
const Schema = mongoose.Schema;

const mySchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    password: { type: String, required: true },
    city: { type: String, default: "unknown" },
    createdAt: { type: Date, default: Date.now },
    wishlist: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }]
})

module.exports = mongoose.model('usersdata', mySchema);