const { Schema, model } = require('../connection'); // import the connection //schema class=> structure, model=>function hota h
const mySchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number, required: true },
    category: { type: String, required: true },
    images: [{ type: String, required: true }], // Array of image URLs
    mainImage: { type: String, required: true }, // Main/featured image
    stock: { type: Number, required: true },
    brand: { type: String, required: true },
    rating: { type: Number, required: true },
    inStock: { type: Boolean, required: true },
    featured: { type: Boolean, required: true },
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'users' }], // Array of user IDs who wishlisted this product
    seller: { type: Schema.Types.ObjectId, ref: 'sellerdata' }, // Reference to the Seller model
    createdAt: { type: Date, default: Date.now },
    
    
}) //schema class ka object bna rhe h

module.exports = model('productsdata', mySchema); //model class ka object bna rhe h, user is the name of the collection in the database, mySchema is the schema we created above