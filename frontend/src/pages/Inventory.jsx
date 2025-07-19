import React, { useEffect } from 'react'
import MainLayout from '../layouts/MainLayout'
import { IoSearch } from "react-icons/io5";
import axios from 'axios'
import Table from '../components/Table';
import { useState } from 'react';

function Inventory() {
  
  const[products,setProducts] = useState([])
  const[pageSize,setPageSize] = useState()
  const[activePage,setActivePage] = useState(1)
  const[limit,setLimit] = useState(5)

  async function fetchProducts(page = 1){
    try {
      const res = await axios.get(`http://localhost:3000/api/inventory?page=${page}`)
      setProducts(res.data.data)
      setPageSize(res.data.pagination.totalPage)
      setActivePage(res.data.pagination.activePage ?? page)
      setLimit(res.data.pagination.limit)
    } catch (err) {
      console.error('Fetch error:', err.message)
    }
  }

  function handlePageChange(page){
    fetchProducts(page)
    setActivePage(page)
  }

  useEffect(()=>{console.log(`activePage = ${activePage}`)},[activePage])

  useEffect(()=>{
    fetchProducts()
  },[])

  useEffect(()=>{
    console.log(products)
  },[products])


  return (
   <MainLayout>
    <div className='grid grid-cols-12 gap-x-8'>
        <div className='flex justify-center col-span-10 gap-x-2'>
          <input className='flex items-center w-full border-1 border-gray-400 rounded-xl px-5 py-1' type="text" name="" placeholder='Search' id="" />
          <button className='bg-gray-300 rounded-full p-2 flex items-center hover:scale-110 duration-300 cursor-pointer'><IoSearch /></button>
        </div>

        <div className='flex items-center col-span-2'>
          <button className='cursor-pointer font-semibold bg-green-500 text-white py-1 px-3 rounded-xl hover:scale-110 duration-500' >Add Product</button>
        </div>
    </div>
    

    <div className='mt-10'>
      <Table products={products} />

      <div className='flex justify-center mt-6 gap-2'>
        {Array.from({ length: pageSize || 0 }, (_, i) => (
          <button
            key={i+1}
            className={`px-3 py-1 rounded-full ${activePage === i+1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'} hover:scale-130 duration-200 cursor-pointer`}
            onClick={() => handlePageChange(i+1)}
          >
            {i+1}
          </button>
        ))}
      </div>
    </div>
   </MainLayout>
  )
}

export default Inventory