import express from 'express'
import { createProduct, deleteProduct, getProducts, getProductById, updateProduct } from '../controllers/inventory-controller.js'
import { validateProduct } from '../middleware/inventory-validate.js'
import { createOrder } from '../controllers/order-controller.js'
import { authCheck, login, logout, register } from '../controllers/auth-controller.js'
import { authentication } from '../middleware/auth.js'
import { validateRegister } from '../middleware/register-validate.js'
import { validateLogin } from '../middleware/login-validate.js'
import { isAdmin } from '../middleware/isAdmin.js'

const router = express.Router()

// inventory routes
router.get('/inventory', authentication, getProducts)
router.get('/inventory/:id', authentication, getProductById)
router.post('/inventory', authentication, isAdmin, validateProduct, createProduct)
router.put('/inventory/:id', authentication, isAdmin, validateProduct, updateProduct)
router.delete('/inventory/:id', authentication, isAdmin, deleteProduct)

// order routes
router.post('/order', authentication, createOrder)

// dashboard routes

// authentication routes
router.post('/register', validateRegister, register)
router.post('/login', validateLogin, login)
router.get('/logout', authentication, logout)

export default router