import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
    street: {
        type: String 
    },
    city: { 
        type: String 
    },
    state: { 
        type: String 
    },
    postalCode: { 
        type: Number 
    },
    country: {
        type: String, 
        default: "Pakistan" 
    },
},{timestamps : true})


export const Address = mongoose.model("Address", AddressSchema );