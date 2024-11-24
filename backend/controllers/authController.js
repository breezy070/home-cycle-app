import User from '../models/userModel.js'
import bcryptjs from 'bcryptjs';

export const signup = async (req, res) => {
    const {first_name, last_name, email, password, role } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({first_name, last_name, email, password: hashedPassword, role });
    try {
        await newUser.save();
        res.status(201).json({message: "User created !"});
    } catch (error) {
        res.status(500).json(error.message)
    }

}