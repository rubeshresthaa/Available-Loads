import { Router } from 'express';
import { getPendingLoads, acceptLoad, createLoad, getDriverLoads } from '../controllers/loadController';
import { seedLoads } from '../controllers/seedController';

const router = Router();

/**
 * @openapi
 * /loads:
 *   get:
 *     summary: Get all pending loads
 *     tags: [Loads]
 *     responses:
 *       200:
 *         description: List of pending loads
 */
router.get('/', getPendingLoads);

/**
 * @openapi
 * /loads/driver/{driverId}:
 *   get:
 *     summary: Get accepted loads for a specific driver
 *     tags: [Loads]
 *     parameters:
 *       - in: path
 *         name: driverId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of accepted loads
 */
router.get('/driver/:driverId', getDriverLoads);

/**
 * @openapi
 * /loads/seed:
 *   post:
 *     summary: Seed the database with sample loads
 *     tags: [Loads]
 *     responses:
 *       201:
 *         description: Sample loads created
 */
router.post('/seed', seedLoads);      

/**
 * @openapi
 * /loads/{id}/accept:
 *   patch:
 *     summary: Accept a load
 *     tags: [Loads]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               driverId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Load accepted successfully
 *       409:
 *         description: Load already accepted
 */
router.patch('/:id/accept', acceptLoad);

/**
 * @openapi
 * /loads/create:
 *   post:
 *     summary: Create a new load
 *     tags: [Loads]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               origin:
 *                 type: string
 *               destination:
 *                 type: string
 *               weight:
 *                 type: number
 *               vehicleTypeRequired:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Load created successfully
 */
router.post('/create', createLoad); 
export default router;
