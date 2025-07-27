import React, { useEffect } from 'react'
import MainLayout from '../layouts/MainLayout'
import { IoSearch } from "react-icons/io5";
import axios from 'axios'
import Table from '../components/Table';
import Pagination from '../components/Pagination';
import { useState } from 'react';
import LimitSelector from '../components/LimitSelector';
import Modal from '../components/Modal';
import Swal from 'sweetalert2'

function Inventory() {

  const [products, setProducts] = useState([])
  const [pageSize, setPageSize] = useState()
  const [activePage, setActivePage] = useState(1)
  const [limit, setLimit] = useState(5)
  const [pageGroup, setPageGroup] = useState(0) // สำหรับแบ่งกลุ่มเลขหน้า
  const [addModal, setAddModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);

  const [productName, setProductName] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [price, setPrice] = useState(1)
  const [costPrice, setCostPrice] = useState(1)
  const [updateId, setUpdateId] = useState(0)

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

  async function fetchProducts(page = 1, limit = 5) {
    try {
      const res = await axios.get(`${String(import.meta.env.VITE_BACKEND)}/inventory?page=${page}&limit=${limit}`)
      setProducts(res.data.data)
      setPageSize(res.data.pagination.totalPage)
      setActivePage(res.data.pagination.activePage ?? page)
      setLimit(res.data.pagination.limit)
    } catch (err) {
      await Toast.fire({
        icon: 'error',
        title: err.message
      })
    }
  }

  function handlePageChange(page) {
    fetchProducts(page, limit)
    setActivePage(page)
  }

  async function handleAddProduct(e) {
    e.preventDefault()

    const productData = {
      product_name: String(productName),
      quantity: parseInt(quantity),
      price: parseFloat(price),
      cost_price: parseFloat(costPrice)
    }

    try {
      const res = await axios.post(`${String(import.meta.env.VITE_BACKEND)}/inventory`, productData)
      fetchProducts(activePage, limit)
      setAddModal(false)
      setProductDefaultValue()
      await Toast.fire({
        icon: 'success',
        title: res.data.message
      })
    } catch (err) {
      await Toast.fire({
        icon: 'error',
        title: err.response.data.message,
      })
    }

  }

  async function handleDelete(e, id) {
    e.preventDefault()

    const result = await Swal.fire({
      text: "Do you really want to delete?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete"
    })

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(`${String(import.meta.env.VITE_BACKEND)}/inventory/${id}`)
        fetchProducts(activePage, limit)
        await Toast.fire({
          icon: 'success',
          title: res.data.message,
        })
      } catch (err) {
        await Toast.fire({
          icon: 'error',
          title: err.response.data.message,
        })
      }
    }

  }

  async function getUpdateData(productId) {
    try {
      setUpdateId(productId)
      const res = await axios.get(`${String(import.meta.env.VITE_BACKEND)}/inventory/${productId}`)
      const data = res.data.product
      setProductName(data.product_name)
      setQuantity(data.quantity)
      setPrice(data.price)
      setCostPrice(data.cost_price)
      setUpdateModal(true)
    } catch {
      await Toast.fire({
        icon: 'error',
        title: err.response.data.message,
      })
    }
  }

  async function handleUpdateProduct(e) {
    e.preventDefault()
    try {
      const productData = {
        product_name: String(productName),
        quantity: parseInt(quantity),
        price: parseFloat(price),
        cost_price: parseFloat(costPrice)
      }
      const res = await axios.put(`${String(import.meta.env.VITE_BACKEND)}/inventory/${updateId}`, productData)
      setProductDefaultValue()
      fetchProducts(activePage, limit)
      setUpdateModal(false)
      await Toast.fire({
        icon: 'success',
        title: res.data.message,
      })
    } catch (err) {
      setProductDefaultValue()
      await Toast.fire({
        icon: 'error',
        title: err.response.data.message,
      })
    }
  }

  function setProductDefaultValue() {
    setProductName('')
    setQuantity(0)
    setPrice(1)
    setCostPrice(1)
    setUpdateId(0)
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

  useEffect(() => {
    fetchProducts(1, limit)
  }, [limit])


  return (
    <MainLayout>
      <div className='grid grid-cols-12 gap-x-8'>
        <div className='flex justify-center col-span-10 gap-x-2'>
          <input className='flex items-center w-full border-1 border-gray-400 rounded-xl px-5 py-1' type="text" name="" placeholder='Search' id="" />
          <button className='bg-gray-300 rounded-full p-2 flex items-center hover:scale-110 duration-300 cursor-pointer'><IoSearch /></button>
        </div>

        <div className='flex items-center col-span-2'>
          <button className='cursor-pointer font-semibold bg-green-500 text-white py-1 px-3 rounded-xl hover:scale-110 duration-500'
            onClick={() => setAddModal(true)}>Add Product</button>
        </div>
      </div>


      <div className='mt-10'>

        <LimitSelector limit={limit} setLimit={setLimit} />

        <Table products={products} handleDelete={handleDelete} getUpdateData={getUpdateData} />

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

      {/* add product modal */}
      <Modal isOpen={addModal}>
        <form onSubmit={handleAddProduct}>
          <div className='flex flex-col gap-y-5'>

            <div>
              <label className='text-sm/6 font-medium text-gray-900'>Product name</label>
              <div className='mt-2'>
                <div className="flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:outline-indigo-600">
                  <input type="text" minLength={1} maxLength={100} className="block min-w-0 grow py-1.5 pr-3 pl-1 placeholder:text-gray-400 focus:outline-none"
                    onChange={(e) => setProductName(e.target.value)} placeholder='Enter Product name' required />
                </div>
              </div>
            </div>

            <div>
              <label className='text-sm/6 font-medium text-gray-900'>Quantity</label>
              <div className='mt-2'>
                <div className="flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:outline-indigo-600">
                  <input type="number" min={0} defaultValue={0} className="block min-w-0 grow py-1.5 pr-3 pl-1 placeholder:text-gray-400 focus:outline-none"
                    onChange={(e) => setQuantity(e.target.value)} />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm/6 font-medium text-gray-900">Price / Unit</label>
              <div className="mt-2">
                <div className="flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:outline-indigo-600">
                  <div className="shrink-0 text-gray-500 select-none text-sm">฿</div>
                  <input type="number" min={1} defaultValue={1} className="block min-w-0 grow py-1.5 pr-3 pl-1 placeholder:text-gray-400 focus:outline-none"
                    onChange={(e) => setPrice(e.target.value)} />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm/6 font-medium text-gray-900">Cost Price / Unit</label>
              <div className="mt-2">
                <div className="flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:outline-indigo-600">
                  <div className="shrink-0 text-gray-500 select-none text-sm">฿</div>
                  <input type="number" min={1} defaultValue={1} className="block min-w-0 grow py-1.5 pr-3 pl-1 placeholder:text-gray-400 focus:outline-none"
                    onChange={(e) => setCostPrice(e.target.value)} />
                </div>
              </div>
            </div>

            <div className='flex justify-center gap-x-2 mt-4'>
              <button type='button' className='bg-red-500 text-white p-2 rounded-xl w-full hover:bg-red-600 hover:scale-105 duration-300 cursor-pointer' onClick={() => { setProductDefaultValue(); setAddModal(false) }}>Close</button>
              <button type='submit' className='bg-green-500 text-white p-2 rounded-xl w-full hover:bg-green-600 hover:scale-105 duration-300 cursor-pointer'>Add</button>
            </div>

          </div>
        </form>
      </Modal>

      {/* update product modal */}
      <Modal isOpen={updateModal}>
        <form onSubmit={handleUpdateProduct}>
          <div className='flex flex-col gap-y-5'>
            <div>
              <label className='text-sm/6 font-medium text-gray-900'>Product name</label>
              <div className='mt-2'>
                <div className="flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:outline-indigo-600">
                  <input type="text" minLength={1} maxLength={100} className="block min-w-0 grow py-1.5 pr-3 pl-1 placeholder:text-gray-400 focus:outline-none"
                    onChange={(e) => setProductName(e.target.value)} placeholder='Enter Product name' value={productName} required />
                </div>
              </div>
            </div>

            <div>
              <label className='text-sm/6 font-medium text-gray-900'>Quantity</label>
              <div className='mt-2'>
                <div className="flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:outline-indigo-600">
                  <input type="number" min={0} className="block min-w-0 grow py-1.5 pr-3 pl-1 placeholder:text-gray-400 focus:outline-none"
                    onChange={(e) => setQuantity(e.target.value)} value={quantity} />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm/6 font-medium text-gray-900">Price / Unit</label>
              <div className="mt-2">
                <div className="flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:outline-indigo-600">
                  <div className="shrink-0 text-gray-500 select-none text-sm">฿</div>
                  <input type="number" min={1} className="block min-w-0 grow py-1.5 pr-3 pl-1 placeholder:text-gray-400 focus:outline-none"
                    onChange={(e) => setPrice(e.target.value)} value={price} />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm/6 font-medium text-gray-900">Cost Price / Unit</label>
              <div className="mt-2">
                <div className="flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:outline-indigo-600">
                  <div className="shrink-0 text-gray-500 select-none text-sm">฿</div>
                  <input type="number" min={1} className="block min-w-0 grow py-1.5 pr-3 pl-1 placeholder:text-gray-400 focus:outline-none"
                    onChange={(e) => setCostPrice(e.target.value)} value={costPrice} />
                </div>
              </div>
            </div>

            <div className='flex justify-center gap-x-2 mt-4'>
              <button type='button' className='bg-red-500 text-white p-2 rounded-xl w-full hover:bg-red-600 hover:scale-105 duration-300 cursor-pointer' onClick={() => { setProductDefaultValue(); setUpdateModal(false) }}>Close</button>
              <button type='submit' className='bg-green-500 text-white p-2 rounded-xl w-full hover:bg-green-600 hover:scale-105 duration-300 cursor-pointer'>Update</button>
            </div>

          </div>
        </form>
      </Modal>
    </MainLayout>
  )
}

export default Inventory