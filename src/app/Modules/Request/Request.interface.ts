import mongoose from "mongoose";

export interface IRequest {
  requestSender: mongoose.Types.ObjectId | string;
  requestReceiver: mongoose.Types.ObjectId | string;
  transactionAmount: number;
  transactionType: string;
  description?: string;
  status: string;
}
