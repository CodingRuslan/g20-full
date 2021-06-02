import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { UserController } from '../controllers/HealthCheckController';

const router = Router();
const { OK } = StatusCodes;

const userController = new UserController();

router.get('/', async (req: Request, res: Response) => {
    const users = await userController.all();
    return res.status(OK).send(users);
});
export default router;
