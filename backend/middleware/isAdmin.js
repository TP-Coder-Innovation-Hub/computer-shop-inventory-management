export const isAdmin = (req, res, next) => {
    try {

        const role = req.user.role
        if (role !== 'ADMIN') {
            return res.status(403).json({ message: 'access denied' })
        }
        next()
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }

};