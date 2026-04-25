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
  // Expanded paths to match both development and compiled production files
  apis: ['./src/routes/*.ts', './src/models/*.ts', './src/routes/*.js', './src/models/*.js'],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Application) => {
  // Use CDN for Swagger UI assets to fix the blank page issue on Vercel
  const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui.min.css";
  const JS_URLS = [
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui-bundle.js",
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui-standalone-preset.js"
  ];

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      customCssUrl: CSS_URL,
      customJs: JS_URLS,
      explorer: true,
      customSiteTitle: "Cargo Load API Documentation"
    })
  );
  
  console.log('Swagger documentation available at /api-docs');
};
