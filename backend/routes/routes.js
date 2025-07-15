import express from 'express'
import { createProduct, deleteProduct, getAllProducts, updateProduct } from '../controllers/inventory-controller.js'

const router = express.Router()

// inventory routes
router.get('/inventory', getAllProducts)
router.post('/inventory', createProduct)
router.put('/inventory/:id', updateProduct)
router.delete('/inventory/:id', deleteProduct)

export default router