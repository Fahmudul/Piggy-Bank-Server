import { Router } from "express";
import UserRoutes from "../Modules/User/User.Routes";
import AuthRoutes from "../Modules/Auth/AuthRoutes";
import TransactionRoutes from "../Modules/Transaction/Transaction.Routes";

const router = Router();

const ApplicationRoutes = [
  {
    path: "/auth",
    route:AuthRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/transaction",
    route: TransactionRoutes,
  },
];

ApplicationRoutes.forEach((element) => {
  router.use(element.path, element.route);
});

export default router;
