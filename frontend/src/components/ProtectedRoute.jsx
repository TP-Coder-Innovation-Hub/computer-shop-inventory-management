import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router'

export default function ProtectedRoute() {

    const [login, setLogin] = useState(null)
    const [loading, setLoading] = useState(true)

    async function checkAuth() {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND}/inventory`,
                { withCredentials: true }
            )
            if (res.status === 200) {
                setLogin(true)
            } else {
                setLogin(false)
            }
        } catch (err) {
            setLogin(false)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        checkAuth()
    }, [])

    if (loading) return

    return login ? <Outlet /> : <Navigate to="/login" />
}
