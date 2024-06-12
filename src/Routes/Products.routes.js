import { Router } from 'express'
import { getCitas, saveCitas, updateCitas, deleteCitas } from '../Controllers/CitasController.js'
import {uploadImagen} from '../Middleware/Storage.js'
import {verifyToken} from "../Middleware/Auth.js";

const rutas = Router()

rutas.get('/api/v1/cita', verifyToken, getCitas)
rutas.get('/api/v1/cita/:id', verifyToken, getCitas)
rutas.post('/api/v1/cita', verifyToken, uploadImagen.single('imagen'), saveCitas)
rutas.put('/api/v1/cita/:id', verifyToken, uploadImagen.single('imagen'), updateCitas)
rutas.delete('/api/v1/cita/:id', verifyToken, deleteCitas)

export default rutas