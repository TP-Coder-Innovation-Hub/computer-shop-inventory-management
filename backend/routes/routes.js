import express from 'express'
import { createProduct, deleteProduct, getProducts, getProductById, updateProduct } from '../controllers/inventory-controller.js'
import { validateProduct } from '../middleware/inventory-validate.js'
import { createOrder } from '../controllers/order-controller.js'

const router = express.Router()

// inventory routes
router.get('/inventory', getProducts)
router.get('/inventory/:id', getProductById)
router.post('/inventory', validateProduct, createProduct)
router.put('/inventory/:id', validateProduct, updateProduct)
router.delete('/inventory/:id', deleteProduct)

// order routes
router.post('/order', createOrder)

// dashboard routes

export default router