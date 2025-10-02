import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    ChangeCurrentUserPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    deleteUserAccount,
    CreateAddress,
    GetUserAdresses
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.post("/register", upload.single("avatar"), registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);

// Protected routes
router.post("/logout", verifyJWT, logoutUser);
router.post("/change-password", verifyJWT, ChangeCurrentUserPassword);
router.get("/me", verifyJWT, getCurrentUser);
router.put("/update", verifyJWT, updateAccountDetails);
router.put("/update-avatar", verifyJWT, upload.single("avatar"), updateUserAvatar);
router.delete("/delete", verifyJWT, deleteUserAccount);
router.post("/create-address", verifyJWT, CreateAddress);
router.get("/fetch-address", verifyJWT, GetUserAdresses);


export default router;
