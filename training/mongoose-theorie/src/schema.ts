import { Model, model, Schema } from "mongoose";

const addressSchema = new Schema({
    street: {
        type: String,

    },
    number: {
        type: Number
    },
    city: {
        type: String
    },
    country: {
        type: String
    },
    box: {
        type: String
    },
})

// défini la structure de l'instance du document
interface UserInterface {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    daysConnected: number,
    address: {
        street: string,
        number: number,
        country: string,
        city: string,
        box: string
    }
}

// l'interface qui défini les méthodes liées à l'instance du document
interface UserMethodsInterface {
    getFullName(): string;
}

// interface qui défini les méthodes statiques liées au Modèle
interface UserStaticsInterface {
    findAndSave(): void;
}

const schema = new Schema<
    // la structure du document
    UserInterface, 
    // le modèle
    Model<UserInterface>,
    // les méthodes
    UserMethodsInterface,
    {},
    // les méthodes statiques
    UserStaticsInterface
>({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    daysConnected: {
        required: false,
        type: Number,
        min: 0,
        max: 3000
    },
    address: {
        type: addressSchema
    }
}, {
    methods: {
        getFullName() {
            if (!this.firstName || !this.lastName) {
                return 'Anonymous';
            }
            return this._id + ' ' + this.firstName + ' ' + this.lastName;
        }
    },
    statics: {
        findAndSave() {

        }
    }
});

export const UserModel = model("users", schema);