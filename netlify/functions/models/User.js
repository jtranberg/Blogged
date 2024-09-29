const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Ensure bcrypt is imported
const { Schema, model } = mongoose;
const saltRounds = 10;

// Define a method to hash the password
async function hashPassword(plainPassword) {
    return await bcrypt.hash(plainPassword, saltRounds);
}

const UserSchema = new Schema({
    username: String,
    email: String,
    password: String,
    // Add any other necessary fields
}, {
    timestamps: true,
});

// Before saving the user, hash the password
UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await hashPassword(this.password);
    }
    next();
});

const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = UserModel;
