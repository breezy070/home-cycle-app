import mongoose from "mongoose";

const interventionSchema = mongoose.Schema(
    {
        date: {
        type: Date,
        required: true,
        },
        type: {
        type: String,
        required: true,
        enum: ['maintenance', 'repair'],
        },
        description: {
        type: String,
        required: true,
        },
        status: {
        type: String,
        required: true,
        enum: ['pending', 'in-progress', 'completed', 'cancelled'],
        default: 'pending',
        },
    },
    {
        timestamps: true
    }

);
//this creates the collection on the mongoDB, the name of the database was created on the .env file by specifying it.
const Intervention = mongoose.model("Intervention", interventionSchema);

export default Intervention;