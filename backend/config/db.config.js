import mongoose from "mongoose";

let connectDatabase = async () =>{
   try {
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/LMS')
    if(conn.Connection){
     console.log(`connection is successfull ${conn.connection.host}`)
    }
   } catch (error) {
    console.log(error)
    process.exit(1)
   }
 } 

export default connectDatabase;  