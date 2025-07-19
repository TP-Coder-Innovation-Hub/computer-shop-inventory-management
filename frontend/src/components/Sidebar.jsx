
import React from 'react';
import { Link, useLocation } from "react-router";

const navItems = [
    { name: 'Dashboard', icon: '🏠', path: '/dashboard' },
    { name: 'Inventory', icon: '📦', path: '/inventory' },
    { name: 'Category', icon: '🗂️', path: '/category' },
    { name: 'Order', icon: '📝', path: '/order' },
];

function Sidebar() {
  const location = useLocation();

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
            </ul>
        </nav>
    );
}

export default Sidebar