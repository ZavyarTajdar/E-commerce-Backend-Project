import { User } from "../models/user.models.js"
import { Address } from "../models/address.models.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose from "mongoose"

const FetchUserAddress = asyncHandler(async (req, res) => {
    const { street, city, state, postalCode, country } = req.body;

    if (!(street && city && state && postalCode && country)) {
        throw new ApiError("All Fields Are Strictly Required ! ")
    }
    
    const user = req.user._id;

    const address = await Address.findOneAndUpdate(
        { user: user },
        { street, city, state, postalCode, country },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );


    const FetchDetails = await User.aggregate([
        {
            $match : { _id : new mongoose.Schema.Types.ObjectId(user)} 
        },
        {
            $lookup : {
                from: "addresses",
                localField: "_id",
                foreignField: "user",
                as : "AddressDetails"
            }
        },
        {
            $unwind : "$AddressDetails"
        },
        {
            $project : {
                country : "$AddressDetails.country",
                city : "$AddressDetails.city",
                state : "$AddressDetails.state",
                postalCode : "$AddressDetails.postalCode",
                street : "$AddressDetails.street",
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(200, FetchDetails[0] || {}, "Details Fetched To User")
    )
})




export {
    FetchUserAddress
}