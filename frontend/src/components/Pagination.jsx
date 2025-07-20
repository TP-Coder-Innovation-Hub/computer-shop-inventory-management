import React from 'react';

function Pagination({ activePage, pageButtons, pageGroup, totalGroups, handlePageChange, setPageGroup }) {
  return (
    <div className='flex items-center'>
      {/* ปุ่มย้อนกลับกลุ่มหน้า */}
      {pageGroup > 0 && (
        <button
          className="px-3 py-1 rounded-full bg-gray-400 text-white font-bold hover:scale-110 duration-200 cursor-pointer mr-2"
          onClick={() => setPageGroup(pageGroup - 1)}
        >
          {'<'}
        </button>
      )}
      {/* ปุ่มเลขหน้า */}
      {pageButtons.map((page) => (
        <button
          key={page}
          className={`px-3 py-1 rounded-full ${activePage === page ? 'bg-orange-500 text-white font-semibold' : 'bg-white text-black font-semibold'} hover:scale-110 duration-200 cursor-pointer mr-2`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      ))}
      {/* ปุ่มไปกลุ่มหน้าถัดไป */}
      {pageGroup < totalGroups - 1 && (
        <button
          className="px-3 py-1 rounded-full bg-gray-400 text-white font-bold hover:scale-110 duration-200 cursor-pointer mr-2"
          onClick={() => setPageGroup(pageGroup + 1)}
        >
          {'>'}
        </button>
      )}
    </div>
  );
}

export default Pagination;
