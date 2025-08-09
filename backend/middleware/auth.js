import jwt from 'jsonwebtoken'
import { getUserRole } from '../controllers/auth-controller.js';

export const authentication = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decode = jwt.verify(token, String(process.env.JWT_SECRET));
        req.user = decode;
        req.user.role = await getUserRole(req.user.id)

        next();
    } catch (err) {
        return res.status(500).json({ message: 'Authentication error', error: err });
    }
};