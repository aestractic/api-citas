import { Router } from 'express';
import { createUser, login} from "../Controllers/AuthController.js";

const router = Router();

//ruta
router.post("/api/v1/user", createUser);
router.post("/api/v1/login", login);

export default router