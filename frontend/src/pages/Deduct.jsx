import React, { useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import { useParams, useNavigate } from 'react-router'
import axios from 'axios'

function Deduct() {
    const [quantity, setQuantity] = useState('')
    const { id } = useParams()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        const payload = {
            quantity: Number(quantity),
        }

        if (!quantity || quantity < 1) {
            return
        }

        try {
            const res = await axios.patch(
                `${import.meta.env.VITE_BACKEND}/product/${id}/decrease`,
                payload,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
            if (res.status === 200) {
                navigate('/inventory')
            }
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <MainLayout>

            <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2
                        focus:outline-none focus:ring-2 focus:ring-orange-500
                        focus:border-orange-500"
                            placeholder="Deduct Quantity"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-orange-500 text-white py-2 rounded-lg
                    hover:bg-orange-600 transition font-medium cursor-pointer"
                    >
                        Deduct
                    </button>
                </form>
            </div>
        </MainLayout>
    )
}

export default Deduct
