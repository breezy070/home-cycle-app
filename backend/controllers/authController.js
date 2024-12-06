import User from '../models/userModel.js'
import Technician from '../models/technicianModel.js'
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const test = (req, res) => {
    res.json({
       message: 'API is working' 
    });
}

//user account signup
export const signup = async (req, res, next) => {
    const { first_name, last_name, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ first_name, last_name, email, password: hashedPassword });
    try {
        await newUser.save();
        res.status(201).json({message: "User created !"});
    } catch (error) {
        next(error);
        // next(errorHandler(300, "something went wrong")); custom error
    }

}

//technician account signup
export const signupTechnician = async (req, res, next) => {
    const { first_name, last_name, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newTechnician = new Technician({ first_name, last_name, email, password: hashedPassword });
    try {
        await newTechnician.save();
        res.status(201).json({message: "Technician created !"});
    } catch (error) {
        next(error);
        // next(errorHandler(300, "something went wrong")); custom error
    }

}

//user account sign in
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

//Technician account sign in
export const signinTechnician = async (req, res, next) => {
    const {email, password} = req.body;
    try {
        const validTechnician = await Technician.findOne({email});

        if (!validTechnician) return next(errorHandler(404, 'User not found'));

        const validPassword = bcryptjs.compareSync(password, validTechnician.password);

        if (!validPassword) return next(errorHandler(401, 'Wrong credentials'));

        const token = jwt.sign({id: validTechnician._id}, process.env.JWT_SECRET);

        //removing the password from the client and sending out the rest only
        const {password: hashedPassword, ...rest} = validTechnician._doc;
        const expiryDate = new Date(Date.now() + 3600000); //1 hour

        res.cookie('access_token', token, {httpOnly: true, expires: expiryDate}).status(200).json(rest);
    } catch (error) {
        next(error);
    }
}

//User account signout
export const signout = (req, res) => {
    res.clearCookie('access_token').status(200).json('Sign out successful');
}

//Technician account signout
export const signoutTechnician = (req, res) => {
    res.clearCookie('access_token').status(200).json('Sign out successful');
}

export const google = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email})
        if (user) {
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
            const {password: hashedPassword, ...rest } = user._doc;
            const expiryDate = new Date(Date.now() + 3600000); //1 hour
            res.cookie('access_token', token, {httpOnly: true, expires: expiryDate}).status(200).json(rest);
        }else{
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedGeneratedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                username: req.body.name.split(' ').join('').toLowerCase() +
                Math.random().toString(36).slice(-8),
                email: req.body.email,
                password: hashedGeneratedPassword,
                profilePicture: req.body.photo
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const {password: hashedPassword2, ...rest} = newUser._doc;
            const expiryDate = new Date(Date.now() + 3600000); //1 hour
            res.cookie('access_token', token, {
                httpOnly: true,
                expires: expiryDate,
            }).status(200).json(rest);
        }
    } catch (error) {
        next(error)
    }
};

