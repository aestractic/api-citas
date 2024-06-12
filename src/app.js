import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import mongoose from 'mongoose'

import { URL} from './config.js'

import rutasCitas from './Routes/Products.routes.js'
import routesAuth from './Routes/Auth.routes.js'

mongoose.connect(URL).then()

const app = express()
app.use(cors({ origin: '*' }));
app.use(morgan('dev'))
app.use(express.json())
app.use(express.static('public')) //Con esta linea de codigo podemos visualizar imagenes
app.use(rutasCitas)
app.use(routesAuth)

//paraque no aparesca can't get /

app.use( (req,res) => {
    res.status(404).json({status:false, errors: 'Not FOUND'})
})


export default app
