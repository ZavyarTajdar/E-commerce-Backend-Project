import { Order } from "../models/order.models.js"
import { User } from "../models/user.models.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Address } from "../models/address.models.js"

const CreateAddress = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const user = await User.findById(userId)

    const { street, city, state, postalCode, country, type } = req.body;

    if (!(street && city && state && postalCode && country)) {
        throw new ApiError(400, "All fields are strictly required!");
    }

    const existingAddress = await Address.findOne({
        user: userId,
        street,
        city,
        state,
        postalCode,
        country,
        type
    })
    
    if (existingAddress) {
        throw new ApiError(400, "The Address Already Existed")
    }

    const address = await Address.create({
        user: userId,
        street,
        city,
        state,
        postalCode,
        country,
        type
    })

    user.address.push(address)
    await user.save();

    return res
    .status(200)
    .json(
        new ApiResponse(200, address, "Address Created Successfully")
    )
});

export {
    CreateAddress
}