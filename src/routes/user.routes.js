import { Router } from 'express';

import {
    registerUser
} from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router()

router.route('/register-user').post(
    upload.single(
        "avatar"
    ),
    registerUser
)

export default router;