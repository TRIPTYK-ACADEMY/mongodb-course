import { model, Schema } from "mongoose";

const trackingSchema = new Schema({
    userId: {
        type: String
    },
    angularCount: {
        type: Number
    }
});


export const TrackingModel = model("tracking", trackingSchema);