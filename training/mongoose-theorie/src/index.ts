import mongoose from "mongoose";
import { UserModel } from "./schema.ts";

async function init() {
    try { 
        mongoose.set('debug', true);
        let connection = await mongoose.connect('mongodb://root:test123@localhost:27017/sample_mflix?authSource=admin', {
            
        });

        console.log("Connecté à " + connection.connection.db?.databaseName);
    } catch(e) {
        console.log("Une erreur est survenue :", e);
    }

    const users = await UserModel.findOne({
        _id: new mongoose.Types.ObjectId("59b99db9cfa9a34dcd7885bf")
    });

    users.overwrite({
        lastName: 'Amaury',
        firstName: 'Deflorenne',
        email: "amaury@triptyk.eu",
        password: "123456789"
    });

    // getter get() est appelé
    console.log(users.fullName);
    // setter set() est appelé
    users.fullName = "Amaury Larry";

    await users.save();

    console.log(users);

    // await UserModel.findAndSave(users._id.toString(), {
    //     lastName: 'Amaury',
    //     firstName: "Larry",
    //     email: "amaury@triptyk.eu"
    // });


}

init();