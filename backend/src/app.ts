import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import connectDB from './db';
import { setupSwagger } from './config/swagger';
import loadRoutes from './routes/loadRoutes';

// Connect to Database
connectDB();

const app: Application = express();

// Swagger Documentation
setupSwagger(app);

app.use(cors());
app.use(express.json());

app.use('/api/loads', loadRoutes);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Backend API is running. Hit /api/loads to see the data!'
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

export default app;
