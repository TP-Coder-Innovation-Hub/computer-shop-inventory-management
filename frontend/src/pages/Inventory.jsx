import React, { useEffect } from 'react'
import MainLayout from '../layouts/MainLayout'
import { IoSearch } from "react-icons/io5";
import axios from 'axios'
import Table from '../components/Table';
import Pagination from '../components/Pagination';
import { useState } from 'react';
import LimitSelector from '../components/LimitSelector';

function Inventory() {

  const [products, setProducts] = useState([])
  const [pageSize, setPageSize] = useState()
  const [activePage, setActivePage] = useState(1)
  const [limit, setLimit] = useState(5)
  const [pageGroup, setPageGroup] = useState(0) // สำหรับแบ่งกลุ่มเลขหน้า

  async function fetchProducts(page = 1, limit = 5) {
    try {
      const res = await axios.get(`${String(import.meta.env.VITE_BACKEND)}/inventory?page=${page}&limit=${limit}`)
      setProducts(res.data.data)
      setPageSize(res.data.pagination.totalPage)
      setActivePage(res.data.pagination.activePage ?? page)
      setLimit(res.data.pagination.limit)
    } catch (err) {
      console.error('Fetch error:', err.message)
    }
  }

  function handlePageChange(page) {
    fetchProducts(page, limit)
    setActivePage(page)
  }

  // คำนวณกลุ่มเลขหน้า
  const pageButtons = [];
  const groupSize = 5;
  const totalGroups = Math.ceil((pageSize || 0) / groupSize);
  const startPage = pageGroup * groupSize + 1;
  const endPage = Math.min(startPage + groupSize - 1, pageSize || 0);
  for (let i = startPage; i <= endPage; i++) {
    pageButtons.push(i);
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(()=>{
    fetchProducts(1,limit)
  },[limit])


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

        <LimitSelector limit={limit} setLimit={setLimit} />

        <Table products={products} />

        <div className='flex justify-center mt-6 gap-2'>
          <Pagination
            activePage={activePage}
            pageButtons={pageButtons}
            pageGroup={pageGroup}
            totalGroups={totalGroups}
            handlePageChange={handlePageChange}
            setPageGroup={setPageGroup}
          />
        </div>
      </div>
    </MainLayout>
  )
}

export default Inventory