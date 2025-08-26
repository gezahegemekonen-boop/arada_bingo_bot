import mongoose from "mongoose";

const PlayerSchema = new mongoose.Schema({
  telegramId: String,
  balance: { type: Number, default: 0 },
  cards: [Array],
  wins: { type: Number, default: 0 }
});

export default mongoose.model("Player", PlayerSchema);

