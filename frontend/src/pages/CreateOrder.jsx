import React, { useState } from 'react'
import axios from 'axios'
import MainLayout from '../layouts/MainLayout'

function CreateOrder() {
    const [productId, setProductId] = useState('')
    const [quantity, setQuantity] = useState('')
    const [orderItems, setOrderItems] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleAddProduct = async () => {
        setError('')

        if (!productId || !quantity) {
            setError('Please fill Product ID and Quantity')
            return
        }

        if (isNaN(quantity) || Number(quantity) <= 0) {
            setError('Quantity must greater than zero')
            return
        }

        try {
            const res = await axios.get(`${String(import.meta.env.VITE_BACKEND)}/inventory/${productId}`, { withCredentials: true })
            const product = res.data.product

            if (!product) {
                setError('Product not found')
                return
            }

            if (product.quantity < Number(quantity)) {
                setError(`only ${product.quantity} left in stock`)
                return
            }

            const existingItem = orderItems.find(item => item.product_id === product.id)

            if (existingItem) {
                const updatedItems = orderItems.map(item =>
                    item.product_id === product.id
                        ? {
                            ...item,
                            quantity: Number(item.quantity) + Number(quantity),
                            total_price: (Number(item.quantity) + Number(quantity)) * item.price
                        }
                        : item
                )
                setOrderItems(updatedItems)
            } else {
                const newItem = {
                    product_id: product.id,
                    product_name: product.product_name,
                    price: product.price,
                    quantity: Number(quantity),
                    total_price: product.price * Number(quantity)
                }
                setOrderItems([...orderItems, newItem])
            }

            setProductId('')
            setQuantity('')
        } catch (err) {
            setError(err.response?.data?.message)
        }
    }

    const handleRemoveItem = (productId) => {
        setOrderItems(orderItems.filter(item => item.product_id !== productId))
    }

    const handleUpdateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            handleRemoveItem(productId)
            return
        }

        const updatedItems = orderItems.map(item =>
            item.product_id === productId
                ? {
                    ...item,
                    quantity: newQuantity,
                    total_price: newQuantity * item.price
                }
                : item
        )
        setOrderItems(updatedItems)
    }

    const totalOrderPrice = orderItems.reduce((sum, item) => sum + item.total_price, 0)

    const handleCreateOrder = async () => {
        if (orderItems.length === 0) {
            setError('please add at least one product to order')
            return
        }

        setLoading(true)
        setError('')
        setSuccess('')

        try {
            const payload = {
                items: orderItems.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity
                }))
            }

            await axios.post(`${String(import.meta.env.VITE_BACKEND)}/order`, payload, { withCredentials: true })
            setSuccess('Create Order Success')
            setOrderItems([])
            setProductId('')
            setQuantity('')
        } catch (err) {
            setError(err.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <MainLayout>
            <div className="min-h-screen p-4 md:p-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">Create Order</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Form Section */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">

                                {error && (
                                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                                        {success}
                                    </div>
                                )}

                                <div className="space-y-4 mb-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Product ID
                                            </label>
                                            <input
                                                type="number"
                                                value={productId}
                                                onChange={(e) => setProductId(e.target.value)}
                                                placeholder="Enter Product ID"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Quantity
                                            </label>
                                            <input
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => setQuantity(e.target.value)}
                                                placeholder="Enter Quantity"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleAddProduct}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 transform hover:scale-105"
                                    >
                                        + Add
                                    </button>
                                </div>

                                {/* Order Items Table */}
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Order List</h3>

                                    {orderItems.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            No products added yet.
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="bg-gray-100 border-b border-gray-200">
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Product Name</th>
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Price</th>
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Quantity</th>
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Total</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {orderItems.map((item) => (
                                                        <tr key={item.product_id} className="border-b border-gray-200 hover:bg-gray-50">
                                                            <td className="px-4 py-3 text-gray-800">{item.product_name}</td>
                                                            <td className="px-4 py-3 text-gray-800">฿{item.price.toFixed(2)}</td>
                                                            <td className="px-4 py-3">
                                                                <input
                                                                    type="number"
                                                                    value={item.quantity}
                                                                    onChange={(e) => handleUpdateQuantity(item.product_id, Number(e.target.value))}
                                                                    className="w-16 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                />
                                                            </td>
                                                            <td className="px-4 py-3 font-semibold text-gray-800">฿{item.total_price.toFixed(2)}</td>
                                                            <td className="px-4 py-3 text-center">
                                                                <button
                                                                    onClick={() => handleRemoveItem(item.product_id)}
                                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition cursor-pointer"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Summary Section */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                                <h3 className="text-xl font-semibold text-gray-700 mb-6">Summary</h3>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-700">
                                        <span>Total Product:</span>
                                        <span className="font-semibold">{orderItems.length}</span>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="flex justify-between text-lg font-bold text-gray-800">
                                            <span>Total Price:</span>
                                            <span className="text-blue-600">฿{totalOrderPrice.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCreateOrder}
                                    disabled={orderItems.length === 0 || loading}
                                    className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition duration-200 ${orderItems.length === 0 || loading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-700 transform hover:scale-105'
                                        }`}
                                >
                                    {loading ? 'Create...' : 'Create Order'}
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default CreateOrder