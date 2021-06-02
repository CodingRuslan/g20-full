import { Router } from 'express';
import HealthCheck from './HealthCheck';
import ReferenceBook from './ReferenceBook';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/health-check', HealthCheck);

router.use('/reference-book', ReferenceBook);

// Export the base-router
export default router;
