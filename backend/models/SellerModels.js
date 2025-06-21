const { Schema, model } = require('../connection'); 

const sellerSchema = new Schema({
    name: { type: String, required: true }, 
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true },
    phone: { type: String, required: true }, 
    storeName: { type: String, required: true },
    address: { type: String, default: "Not provided" }, 
    isApproved: { type: Boolean, default: false },
    approvedAt: { type: Date },
    createdAt: { type: Date, default: Date.now } 
});

// Export the model
module.exports = model('sellersdata', sellerSchema);