import { registerUser, loginUser } from "../services/auth.service.js";
import { validationResult } from "express-validator";
import AppError from "../utils/AppError.js";


export const register = async (req, res) => {
	try {

		//validate the input first
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res.status(400).json({ errors: errors.array() });

		const data = req.body; //data extraction
		const user = await registerUser(data); //service call
		return res.status(201).json(user);// send response
	} catch (err) {

		if (err.code === "23505") {
			return res.status(409).json({ message: "Email already exists" });
		}

		if(err.statusCode === 409){
			return res.status(409).json({ message: err.message });
		}

		return res.status(500).json({ message: "Registration failed" });
	}
};


export const login = async (req, res) => {
	try {

		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res.status(400).json({ errors: errors.array() });

		// same logic but with login
		const data = req.body;
		const user = await loginUser(data);
		return res.status(200).json(user);
	} catch (err) {

		if(err instanceof AppError) {
			return res.status(err.statusCode).json({
				message: err.message
			});
		}

		return res.status(500).json({ message: "Login failed" });
	}
};


//200 => UserLogin
//201 => UserCreated
//401 => registration Details are Invalid
//409 => User Side Error(Verification)
//500 => Server Side Error