import React from 'react'
import { MdModeEdit,MdDelete } from "react-icons/md";

function Table({ products = [] }) {
    return (
        <div>
            <table className="min-w-full shadow-md overflow-hidden">
                <colgroup>
                    <col className="w-12" />
                    <col className="w-64" />
                    <col className="w-15" />
                    <col className="w-15" />
                    <col className="w-15" />
                </colgroup>
                <thead>
                    <tr className="bg-gray-400">
                        <th className="px-4 py-2 text-white border border-gray-300 text-left">PID</th>
                        <th className="px-4 py-2 text-white border border-gray-300 text-left">Product Name</th>
                        <th className="px-4 py-2 text-white border border-gray-300 text-center">Price(THB)</th>
                        <th className="px-4 py-2 text-white border border-gray-300 text-center">Quantity</th>
                        <th className="px-4 py-2 text-white border border-gray-300 text-center"></th>
                    </tr>
                </thead>
                <tbody>
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="text-center py-6 text-gray-400">Product Data Empty</td>
                        </tr>
                    ) : (
                        products.map((item, idx) => (
                            <tr key={item.id} className={idx % 2 === 0 ? 'bg-blue-50  ' : 'bg-blue-100'}>
                                <td className="px-4 py-2 border border-gray-300">{item.id}</td>
                                <td className="px-4 py-2 border border-gray-300 max-w-xs whitespace-nowrap overflow-hidden text-ellipsis">{item.product_name}</td>
                                <td className="px-4 py-2 border border-gray-300 text-right">{(item.price).toFixed(2).toLocaleString('th-TH')}</td>
                                <td className="px-4 py-2 border border-gray-300 text-right">{(item.quantity).toLocaleString('th-TH')}</td>
                                <td className="py-2 border border-gray-300 text-right">
                                    <div className='flex justify-center gap-x-2'>
                                        <button className='flex items-center bg-yellow-500 hover:bg-yellow-700 cursor-pointer hover:scale-110 duration-200 px-5 py-2 rounded-xl text-white'><MdModeEdit /></button>
                                        <button className='flex items-center bg-red-500 hover:bg-red-700 cursor-pointer hover:scale-110 duration-200 px-5 py-2 rounded-xl text-white'><MdDelete /></button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Table