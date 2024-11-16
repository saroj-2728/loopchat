import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
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
        required: false,
        unique: false,
    },
    bio: {
        type: String,
        required: false,
        unique: false,
    },
    password: {
        type: String,
        required: function () {
            return !this.oauthProvider;
        },
    },
    profileImage: {
        url: {
            type: String,
            required: false,
        },
        public_id: {
            type: String,
            required: false,
        },
    },
    oauthProvider: {
        type: String,
        required: false,
    }
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
