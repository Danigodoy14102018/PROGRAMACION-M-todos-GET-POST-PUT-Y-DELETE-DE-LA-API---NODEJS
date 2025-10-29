import mongoose from 'mongoose';

let isConected = false;

const conectarMongoDB = async () => {
    if (isConected) {
        console.log("Ya esta conectada la base de datos".red);
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        isConected = true;
        console.log('Conectado a la BD'.yellow);
    } catch (error) {
        console.log("Error al conectar a la BD".red);
    }
}

const db = mongoose.connection;

db.on('error', (error) => {
    isConected = false;
    console.log('Error al conectar a MongoDB'.red);
});

db.once('open', () => {
    isConected = true;
});

db.on('disconnected', () => {
    isConected = false;
    console.log('Desconectado de MongoDB'.red);
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB se ha desconectado'.red);
    process.exit(0);
});

export { conectarMongoDB, isConected };

