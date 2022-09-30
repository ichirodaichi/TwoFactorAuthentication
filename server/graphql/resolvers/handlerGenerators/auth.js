import User from '../../../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateNumber } from '../../../utils/utils';
import nodemailer from "nodemailer";


export async function createUser(args) {
    try {
        const {
            email,
            password,
            confirm
        } = args.userInput; //retrieve values from arguments

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new Error('User already exists!');
        }

        if (password !== confirm) {
            throw new Error('Passwords are inconsistent!');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            email,
            password: hashedPassword
        }, (err) => { if (err) throw err });

        user.save();

        // if user is registered without errors
        // create a token
        const token = jwt.sign({ id: user._id }, "mysecret");

        return { token, password: null, ...user._doc }
    }
    catch (err) {
        throw err;
    }
}

export async function login(args) {
    try {
        const user = await User.findOne({ email: args.email });
        if (!user) throw new Error('Email does not exist');

        const passwordIsValid = await bcrypt.compareSync(args.password, user.password);
        if (!passwordIsValid) throw new Error('Password incorrect');

        var authNumber = generateNumber();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'ichirodaichi0829@gmail.com',
                pass: 'ypnmbbqxphmcuyix'
            }
        });

        var mailOptions = {
            from: 'ichirodaichi0829@gmail.com',
            to: args.email,
            subject: 'Sending Email using Node.js',
            text: authNumber.toString()
        };

        await transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        const token = jwt.sign({ id: user._id }, "mysecret");

        return { token, password: null, ...user._doc, authNumber : authNumber.toString() }
    }
    catch (err) {
        throw err;
    }
}

export async function verifyToken(args) {
    try {
        const decoded = jwt.verify(args.token, "mysecret");
        const user = await User.findOne({ _id: decoded.id })
        return { ...user._doc, password: null };
    }
    catch (err) {
        throw err;
    }
}