import { Router } from "express";
import { AuthControllers } from "./AuthController";

const router = Router();

router.post("/login", AuthControllers.LoginUser);
router.post("/logout", AuthControllers.LogOutUser);
const AuthRoutes = router;
export default AuthRoutes;
