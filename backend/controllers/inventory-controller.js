import { Prisma } from "../config/prisma.js"

export const getProducts = async (req, res) => {

    try {

        const { page = 1, search = '', limit = 5 } = req.query

        const pageNumber = parseInt(page)
        const pageSize = parseInt(limit)
        const skip = (pageNumber - 1) * pageSize

        const searchCondition = search ? {
            product_name: {
                contains: String(search),
            }
        } : {}

        const products = await Prisma.product.findMany({
            where: searchCondition,
            skip: skip,
            take: pageSize,
            orderBy: {
                id: 'asc'
            }
        })

        let productCount = await Prisma.product.count({
            where: searchCondition
        }
        )
        const totalPage = Math.ceil(productCount / pageSize)

        return res.json({
            data: products,
            pagination: {
                totalPage: totalPage,
                currentPage: pageNumber,
                limit: pageSize
            }
        })
    } catch (err) {
        return res.status(500).json({ message: 'error getting products', error: err.message })
    }

}

export const getProductById = async (req, res) => {
    try {
        const productId = Number(req.params.id)
        const product = await Prisma.product.findUnique({
            where: {
                id: productId
            }
        })

        if (!product) {
            return res.status(404).json({ message: `product id ${productId} not found` })
        }

        return res.status(200).json({ product })
    } catch (err) {
        return res.status(500).json({ message: 'error getting products', error: err.message })
    }
}

export const createProduct = async (req, res) => {
    const { product_name, price, cost_price } = req.body
    const quantity = 0;

    try {
        const newProduct = await Prisma.product.create({
            data: {
                product_name: String(product_name),
                quantity: Number(quantity),
                price: parseFloat(price),
                cost_price: parseFloat(cost_price)
            }
        })

        res.status(201).json({ message: 'add product success' })
    } catch (err) {
        res.status(500).json({ message: 'Error creating product', error: err.message })
    }
}

export const updateProduct = async (req, res) => {
    const { id } = req.params
    const { product_name, price, cost_price } = req.body

    try {
        const updateProduct = await Prisma.product.update({
            where: { id: Number(id) },
            data: {
                product_name: String(product_name),
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

export const receiveProduct = async (req, res) => {
    const { id } = req.params
    const { quantity } = req.body
    try {
        await Prisma.$transaction(async (tx) => {
            await tx.product.update({
                where: { id: Number(id) },
                data: {
                    quantity: { increment: Number(quantity) }
                }
            })

            await tx.transaction.create({
                data: {
                    product_id: Number(id),
                    type: 'INCREASE',
                    quantity: Number(quantity)
                }
            })
        })

        res.status(200).json({ message: 'Product updated successfully' })
    } catch (err) {
        res.status(500).json({ message: 'Error updating quantity', error: err.message })
    }
}

export const deductProduct = async (req, res) => {
    const { id } = req.params
    const { quantity } = req.body
    try {
        await Prisma.$transaction(async (tx) => {
            await tx.product.update({
                where: { id: Number(id) },
                data: {
                    quantity: { decrement: Number(quantity) }
                }
            })

            await tx.transaction.create({
                data: {
                    product_id: Number(id),
                    type: 'DECREASE',
                    quantity: Number(quantity)
                }
            })
        })
        res.status(200).json({ message: 'Product updated successfully' })
    } catch (err) {
        res.status(500).json({ message: 'Error updating quantity', error: err.message })
    }
}