export interface Load {
  id: string;  // Backend's toJSON transform maps _id → id
  _id?: string; // Keep as optional fallback
  origin: string;
  destination: string;
  weight: number;
  vehicleTypeRequired: string; // Matches backend field name exactly
  price: number;
  status: 'PENDING' | 'ACCEPTED';
  driverId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
