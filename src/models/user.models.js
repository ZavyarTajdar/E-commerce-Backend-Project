import mongoose from "mongoose";
import jwt from "jsonwebtoken"; // jwt is a bearer token means it`s like a key for accessing data  
import bcrypt from "bcrypt";
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        postalCode: { type: String },
        country: { type: String, default: "Pakistan" },
    },
    role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer",
    },
    refreshToken: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    searchHistory: [
        {
            query: { type: String },
            searchedAt: { type: Date, default: Date.now } // when user searched
        }
    ]
}, { timestamps: true })

// Encrypt the Password 

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

UserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

UserSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            fullname: this.fullname,
            email: this.email
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

UserSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            fullname: this.fullname,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", UserSchema);



/*import mongoose from "mongoose";

const Schema = new mongoose.Schema({},{timestamps : true})


export const  = mongoose.model("", ); */