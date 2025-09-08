import mongoose from "mongoose";

const technicianSchema = mongoose.Schema(
    {
      first_name: {
        type: String,
        required: [true, "First name is required !"],
      },
      last_name: {
        type: String,
        required: [true, "Last name is required !"],
      },
      email: {
        type: String,
        unique: true,
        required: [true, "E-mail is required !"],
      },
      phoneNumber: {
        type: String,
        required: [false, "Phone number is required !"],
      },
      availableStatus: {
        type: Boolean,
        default: true,
      },
      zone: {
        type: {
          type: String,
          default: 'Polygon',
        },
        coordinates: {
          type: [[[Number]]], // GeoJSON Polygon: [[[lng, lat], ...]]
          default: [
            [
              [ -0.3700246809603414, 43.297154677140725 ],  // Point 1
              [ -0.36517524706141563, 43.29618641295201 ], 
              [ -0.3734579084994039, 43.29356265185302 ],  
              [ -0.3700246809603414, 43.297154677140725 ]   // Closing the loop (same as Point 1)
            ],
          ],
        },
      },
      password: {
        type: String,
        required: [true, "Password is required !"],
      },
      role: {
        type: String,
        default: "technician",
      },
      profilePicture: {
        type: String,
        default:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      },
    },
    {
      timestamps: true,
    }
  );

technicianSchema.index({ "zone.coordinates": "2dsphere" });
const Technician = mongoose.model("Technician", technicianSchema);
export default Technician;