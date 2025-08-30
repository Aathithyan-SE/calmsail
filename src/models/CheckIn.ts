import mongoose, { Document, Schema } from 'mongoose';

export interface ICheckIn extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  moodInput: string;
  inputType: 'text' | 'voice';
  sentimentScore: number; // -1 to 1 (negative to positive)
  wellnessScore: number; // 0-100 calculated score
  moodCategory: 'positive' | 'neutral' | 'stressed' | 'high_risk';
  isAnonymized: boolean;
  metadata?: {
    deviceType?: string;
    location?: string;
    sessionDuration?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CheckInSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    moodInput: {
      type: String,
      required: true,
      maxlength: [1000, 'Mood input cannot be more than 1000 characters'],
    },
    inputType: {
      type: String,
      enum: ['text', 'voice'],
      default: 'text',
    },
    sentimentScore: {
      type: Number,
      required: true,
      min: -1,
      max: 1,
    },
    wellnessScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    moodCategory: {
      type: String,
      enum: ['positive', 'neutral', 'stressed', 'high_risk'],
      required: true,
      index: true,
    },
    isAnonymized: {
      type: Boolean,
      default: false,
    },
    metadata: {
      deviceType: String,
      location: String,
      sessionDuration: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
CheckInSchema.index({ userId: 1, date: -1 });
CheckInSchema.index({ moodCategory: 1, date: -1 });
CheckInSchema.index({ wellnessScore: 1, date: -1 });

// Ensure one check-in per user per day
CheckInSchema.index({ userId: 1, date: 1 }, { 
  unique: true,
  partialFilterExpression: {
    date: { $type: 'date' }
  }
});

export default mongoose.models.CheckIn || mongoose.model<ICheckIn>('CheckIn', CheckInSchema);