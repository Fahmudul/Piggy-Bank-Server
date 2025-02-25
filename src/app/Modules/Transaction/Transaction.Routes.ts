import { Router } from "express";
import { TransactionControllers } from "./Transaction.Controller";
import AuthGurd from "../../Middlewares/Auth";

const router = Router();

router.post(
  "/send-money",
  AuthGurd("user", "admin", "agent"),
  TransactionControllers.SendMoney
);
const TransactionRoutes = router;
export default TransactionRoutes;
