import mongoose from "mongoose";
import { UserModel } from "./schema.ts";
import argon from "argon2";

async function init() {
    try { 
        mongoose.set('debug', true);
        let connection = await mongoose.connect('mongodb://root:test123@localhost:27017/sample_mflix?authSource=admin', {
            
        });

        console.log("Connecté à " + connection.connection.db?.databaseName);
    } catch(e) {
        console.log("Une erreur est survenue :", e);
    }

    const passwordClear = "test123*";
    const hashed = await argon.hash(passwordClear);

    const userPassword = new UserModel({
        firstName: 'Hash',
        lastName: 'Man',
        password: hashed,
        email: "hash.man@localhost.com"
    });

    await userPassword.save();

    // l'utilisateur envoie son login/mot de passe
    const login = "hash.man@localhost.com";
    const password = "test123";

    // côté backend
    const user = await UserModel.findOne({
        email: login
    });

    // verification du mot de passe
    if (await user.verify(password)) {
        console.log("On connecte l'utilisateur")
    }else {
        console.log("Mauvais mot de passe")
    }


}

init();