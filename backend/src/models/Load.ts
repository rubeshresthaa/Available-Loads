import mongoose, { Schema, Document } from 'mongoose';

export interface ILoad extends Document {
  origin: string;
  destination: string;
  weight: number;
  vehicleTypeRequired: string;
  price: number;
  status: 'PENDING' | 'ACCEPTED';
  driverId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const loadSchema: Schema = new Schema({
  origin: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  vehicleTypeRequired: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED'],
    default: 'PENDING',
  },
  driverId: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function (doc: any, ret: any) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

export default mongoose.model<ILoad>('Load', loadSchema);
