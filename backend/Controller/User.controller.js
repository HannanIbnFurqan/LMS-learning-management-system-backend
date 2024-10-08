
import AppError from "../utils/error.utils.js";
import UserModel from "../Model/User.model.js";

// 
const cookieOption = {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true
}
const register = async (req, res, next) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return next(new AppError('All fields are required', 400));
    }

    const userExists = await UserModel.findOne({ email });
    // console.log("UserExists : ", userExists);

    if (userExists) {
        // res.send('User Already Exist', 400);  remove this line after review
        return next(new AppError("User already exists!", 400))
    }

    const user = await UserModel.create({
        fullName,
        email,
        password,
        avatar: {
            public_id: email,
            secure_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSppkoKsaYMuIoNLDH7O8ePOacLPG1mKXtEng&s'
        }
    })
// console.log("User : ", user);
    if (!user) {
        return next(new AppError('User not Register '))
    }

    await user.save();
    user.password = undefined;
    const token = await user.generateJwtToken();

    res.cookie('token', token, cookieOption);

    res.status(201).json(
        {
            success: true,
            message: 'User Successfully Register',
            user
        }
    )
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new AppError('All field Are require', 400));
        }

        const user = await UserModel.findOne({ email }).select("+password")
        console.log("User : ", user);
        console.log("LOGIN");

        if (!user || !user.comparePassword(password)) {
            return next(new AppError('Email or Password are Wrong', 400));

        }
        
        const token = await user.generateJwtToken();
        user.password = undefined;
        res.cookie('token', token, cookieOption);

        res.status(200).json(
            {
                success: true,
                message: 'Login Successfully'
            }
        )


    } catch (error) {
        return next(new AppError(error.message, 400))

    }

}

const logout = (req, res) => {
  res.cookie('token', null,{
    maxAge: 0,
    secure: true,
    httpOnly: true
  });

  res.status(200).json(
    {
        success: true,
        message: "Successfully logout"
    }
  )
}

const getProfile = (req, res) => {

}

export { register, login, logout, getProfile }