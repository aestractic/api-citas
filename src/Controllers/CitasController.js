import mongoose from "mongoose"
import * as fs from 'fs'

const esquema = new mongoose.Schema({
    name:String, date:Date, imagen:String
},{ versionKey:false })

const CitasModel = new mongoose.model('citas', esquema)

//GET se utiliza para obtener datos de/los productos

export const getCitas = async (req,res) => {
    try{
        const {id} = req.params
        const rows= (id === undefined) ? await CitasModel.find() : await CitasModel.findById(id)
         return res.status(200).json({status:true, data:rows})
    }

    catch(error){
        return res.status(500).json({status:false, errors:[error]})
    }
}

//POST se utiliza para crear o actualizar datos en un Producto

export const saveCitas = async (req, res) => {
    try{
        const {name, date} = req.body
        const validation = validate(name, date, req.file, 'Y')
        if(validation == ''){
            const newCitas = new CitasModel({
                name:name, date:date, imagen:'/uploads/' + req.file.filename
            })
            return await newCitas.save().then(
                () => { res.status(200).json({status:true, message:'Cita Guardado'}) }
            )
        }
        else{
            return res.status(400).json({status:false, errors:validation})
        }
    }

    catch(error){
        return res.status(500).json({status:false, errors:[error.message]})
    }
}

const validate = (name, date, validated) => {
    var errors = []
    if(name === undefined || name.trim() === ''){
        errors.push('El nombre ¡No! debe de estar vacio')
    }
    if(date === undefined || date.trim() === '' || isNaN(Date.parse(date))){
        errors.push('La fecha ¡No! debe de estar vacio')
    }
    if(validated === 'Y' && imagen === undefined){
        errors.push('Selecciona una imagen en formato jpg, jpeg o png')
    }
   else{
        if(errors != ''){
            fs.unlinkSync('./public/uploads/' + imagen.filename)
        }
   }

   return errors
}

//PUT se utiliza para actualizar datos en un Productos

export const updateCitas = async (req, res) => {
    try{
        const {id} = req.params
        const {name, date} = req.body
        let imagen = ''
        let values = {name:name, date:date}
        if(req.file != null){
            imagen = '/uploads/' + req.file.filename
            values = { name:name, date:date, imagen:imagen}
            await deleteImagen(id)
        }
        const validation = validate(name, date)
        if(validation == ''){
            await CitasModel.updateOne({_id:id}, {$set: values})
            return  res.status(200).json({status:true, message:'Cita Actualizada'})
        }
        else{
            return res.status(400).json({status:false, errors:validation})
        }
    }

    catch(error){
        return res.status(500).json({status:false, errors:[error.message]})
    }
}

//DELETE se utiliza para eliminar un Producto/s

export const deleteCitas = async(req, res) => {
    try{
        const {id} = req.params
        await deleteImagen(id)
        await CitasModel.deleteOne({_id:id})
        return res.status(200).json({status:true, message:'Cita Eliminada'})
    }
    catch(error){
        return res.status(500).json({status:false, errors:[error.message]})
    }
}

//DELETE se utiliza para eliminar un Imagene/s

const deleteImagen = async(id) => {
    const cita = await CitasModel.findById(id)
    const imagen = cita.imagen
    fs.unlinkSync('./public/' + imagen)
}