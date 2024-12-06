import Admin from "../models/adminModel.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';

//update admin
export const updateAdmin = async (req, res, next) => {
    if (req.admin.id !== req.params.id) {
        return next(errorHandler(401, 'You can only update YOUR account !'));
    }

    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }

        const updatedAdmin = await Admin.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    password: req.body.password,
                    profilePicture: req.body.profilePicture,
                }
            },
            //show updated
            {new: true}
        );
        const {password, ...rest } = updatedAdmin._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error)
    }
};

export const deleteAdmin = async (req, res, next) => {
    if (req.admin.id !== req.params.id) {
        return next(errorHandler(401, 'You can only delete your account'));
    }

    try {
        await Admin.findByIdAndDelete(req.params.id);
        res.status(200).json('Admin has been deleted');
    } catch (error) {
        next(error);
    }
}