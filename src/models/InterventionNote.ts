import mongoose, { Document, Schema } from 'mongoose';

export interface IInterventionNote extends Document {
  employeeId: mongoose.Types.ObjectId;
  managerId: mongoose.Types.ObjectId;
  title: string;
  notes: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'escalated';
  actionsTaken: string[];
  followUpDate?: Date;
  isConfidential: boolean;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const InterventionNoteSchema: Schema = new Schema(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    managerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      maxlength: [200, 'Title cannot be more than 200 characters'],
      trim: true,
    },
    notes: {
      type: String,
      required: [true, 'Notes are required'],
      maxlength: [2000, 'Notes cannot be more than 2000 characters'],
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
      index: true,
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'escalated'],
      default: 'open',
      index: true,
    },
    actionsTaken: [{
      type: String,
      maxlength: [500, 'Action description cannot be more than 500 characters'],
    }],
    followUpDate: {
      type: Date,
      index: true,
    },
    isConfidential: {
      type: Boolean,
      default: true,
    },
    attachments: [{
      type: String, // File paths or URLs
    }],
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
InterventionNoteSchema.index({ employeeId: 1, createdAt: -1 });
InterventionNoteSchema.index({ managerId: 1, createdAt: -1 });
InterventionNoteSchema.index({ status: 1, priority: -1 });
InterventionNoteSchema.index({ followUpDate: 1 });

export default mongoose.models.InterventionNote || mongoose.model<IInterventionNote>('InterventionNote', InterventionNoteSchema);