import mongoose from "mongoose"
import * as fs from 'fs'

const citaSchema = new mongoose.Schema({
    propietario: String,
    mascota: String,
    raza: String,
    date: Date,
    notas: String,
    costo: Number,
    estado: { type: String, enum: ['programada', 'completada', 'cancelada'], default: 'programada' },
    imagen: String
}, { versionKey: false })

const CitasModel = mongoose.model('citas', citaSchema)

// GET - Obtener citas
export const getCitas = async (req, res) => {
    try {
        const { id } = req.params
        const rows = (id === undefined) ? await CitasModel.find() : await CitasModel.findById(id)
        return res.status(200).json({ status: true, data: rows })
    } catch (error) {
        return res.status(500).json({ status: false, errors: [error.message] })
    }
}

// POST - Crear nueva cita
export const saveCitas = async (req, res) => {
    try {
        const { propietario, mascota, raza, date, notas, costo } = req.body
        const validation = validate(propietario, mascota, date, req.file)
        if (validation.length === 0) {
            const newCitas = new CitasModel({
                propietario,
                mascota,
                raza,
                date,
                notas,
                costo,
                imagen: req.file ? '/uploads/' + req.file.filename : null
            })
            await newCitas.save()
            return res.status(200).json({ status: true, message: 'Cita Guardada' })
        } else {
            return res.status(400).json({ status: false, errors: validation })
        }
    } catch (error) {
        return res.status(500).json({ status: false, errors: [error.message] })
    }
}

const validate = (propietario, mascota, date, file) => {
    const errors = []
    if (!propietario || propietario.trim() === '') {
        errors.push('El nombre del propietario no debe estar vacío')
    }
    if (!mascota || mascota.trim() === '') {
        errors.push('El nombre de la mascota no debe estar vacío')
    }
    if (!date || isNaN(Date.parse(date))) {
        errors.push('La fecha debe ser válida')
    }
    if (file && !['image/jpeg', 'image/png'].includes(file.mimetype)) {
        errors.push('La imagen debe ser en formato jpg, jpeg o png')
        fs.unlinkSync(file.path)
    }
    return errors
}

// PUT - Actualizar cita
export const updateCitas = async (req, res) => {
    try {
        const { id } = req.params
        const { propietario, mascota, raza, date, notas, costo, estado } = req.body
        let values = { propietario, mascota, raza, date, notas, costo, estado }

        if (req.file) {
            values.imagen = '/uploads/' + req.file.filename
            await deleteImagen(id)
        }

        const validation = validate(propietario, mascota, date, req.file)
        if (validation.length === 0) {
            await CitasModel.updateOne({ _id: id }, { $set: values })
            return res.status(200).json({ status: true, message: 'Cita Actualizada' })
        } else {
            return res.status(400).json({ status: false, errors: validation })
        }
    } catch (error) {
        return res.status(500).json({ status: false, errors: [error.message] })
    }
}

// DELETE - Eliminar cita
export const deleteCitas = async (req, res) => {
    try {
        const { id } = req.params
        await deleteImagen(id)
        await CitasModel.deleteOne({ _id: id })
        return res.status(200).json({ status: true, message: 'Cita Eliminada' })
    } catch (error) {
        return res.status(500).json({ status: false, errors: [error.message] })
    }
}

// Función auxiliar para eliminar imagen
const deleteImagen = async (id) => {
    try {
        const cita = await CitasModel.findById(id)
        if (cita && cita.imagen) {
            const imagePath = './public' + cita.imagen
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath)
            }
        }
    } catch (error) {
        console.error('Error al eliminar la imagen:', error)
    }
}