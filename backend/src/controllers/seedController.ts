import { Request, Response } from 'express';
import Load from '../models/Load';

const SEED_LOADS = [
  {
    origin: 'Kathmandu',
    destination: 'Pokhara',
    weight: 1200,
    vehicleTypeRequired: 'Truck',
    price: 8500,
  },
  {
    origin: 'Biratnagar',
    destination: 'Chitwan',
    weight: 800,
    vehicleTypeRequired: 'Mini Truck',
    price: 5200,
  },
  {
    origin: 'Butwal',
    destination: 'Kathmandu',
    weight: 2000,
    vehicleTypeRequired: 'Heavy Truck',
    price: 14000,
  },
  {
    origin: 'Dharan',
    destination: 'Hetauda',
    weight: 600,
    vehicleTypeRequired: 'Van',
    price: 4000,
  },
  {
    origin: 'Birgunj',
    destination: 'Nepalgunj',
    weight: 1500,
    vehicleTypeRequired: 'Truck',
    price: 11000,
  },
];

export const seedLoads = async (req: Request, res: Response): Promise<void> => {
  try {
    await Load.deleteMany({ status: 'PENDING' });
    const created = await Load.insertMany(SEED_LOADS);
    res.status(201).json({
      success: true,
      message: `${created.length} loads seeded successfully`,
      data: created,
    });
  } catch (error) {
    console.error('Error seeding loads:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while seeding loads',
    });
  }
};
