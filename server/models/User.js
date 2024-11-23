import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    uid: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        unique: false,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: false,
    },
    bio: {
        type: String,
        required: false,
        unique: false,
    },
    provider: {
        type: String,
        required: true,
        unique: false,
    },
    emailVerified: {
        type: Boolean,
        required: true,
        unique: false,
    },
    profileImage: {
        url: {
            type: String,
            required: false,
            unique: false,
        },
        public_id: {
            type: String,
            required: false,
            unique: false,
        },
    },
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);