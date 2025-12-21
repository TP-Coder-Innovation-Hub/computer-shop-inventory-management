import React from 'react'
import { MdModeEdit, MdDelete } from "react-icons/md";
import { CiInboxIn, CiInboxOut } from "react-icons/ci";
import { Link } from 'react-router';

function Table({ products = [], handleDelete, getUpdateData }) {
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
                            <td colSpan={4} className="text-center py-6 text-gray-400">Product not found</td>
                        </tr>
                    ) : (
                        products.map((item, idx) => (
                            <tr key={item.id} className={idx % 2 === 0 ? 'bg-blue-50  ' : 'bg-blue-100'}>
                                <td className="px-4 py-2 border border-gray-300">{item.id}</td>
                                <td className="px-4 py-2 border border-gray-300 max-w-xs whitespace-nowrap overflow-hidden text-ellipsis">{item.product_name}</td>
                                <td className="px-4 py-2 border border-gray-300 text-right">{(item.price).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="px-4 py-2 border border-gray-300 text-right">{(item.quantity).toLocaleString('th-TH')}</td>
                                <td className="py-2 border border-gray-300 text-right">
                                    <div className='flex justify-center gap-x-2'>
                                        <Link to={`../receive/${item.id}`} className='flex items-center bg-green-500 hover:bg-green-700 cursor-pointer hover:scale-110 duration-200 px-5 py-2 rounded-xl text-white'><CiInboxIn strokeWidth={2} /></Link>
                                        <Link to={`../deduct/${item.id}`} className='flex items-center bg-blue-500 hover:bg-blue-700 cursor-pointer hover:scale-110 duration-200 px-5 py-2 rounded-xl text-white'><CiInboxOut strokeWidth={2} /></Link>
                                        <button className='flex items-center bg-yellow-500 hover:bg-yellow-700 cursor-pointer hover:scale-110 duration-200 px-5 py-2 rounded-xl text-white' onClick={(e) => getUpdateData(item.id)}><MdModeEdit /></button>
                                        <button className='flex items-center bg-red-500 hover:bg-red-700 cursor-pointer hover:scale-110 duration-200 px-5 py-2 rounded-xl text-white' onClick={(e) => handleDelete(e, item.id)}><MdDelete /></button>
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