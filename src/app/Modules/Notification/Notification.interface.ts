import mongoose from "mongoose";

export interface INotification {
  sender: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  amount: number;
  notificationType: string;
  description?: string;
}
