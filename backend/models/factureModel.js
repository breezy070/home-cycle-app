import mongoose from "mongoose";

const factureSchema = mongoose.Schema(
    {
        userId : {
            type: String,
            required: [true, "userID information is required !"]
        },
        technicianId : {
            type: String,
            required: [true, "technicianID information is required !"]
        },
        technicianName: {
            type: String,
            required: [true, "Technician information is required !"]
        },
        userName: {
            type: String,
            required: [true, "User information is required !"]
        },
        date: {
            type: Date,
            required: [false]
        },
        description: {
            type: String,
            required: [true, "Description is required !"]
        },
        status: { 
            type: String, enum: ['Pending', 'Completed', 'Cancelled','In progress', 'Accepted']
        },
        technicianImage: {
            type: String,
            default: "src/assets/technician1.jpg",
        }
    },
    {
        timestamps: true
    }

);
//this creates the collection on the mongoDB, the name of the database was created on the .env file by specifying it.
const Facture = mongoose.model("Facture", factureSchema);

export default Facture;