import Joi from 'joi'

const productSchema = Joi.object({
    email: Joi.string().min(1).max(100).required(),
    password: Joi.string().min(1).max(255).required(),
})

export const validateLogin = (req, res, next) => {
    const { error } = productSchema.validate(req.body)

    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    next()
}