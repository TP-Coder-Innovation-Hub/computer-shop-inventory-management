import React from 'react'

export default function AuthLayout({ children }) {

  return (
    <div className='h-screen bg-gray-100 flex justify-center items-center'>
      <div className='bg-white w-md p-5 rounded-xl shadow-md/30'>
        {children}
      </div>
    </div>
  )
}
