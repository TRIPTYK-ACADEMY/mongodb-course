import mongoose from "mongoose";
import { UserModel } from "./schema.ts";

async function init() {
    try { 
        let connection = await mongoose.connect('mongodb://root:test123@localhost:27017/sample_mflix?authSource=admin');

        console.log("Connecté à " + connection.connection.db?.databaseName);
    } catch(e) {
        console.log("Une erreur est survenue :", e);
    }

    const users = await UserModel.findOne({
        name: "Bowen Marsh"
    });

    const newUser = new UserModel({
        password: "pudipudi1997",
        name: "BBBBB",
        email: "gégé@gmail.com",
        daysConnected: 0,
        address: {
            number: 69,
            street: "Cancer Street",
            city: "Cancer City",
            country: "CancerLand",
            box: "666C"
        }
    });

    await newUser.save();

    console.log(users);
}

init();