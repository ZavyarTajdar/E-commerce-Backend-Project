import { Router } from "express";
import {
    createAddress,
    updateAddress,
    deleteAddress,
    getAllAddresses
} from "../controllers/address.controller.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/", createAddress);
router.put("/:addressId", updateAddress);
router.delete("/:addressId", deleteAddress);
router.get("/", getAllAddresses);

export default router;
