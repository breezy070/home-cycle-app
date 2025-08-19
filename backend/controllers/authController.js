
import User from '../models/userModel.js'
import Technician from '../models/technicianModel.js'
import Admin from '../models/adminModel.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import axios from 'axios';

export const test = (req, res) => {
    res.json({
       message: 'API is working' 
    });
}

//user account signup
// export const signup = async (req, res, next) => {
//     const { first_name, last_name, email, address, password } = req.body;
//     const hashedPassword = bcryptjs.hashSync(password, 10);
//     const newUser = new User({ first_name, last_name, email, address, password: hashedPassword });
//     try {
//         await newUser.save();
//         res.status(201).json({message: "User created !"});
//     } catch (error) {
//         next(error);
//         // next(errorHandler(300, "something went wrong")); custom error
//     }

// }

export const signup = async (req, res, next) => {
    const { first_name, last_name, email, address, password } = req.body;

    // Hash the password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    try {
        // Geocode the address using OpenStreetMap's Nominatim API with Axios
        const geocodeAddress = async (address) => {
            const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`;

            //diff type of search, might be more precise but user should only enter street name
            // const url2 = `https://nominatim.openstreetmap.org/search?street=8%20avenue%20des%20vall%C3%A9es&city=Pau&country=France&postalcode=64000&format=json&limit=1`

            try {
                // Make the GET request using Axios
                const response = await axios.get(url);
                const results = response.data;

                if (results.length > 0) {
                    const { lat, lon } = results[0];
                    return [parseFloat(lon), parseFloat(lat)]; // Return coordinates as [lng, lat]
                } else {
                    // throw new Error('Geocoding failed: No results found.');
                    console.log('Geocoding failed: No results found.')
                }
            } catch (error) {
                // throw new Error(`Geocoding failed: ${error.message}`);
                console.log(`Geocoding failed: ${error.message}`)
            }
        };

        // Perform geocoding to get the longitude and latitude
        const [longitude, latitude] = await geocodeAddress(address);

        // Create a new user with GeoJSON address format
        const newUser = new User({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            address: {
                type: 'Point',
                addressString: address,
                coordinates: [longitude, latitude], // GeoJSON format
            },
        });

        // Save the new user to the database
        await newUser.save();

        // Respond with a success message
        res.status(201).json({ message: 'User created!' });
    } catch (error) {
        console.error('Error during signup:', error.message);
        next(error); // Pass the error to the error handler
    }
};

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

//Admin account signup
export const signupAdmin = async (req, res, next) => {
    const { first_name, last_name, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newAdmin = new Admin({ first_name, last_name, email, password: hashedPassword });
    try {
        await newAdmin.save();
        res.status(201).json({message: "Admin created !"});
    } catch (error) {
        next(error);
        // next(errorHandler(300, "something went wrong")); custom error
    }

}

//Admin account sign in
export const signinAdmin = async (req, res, next) => {
    const {email, password} = req.body;
    try {
        const validAdmin = await Admin.findOne({email});

        if (!validAdmin) return next(errorHandler(404, 'Admin not found'));

        const validPassword = bcryptjs.compareSync(password, validAdmin.password);

        if (!validPassword) return next(errorHandler(401, 'Wrong credentials'));

        const token = jwt.sign({id: validAdmin._id, role: validAdmin.role}, process.env.JWT_SECRET);

        //removing the password from the client and sending out the rest only
        const {password: hashedPassword, ...rest} = validAdmin._doc;
        const expiryDate = new Date(Date.now() + 3600000); //1 hour

        // res.cookie('access_token', token, {httpOnly: true, expires: expiryDate, sameSite: 'none', secure: process.env.NODE_ENV === 'production'}).status(200).json(rest);
        res.cookie('access_token', token, {httpOnly: true, expires: expiryDate, sameSite: 'none', secure: process.env.NODE_ENV === 'production'});
        // .status(200).json(rest);
        return res.status(200).json({ ...rest, token });
    } catch (error) {
        next(error);
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

        const token = jwt.sign({id: validUser._id, role: validUser.role}, process.env.JWT_SECRET);

        //removing the password from the client and sending out the rest only
        const {password: hashedPassword, ...rest} = validUser._doc;
        const expiryDate = new Date(Date.now() + 3600000); //1 hour

        res.cookie('access_token', token, {httpOnly: true, expires: expiryDate, sameSite: 'none', secure: process.env.NODE_ENV === 'production'});
        // .status(200).json(rest);
        return res.status(200).json({ ...rest, token });
    } catch (error) {
        next(error);
    }
}

//Technician account sign in
export const signinTechnician = async (req, res, next) => {
    const {email, password} = req.body;
    try {
        const validTechnician = await Technician.findOne({email});

        if (!validTechnician) return next(errorHandler(404, 'Technician not found'));

        const validPassword = bcryptjs.compareSync(password, validTechnician.password);

        if (!validPassword) return next(errorHandler(401, 'Wrong credentials'));

        const token = jwt.sign({id: validTechnician._id, role: validTechnician.role}, process.env.JWT_SECRET);

        //removing the password from the client and sending out the rest only
        const {password: hashedPassword, ...rest} = validTechnician._doc;
        const expiryDate = new Date(Date.now() + 3600000); //1 hour

        res.cookie('access_token', token, {httpOnly: true, expires: expiryDate, sameSite: 'none', secure: process.env.NODE_ENV === 'production'}).status(200).json(rest);
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
                profilePicture: req.body.profilePicture
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

