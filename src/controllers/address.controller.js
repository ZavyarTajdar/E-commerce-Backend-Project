import { User } from "../models/user.models.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Address } from "../models/address.models.js"

const CreateAddress = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const user = await User.findById(userId)

    const { street, city, state, postalCode, country, type } = req.body;

    if (!(street && city && state && postalCode && country && type)) {
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

const UpdateAddress = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const { addressId } = req.params
    if (!addressId) {
        throw new ApiError(400, "Address Id Required")
    }

    const { street, city, state, postalCode, country, type } = req.body;

    if (!(street || city || state || postalCode || country || type)) {
        throw new ApiError(400, "At least one field is required to update");
    }

    const address = await Address.findOne({ _id: addressId, user: userId });

    if (!address) {
        throw new ApiError(404, "Address not found or not yours");
    }

    if (street) address.street = street;
    if (city) address.city = city;
    if (state) address.state = state;
    if (postalCode) address.postalCode = postalCode;
    if (country) address.country = country;
    if (type) address.type = type;

    await address.save();

    return res
        .status(200)
        .json(
            new ApiResponse(200, address, "Address Updated Successfully")
        )
})

const deleteAddress = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { addressId } = req.params;

    if (!addressId) {
        throw new ApiError(400, "Address ID is required");
    }

    const address = await Address.findOne({ _id: addressId, user: userId });

    if (!address) {
        throw new ApiError(404, "Address not found or not yours");
    }

    await Address.findByIdAndDelete(addressId);

    await User.findByIdAndUpdate(userId, {
        $pull: { address: addressId },
    });

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Address deleted successfully"));
});

const getAllAddresses = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const addresses = await Address.find({ user: userId }).sort({ createdAt: -1 });

  if (!addresses || addresses.length === 0) {
    throw new ApiError(404, "No addresses found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, addresses, "Addresses fetched successfully"));
});

export {
    CreateAddress,
    UpdateAddress,
    deleteAddress,
    getAllAddresses
}