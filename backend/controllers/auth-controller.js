import { Prisma } from "../config/prisma.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body

        const existUsername = await Prisma.user.findFirst({ where: { username } })
        if (existUsername) {
            return res.status(400).json({ message: 'Username already exist' })
        }

        const existEmail = await Prisma.user.findFirst({ where: { email } })
        if (existEmail) {
            return res.status(400).json({ message: 'Email already exist' })
        }

        const hashPassword = await bcrypt.hash(String(password), parseInt(process.env.SALT_ROUND))

        const registerUser = await Prisma.user.create({
            data: {
                username,
                email,
                password: hashPassword
            }
        })

        if (!registerUser) {
            return res.status(500).json({ message: 'User register fail' })
        }

        return res.json({ message: 'Register success' })

    } catch (err) {
        return res.status(500).json({ message: 'Register error', error: err.message })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const existUser = await Prisma.user.findFirst({ where: { email } })

        if (!existUser) {
            return res.status(400).json({ message: 'Incorrect email or password' })
        }

        const passwordMatch = await bcrypt.compare(String(password), existUser.password)

        if (!passwordMatch) {
            return res.status(400).json({ message: 'Incorrect email or password' })
        }

        let payload = {
            id: existUser.id,
            username: existUser.username,
        }

        const token = jwt.sign(payload, String(process.env.JWT_SECRET), { expiresIn: '1h' })

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000
        })

        return res.json({ message: 'Login success', role: existUser.role })

    } catch (err) {
        return res.status(500).json({ message: 'Login fail', error: err.message })
    }
}

export const getUserRole = async (id) => {
    const userId = parseInt(id)

    const user = await Prisma.user.findFirst({
        where: { id: userId },
        select: { role: true }
    })

    return user.role
}

export const authCheck = async (req, res) => {
    res.status(200).json({ message: 'already login' })
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'strict',
        })
        return res.json({ message: 'Logout success' })
    } catch (err) {
        return res.status(500).json({ message: 'Logout fail', error: err.message })
    }
}