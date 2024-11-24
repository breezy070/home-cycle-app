import User from '../models/userModel.js'
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    const { email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    try {
        await newUser.save();
        res.status(201).json({message: "User created !"});
    } catch (error) {
        next(error);
        // next(errorHandler(300, "something went wrong")); custom error
    }

}

export const signin = async (req, res, next) => {
    const {email, password} = req.body;
    try {
        const validUser = await User.findOne({email});
        if (!validUser) return next(errorHandler(404, 'User not found'));
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, 'Wrong credentials'));
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);
        //removing the password from the client and sending out the rest only
        const {password: hashedPassword, ...rest} = validUser._doc;
        const expiryDate = new Date(Date.now() + 3600000); //1 hour
        res.cookie('access_token', token, {httpOnly: true, expires: expiryDate}).status(200).json(rest);
    } catch (error) {
        next(error);
    }
}