import * as mongoose from 'mongoose';

export const ReservationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieId: { type: String, required: true },
  date_start: { type: Date, required: true },
  date_end: { type: Date, required: true },
});
