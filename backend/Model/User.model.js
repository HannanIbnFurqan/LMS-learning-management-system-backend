import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwtToken from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        minLength: [5, 'Name must be at least 5 characters'],
        maxLength: [20, 'Name must be less than 20 characters'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        unique: true,
    },
    password: {
        type: String, // Adding type for password
        required: [true, 'Password is required'],
        trim: true,
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
        },
        secure_url: {
            type: String,
        },
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER',
    },
    forgetPasswordToken: String,
    forgetPasswordTokenExpiry: Date,
}, { timestamps: true });

userSchema.pre('save', async function (next) { // Using regular function to bind `this`
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10); // Adding salt rounds parameter and await
    next();
});

userSchema.methods.generateJwtToken = function () {
    return jwtToken.sign(
        { id: this._id, email: this.email },  //payload (Data)
        process.env.JWT_SECRET,               //secret key
        {
            expiresIn: process.env.JWT_TOKEN_EXPIRE,   //expire time of the token
        }
    );
};

userSchema.methods.comparePassword = async function (plainTextPassword) {
    return await bcrypt.compare(plainTextPassword, this.password);
};

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
