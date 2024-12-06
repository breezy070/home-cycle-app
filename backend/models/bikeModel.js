import mongoose from "mongoose";

const bikeSchema = mongoose.Schema(
    {
        model: {
            type: String,
            required: [true, "Bike model is required !"]
        },
        year: {
            type: Date,
            required: [false]
        },
        type: {
            type: String,
            required: [true, "Bike type is required !"]
        },
        productStock: {
            type: Number,
            required: [true, "stock quantity is required !"]
        },
        bikeImage: {
            type: String,
            default: "https://www.shutterstock.com/shutterstock/photos/1498702814/display_1500/stock-photo-yellow-black-er-mountainbike-with-thick-offroad-tyres-bicycle-mtb-cross-country-aluminum-1498702814.jpg",
        }
    },
    {
        timestamps: true
    }

);
//this creates the collection on the mongoDB, the name of the database was created on the .env file by specifying it.
const Bike = mongoose.model("Bike", bikeSchema);

export default Bike;