import { newUserSignUpSocket } from "../sockets/newSignUpSocket.js";
import { prisma } from '../prisma.js'

export const handleLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User with this email doesn't exist!",
            });
        }

        if (user.password !== password) {
            return res.status(401).json({
                success: false,
                message: "Incorrect Password! Please Try Again..",
            });
        }

        const { password: _, ...userWithoutPassword } = user;

        return res.status(200).json({
            success: true,
            userData: userWithoutPassword,
            message: "Login Successful!",
        });

    } catch (err) {
        console.error("Error during login:", err);
        return res.status(500).json({
            success: false,
            message: "Login failed. Please try again.",
        });
    }
};


export const handleRegister = async (req, res) => {
    const { name, email, username, password } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(401).json({
                success: false,
                message: "User with this email already exists!",
            });
        }

        const usernameTaken = await prisma.user.findUnique({
            where: { username },
        })

        if (usernameTaken) {
            return res.status(401).json({
                success: false,
                message: "Username is already taken!",
            });
        }

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                username,
                password: password,
            },
        });

        newUserSignUpSocket();

        const { password: _, ...userWithoutPassword } = newUser;

        return res.status(200).json({
            success: true,
            userData: userWithoutPassword,
            message: "Registration Successful!",
        });
    } catch (err) {
        console.error("Error during registration:", err);
        return res.status(500).json({
            success: false,
            message: "Registration failed. Please try again.",
        });
    }
};
