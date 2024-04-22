const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        index: true // Add indexing to the 'firstName' field
    },
    lastName: {
        type: String,
        required: true,
        index: true // Add indexing to the 'lastName' field
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensuring uniqueness of email addresses
        index: true // Add indexing to the 'email' field
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', UserSchema);
