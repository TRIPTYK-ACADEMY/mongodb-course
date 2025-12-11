import { model, Schema } from "mongoose";

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
    }
})


const schema = new Schema({
    name: {
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
});

export const UserModel = model("users", schema);