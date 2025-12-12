import { model, Schema } from "mongoose";

const reminderSchema = new Schema({
    time: {
        type: String
    },
    message: {
        type: String
    },
    reminders: {
        type: [{
            messageId: String,
            reactions: [String]
        }]
    }
})

export const ReminderModel = model("reminders", reminderSchema);