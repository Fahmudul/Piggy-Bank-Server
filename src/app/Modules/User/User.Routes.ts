import { Router } from "express";
import { UserControllers } from "./User.Controller";

const router = Router();

router.post("/register", UserControllers.RegisterUser);
const UserRoutes = router;
export default UserRoutes;
