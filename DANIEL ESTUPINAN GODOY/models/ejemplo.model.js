import mongoose from "mongoose";

const ejemploSchema = new mongoose.Schema({
    nombre:{
        type: String,
        required: true
    },
    apellido:{
        type: String,
        required: true
    },
    edad:{
        type: Number,
        required: false
    },
    contacto:{
        type: [String],
        required: false
    }
});

const Ejemplo = mongoose.model('Ejemplo', ejemploSchema);

export default Ejemplo;