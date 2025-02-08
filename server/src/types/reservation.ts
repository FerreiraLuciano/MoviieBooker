import { Document } from 'mongoose';
import mongoose from 'mongoose';

export interface Reservation extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  movieId: string;
  date_start: Date;
  date_end: Date;
}
