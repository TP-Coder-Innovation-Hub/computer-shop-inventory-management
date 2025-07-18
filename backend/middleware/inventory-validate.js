import Joi from 'joi'

const productSchema = Joi.object({
    product_name: Joi.string().min(1).max(100).required(),
    quantity: Joi.number().integer().min(0).required(),
    price: Joi.number().min(1).required(),
    cost_price: Joi.number().min(1).required()
})

export const validateProduct = (req,res,next)=>{
    const { error } = productSchema.validate(req.body)

    if (error){
        return res.status(400).json({ message: error.details[0].message})
    }

    next()
}