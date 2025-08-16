import React, { useState } from 'react'
import AuthLayout from '../layouts/AuthLayout'
import { Link } from 'react-router'
import axios from 'axios'
import Swal from 'sweetalert2'

export default function Register() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')

    const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        iconColor: 'white',
        customClass: {
            popup: 'colored-toast',
        },
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
    })

    async function handleRegister(e) {
        e.preventDefault()
        try {
            const data = { username, email, password }
            const res = await axios.post(`${String(import.meta.env.VITE_BACKEND)}/register`, data)
            await Toast.fire({
                icon: 'success',
                title: res.data.message,
            })
        } catch (err) {
            const msg = err.response?.data?.message || err.message
            console.log("fail:", msg)
            await Toast.fire({
                icon: 'error',
                title: msg,
            })
        }
    }

    return (
        <AuthLayout>
            <form onSubmit={handleRegister}>
                <div className='flex flex-col mb-5'>
                    <label>Username</label>
                    <input type="text" className='shadow-md/30 p-3 border-1 border-gray-200 h-10 rounded-md' onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className='flex flex-col mb-5'>
                    <label>Email</label>
                    <input type="email" className='shadow-md/30 p-3 border-1 border-gray-200 h-10 rounded-md' onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className='flex flex-col mb-5'>
                    <label>Password</label>
                    <input type="password" className='shadow-md/30 p-3 border-1 border-gray-200 h-10 rounded-md' onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type='submit' className='bg-green-500 w-full h-10 text-white rounded-md font-bold cursor-pointer duration-500 hover:scale-105'>Register</button>
            </form>
            <div className='mt-5 flex items-center justify-center'>
                <span className='w-full pe-5'><hr className='border-1 border-gray-300' /></span>
                <p className='text-gray-500 font-bold'>OR</p>
                <span className='w-full ps-5'><hr className='border-1 border-gray-300' /></span>
            </div>
            <Link to={"/login"}><div className='mt-5 text-center bg-blue-500 text-white font-bold cursor-pointer h-10 flex items-center justify-center rounded-md hover:scale-105 duration-500'>Login</div></Link>
        </AuthLayout>
    )
}
