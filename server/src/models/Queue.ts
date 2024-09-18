import mongoose, { Document, Schema } from "mongoose";

interface IQueue extends Document {
  partyName: string;
  partySize: number;
  position: number;
  isYours: boolean;
}

const QueueSchema = new Schema({
  partyName: { type: String, required: true },
  partySize: { type: Number, required: true },
  position: { type: Number, required: true },
  isYours: { type: Boolean, default: false },
});

export default mongoose.model<IQueue>("Queue", QueueSchema);
