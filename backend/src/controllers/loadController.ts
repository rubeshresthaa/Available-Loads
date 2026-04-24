import { Request, Response } from 'express';
import Load, { ILoad } from '../models/Load';

export const getPendingLoads = async (req: Request, res: Response): Promise<void> => {
  try {
    const loads = await Load.find({ status: 'PENDING' }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: loads,
    });
  } catch (error) {
    console.error('Error fetching pending loads:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching loads',
    });
  }
};

export const acceptLoad = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { driverId } = req.body;

    if (!driverId) {
      res.status(400).json({
        success: false,
        message: 'driverId is required to accept a load',
      });
      return;
    }

    // Atomic operation to prevent race conditions
    const updatedLoad = await Load.findOneAndUpdate(
      { _id: id, status: 'PENDING' },
      { 
        $set: { 
          status: 'ACCEPTED', 
          driverId: driverId 
        } 
      },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedLoad) {
      const existingLoad = await Load.findById(id);
      
      if (!existingLoad) {
        res.status(404).json({
          success: false,
          message: 'Load not found',
        });
        return;
      }

      if (existingLoad.status === 'ACCEPTED') {
        res.status(409).json({
          success: false,
          message: 'Conflict: Load has already been accepted by another driver',
        });
        return;
      }
    }

    res.status(200).json({
      success: true,
      message: 'Load successfully accepted',
      data: updatedLoad,
    });

  } catch (error: any) {
    console.error('Error accepting load:', error);
    
    if (error.name === 'CastError') {
      res.status(400).json({
        success: false,
        message: 'Invalid load ID format',
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Server error while accepting load',
    });
  }
};

export const createLoad = async (req: Request, res: Response): Promise<void> => {
  try {
    const { origin, destination, weight, vehicleTypeRequired, price } = req.body;

    if (!origin || !destination || !weight || !vehicleTypeRequired || !price) {
      res.status(400).json({
        success: false,
        message: 'Please provide all required fields: origin, destination, weight, vehicleTypeRequired, price',
      });
      return;
    }

    const newLoad = new Load({
      origin,
      destination,
      weight,
      vehicleTypeRequired,
      price,
    });

    const savedLoad = await newLoad.save();

    res.status(201).json({
      success: true,
      message: 'Load created successfully',
      data: savedLoad,
    });
  } catch (error: any) {
    console.error('Error creating load:', error);
    
    if (error.name === 'ValidationError') {
      res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: Object.values(error.errors).map((err: any) => err.message),
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating load',
    });
  }
};

export const getDriverLoads = async (req: Request, res: Response): Promise<void> => {
  try {
    const { driverId } = req.params;
    const loads = await Load.find({ driverId, status: 'ACCEPTED' }).sort({ updatedAt: -1 });
    res.status(200).json({
      success: true,
      data: loads,
    });
  } catch (error) {
    console.error('Error fetching driver loads:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching your loads',
    });
  }
};
