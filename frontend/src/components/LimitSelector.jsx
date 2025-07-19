import React from 'react'

function LimitSelector({ limit, setLimit }) {
  return (
        <div className='mb-5 flex'>
      <p>Products per page :&nbsp;</p>
      <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className='border-gray-300 border-1 w-15 text-center'>
        <option value="1">1</option>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="20">20</option>
      </select>
    </div>
  )
}

export default LimitSelector