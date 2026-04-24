import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cargo Load API',
      version: '1.0.0',
      description: 'API for managing cargo loads and drivers',
    },
    servers: [
      {
        url: 'http://localhost:3001/api',
        description: 'Local server',
      },
      {
        url: 'https://express-backend-peach.vercel.app/api',
        description: 'Production server',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Application) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  console.log('Swagger documentation available at /api-docs');
};
