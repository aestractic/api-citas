import multer from "multer"

const save = multer.diskStorage ({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
        if(file !== null){
            const ext = file.originalname.split('.').pop()
            cb(null, Date.now() + '.' + ext)
        }
    }
})

const filter = (req, file, cb) => {
    if(file && (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp')){
        cb(null, true)
    }

    else{
        cb(null, false)
    }

}

export const uploadImagen = multer ({storage: save, fileFilter:filter})