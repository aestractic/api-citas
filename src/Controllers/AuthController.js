import Jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import mongoose from "mongoose";
import {JWT_SECRET, JWT_EXPIRES} from '../config.js';

const esquema = new mongoose.Schema({
    name:String, email:String, password:String
},{versionKey:false})

const UserModel = new mongoose.model('login',esquema)

export const createUser = async (req,res,next)=>{
    try {
        const {name, email, password} = req.body
        var validation = validate(name, email, password)
        if (validation == '') {
            let pass = await bcryptjs.hash(password, 8)
            const newUser = new UserModel({
                name:name, email:email, password:pass
            })
            await newUser.save()
            return res.status(200).json({status:true, message:'Usuario creado'})
        }
        else {
            return res.status(400).json({status:false, errors:validation})
        }
    }
    catch(error){
        return res.status(500).json({status:false, errors:[error.message]})
    }
}

const validate = (name, email, password) => {
    var errors = []
    if(name === undefined || name.trim() === ''){
        errors.push('El nombre no debe de estar vacio')
    }
    if(email === undefined || email.trim() === ''){
        errors.push('El correo no debe de estar vacio')
    }
    if(password === undefined || password.trim() === '' || password.length < 8){
        errors.push('La contraseña no debe de estar vacio y minimo debe tener 8 caracteres')
    }
    return errors
}

export const login = async (req,res,next)=>{
    try {
        const {email, password} = req.body
        var validation = validate('name', email, password)
        if (validation == ''){
            let info = await UserModel.findOne({email:email})
            if (info == 0 || !(await bcryptjs.compare(password, info.password))){
                return res.status(404).json({status:true, message:'Usuario no existe'})
            }
            const token = Jwt.sign({id:info._id}, JWT_SECRET, {
                expiresIn: JWT_EXPIRES
            })
            const user = {id:info._id, name:info.name, email:info.email, token:token}
            return res.status(200).json({status:true, data:user, message:'Acceso correcto'})
        }
        else {
            return res.status(400).json({status:false, errors:validation})
        }
    }
    catch(error){
        return res.status(500).json({status:false, errors:[error.message]})
    }
}