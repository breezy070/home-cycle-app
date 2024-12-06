import mongoose from "mongoose";

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required !"]
        },
        description: {
            type: String,
            required: [true, "Product description is required !"]
        },
        price: {
            type: Number,
            required: [true, "Product price is required !"]
        },
        productStock: {
            type: Number,
            required: [true, "stock quantity is required !"]
        },
        productImage: {
            type: String,
            default: "https://as2.ftcdn.net/v2/jpg/02/51/95/53/1000_F_251955356_FAQH0U1y1TZw3ZcdPGybwUkH90a3VAhb.jpg",
        }
    },
    {
        timestamps: true
    }

);
//this creates the collection on the mongoDB, the name of the database was created on the .env file by specifying it.
const Product = mongoose.model("Product", productSchema);

export default Product;