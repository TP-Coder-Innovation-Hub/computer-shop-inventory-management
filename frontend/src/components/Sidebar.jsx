
import axios from 'axios';
import React from 'react';
import { Link, useNavigate, useLocation } from "react-router";

const navItems = [
    { name: 'Dashboard', icon: '🏠', path: '/dashboard' },
    { name: 'Inventory', icon: '📦', path: '/inventory' },
    { name: 'Category', icon: '🗂️', path: '/category' },
    { name: 'Order', icon: '📝', path: '/order' },
];

function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    async function handleLogout() {
        try {

            const res = await axios.get(`${import.meta.env.VITE_BACKEND}/logout`, { withCredentials: true })
            navigate('/login')
        } catch (err) {
            console.error('logout error:', err)
        }
    }

    return (
        <nav className="col-span-2 h-screen w-full bg-gray-100/50 flex flex-col items-center justify-center border-r border-gray-200">

            <ul className="flex flex-col gap-6 w-full px-6">
                {navItems.map((item) => (
                    <Link to={item.path} key={item.name}>
                        <li
                            className={`flex items-center gap-5 rounded-xl shadow-md/50 px-5 py-3 font-semibold text-black hover:scale-110 transition-all duration-400 cursor-pointer group
                            ${location.pathname === item.path ? 'bg-orange-500 text-white scale-105' : 'bg-gray-100 hover:bg-orange-100'} `}
                        >
                            <span className="text-2xl group-hover:scale-150 transition-transform duration-400">{item.icon}</span>
                            <span className="text-lg group-hover:transition-colors duration-400">{item.name}</span>
                        </li>
                    </Link>
                ))}

                <li onClick={handleLogout}
                    className={`flex items-center gap-5 rounded-xl shadow-md/50 px-5 py-3 font-semibold text-black hover:scale-110 hover:bg-orange-100 transition-all duration-400 cursor-pointer group`}
                >
                    <span className="text-2xl group-hover:scale-150 transition-transform duration-400">🚪</span>
                    <span className="text-lg group-hover:transition-colors duration-400">Logout</span>
                </li>
            </ul>
        </nav>
    );
}

export default Sidebar