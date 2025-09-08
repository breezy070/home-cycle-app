import mongoose from "mongoose";

const interventionSchema = mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
        technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'Technician', required: false },
        date: { type: Date, required: false },
        status: { type: String, enum: ['Pending', 'Completed', 'Cancelled','In progress', 'Accepted'], default: 'Pending' },
        services: [String],
        comments: [
            {
              user: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                refPath: 'comments.userModel',
              },
              userModel: {
                type: String,
                required: true,
                enum: ['User', 'Technician'],
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

const Intervention = mongoose.model("Intervention", interventionSchema);

export default Intervention;