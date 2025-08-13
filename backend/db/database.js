import mongoose from "mongoose";
import dotenv from 'dotenv';



dotenv.config();

const database = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        
        console.log("Connected success");
        
    }catch(err){
        console.log("Server error");
        
    }
}

export default database;
