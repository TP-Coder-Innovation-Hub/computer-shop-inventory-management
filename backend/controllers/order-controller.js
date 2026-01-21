import { Prisma } from "../config/prisma.js"

const checkOrderItem = async (item) => {
    const product = await Prisma.product.findUnique({
        where: { id: item.product_id }
    })

    if (!product) {
        throw new Error(`Product ID ${item.product_id} not found`)
    }

    if (product.quantity < item.quantity) {
        throw new Error(`${product.product_name} is not enough stock left`)
    }

    const total_price = product.price * item.quantity

    return {
        product_id: item.product_id,
        quantity: item.quantity,
        total_price: total_price
    }
}

export const createOrder = async (req, res) => {
    try {
        const { items } = req.body

        const orderItems = await Promise.all(items.map(checkOrderItem))

        for (const item of orderItems) {
            await Prisma.product.update({
                where: { id: item.product_id },
                data: {
                    quantity: {
                        decrement: item.quantity
                    }
                }
            })

            await Prisma.transaction.create({
                data: {
                    product_id: item.product_id,
                    type: 'DECREASE',
                    quantity: item.quantity
                }
            })
        }

        const order = await Prisma.order.create({
            data: {
                OrderItem: {
                    create: orderItems
                }
            },
            include: {
                OrderItem: true
            }
        })

        res.status(201).json({ message: 'Order created success', order })
    } catch (err) {
        res.status(500).json({ message: 'Error creating order', error: err.message })
    }
}