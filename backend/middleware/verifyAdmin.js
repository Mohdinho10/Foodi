import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const verifyAdmin = async (req, res, next) => {
    const email = req.decoded.email;
    const query ={email: email};

    const user = await User.findOne(query);
    console.log(user)
    const isAdmin = user?.role == 'admin';

    if(!isAdmin){
        return res.status(403).send({message: "forbidden access!"})
    }

    next();
};
