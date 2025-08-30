import mongoose, { Schema, Document } from 'mongoose';

export interface IWellnessResponse {
  question: string;
  answer: string;
  score: number; // 1-5 scale
}

export interface IWellnessCheck extends Document {
  userId: mongoose.Types.ObjectId;
  employeeId?: string;
  date: Date;
  responses: IWellnessResponse[];
  overallScore: number; // 0-100 percentage
  aiGeneratedQuestions: string[];
  completedAt: Date;
  mood?: string;
  stressLevel?: number;
  energyLevel?: number;
  workSatisfaction?: number;
  personalContext?: {
    recentEvents?: string[];
    workload?: string;
    teamDynamics?: string;
    personalChallenges?: string;
  };
}

const WellnessResponseSchema = new Schema<IWellnessResponse>({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  score: { type: Number, required: true, min: 1, max: 5 }
});

const WellnessCheckSchema = new Schema<IWellnessCheck>({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  employeeId: { type: String },
  date: { 
    type: Date, 
    default: Date.now,
    index: true 
  },
  responses: [WellnessResponseSchema],
  overallScore: { 
    type: Number, 
    min: 0, 
    max: 100,
    default: 0 
  },
  aiGeneratedQuestions: [{ type: String }],
  completedAt: { type: Date },
  mood: { type: String },
  stressLevel: { type: Number, min: 1, max: 10 },
  energyLevel: { type: Number, min: 1, max: 10 },
  workSatisfaction: { type: Number, min: 1, max: 10 },
  personalContext: {
    recentEvents: [{ type: String }],
    workload: { type: String },
    teamDynamics: { type: String },
    personalChallenges: { type: String }
  }
}, {
  timestamps: true
});

// Compound index for efficient querying
WellnessCheckSchema.index({ userId: 1, date: -1 });
WellnessCheckSchema.index({ employeeId: 1, date: -1 });

const WellnessCheck = mongoose.models.WellnessCheck || mongoose.model<IWellnessCheck>('WellnessCheck', WellnessCheckSchema);

export default WellnessCheck;