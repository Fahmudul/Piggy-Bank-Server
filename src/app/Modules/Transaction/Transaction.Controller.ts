import httpStatus from "http-status";
import { catchAsync } from "../../Utils/catchAsync";
import { sendResponse } from "../../Utils/sendResponse";
import AuthServices from "./Transaction.Services";
const SendMoney = catchAsync(async (req, res) => {
  const result = await AuthServices.SendMoney(req.body, req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Money sent successfully",
    data: result,
  });
});

export const TransactionControllers = {
  SendMoney,
};
