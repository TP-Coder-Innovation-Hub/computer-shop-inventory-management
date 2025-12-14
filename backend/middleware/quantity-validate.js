import Joi from 'joi'

const productSchema = Joi.object({
    quantity: Joi.number().integer().min(0).required(),

})

export const validateQuantity = (req, res, next) => {
    const { error } = productSchema.validate(req.body)

    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    next()
}