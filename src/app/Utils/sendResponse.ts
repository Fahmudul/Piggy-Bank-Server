import { Response } from "express";
interface IResponse<I> {
  success: boolean;
  message: string;
  statusCode: number;
  data: I;
}
export const sendResponse = <I>(res: Response, data: IResponse<I>) => {
  const { statusCode, message, success, data: responseData } = data;
  res.status(statusCode).json({
    success,
    message,
    data: responseData,
  });
};
