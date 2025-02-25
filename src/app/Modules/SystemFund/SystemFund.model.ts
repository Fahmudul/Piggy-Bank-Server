import mongoose from "mongoose";
import { ISystemFund } from "./SystemFund.interface";

const fundSchema = new mongoose.Schema<ISystemFund>({
  totalBalance: { type: Number, default: 0 },
});

export const SystemFund = mongoose.model<ISystemFund>("SystemFund", fundSchema);
