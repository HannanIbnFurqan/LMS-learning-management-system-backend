import express from 'express';
import dotenv  from 'dotenv'
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';


// import external file
import userRouter from './Router/User.Router.js';
import errorMiddleware from './middleware/error.midd.js';
// ------------------------------
dotenv.config();

const app = express();
// use  middleware
app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.json());

app.use(cors({
    origin: [],
    credentials: true
}))
app.use('/api/version/user',userRouter)

// all router

app.all('*',(req,res)=>{
    res.status(404).send('OOPS')
})

// error middleware

app.use(errorMiddleware)

export default app;