import { Router } from "express";
import { signup, signin } from "../controllers/user.controller"

const router = Router();

router.route('/singup').post(signup);
router.route('/singup').post(signin);

export default router;