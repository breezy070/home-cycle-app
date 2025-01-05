import mongoose from "mongoose";

const interventionSchema = mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
        technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'Technician', required: false },
        date: { type: Date, required: false },
        status: { type: String, enum: ['Pending', 'Completed', 'Cancelled','In progress'], default: 'Pending' },
        services: [String], // List of services like 'brake replacement', 'tyre change'
        // comments: [
        //     {
        //       user: { type: mongoose.Schema.Types.ObjectId, ref: 'Technician', required: true },
        //       text: { type: String, required: true },
        //       createdAt: { type: Date, default: Date.now },
        //     }
        // ]
        comments: [
            {
              user: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                refPath: 'comments.userModel', // Dynamic reference
              },
              userModel: {
                type: String,
                required: true,
                enum: ['User', 'Technician'], // Possible models this field can reference
              },
              text: { type: String, required: true },
              createdAt: { type: Date, default: Date.now },
            },
          ],
    },
    {
        timestamps: true
    }

);
//this creates the collection on the mongoDB, the name of the database was created on the .env file by specifying it.
const Intervention = mongoose.model("Intervention", interventionSchema);

export default Intervention;