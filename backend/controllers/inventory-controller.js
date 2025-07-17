import { Prisma } from "../config/prisma.js"

export const getAllProducts = async (req, res) => {
    const product = await Prisma.product.findMany()
    res.json(product)
}

export const createProduct = async (req, res) => {
    const { product_name, quantity, price, cost_price } = req.body

    try {
        const newProduct = await Prisma.product.create({
            data: {
                product_name: String(product_name),
                quantity: Number(quantity),
                price: parseFloat(price),
                cost_price: parseFloat(cost_price)
            }
        })

        res.status(201).json({ message: 'insert success' })
    } catch (err) {
        res.status(500).json({ message: 'Error creating product', error: err.message })
    }
}

export const updateProduct = async (req, res) => {
    const { id } = req.params
    const { product_name, quantity, price, cost_price } = req.body

    try {
        const updateProduct = await Prisma.product.update({
            where: { id: Number(id) },
            data: {
                product_name: String(product_name),
                quantity: Number(quantity),
                price: parseFloat(price),
                cost_price: parseFloat(cost_price)
            }
        })

        res.status(200).json({ message: 'Product updated successfully' })
    } catch (err) {
        res.status(500).json({ message: 'Error updating product', error: err.message })
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params
    try {
        await Prisma.product.delete({
            where: { id: Number(id) }
        })
        res.status(200).json({ message: 'Product deleted successfully' })
    } catch (err) {
        res.status(500).json({ message: 'Error deleting product', error: err.message })
    }
}