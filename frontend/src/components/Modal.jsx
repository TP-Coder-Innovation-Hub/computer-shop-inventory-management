import React from 'react'

function Modal({ isOpen, children }) {
    if (!isOpen) return null
    return (
        <div className='flex flex-col items-center justify-center fixed bg-black/50 z-auto top-0 left-0 right-0 bottom-0'>
            <div className='bg-white p-5 rounded-md min-w-sm relative'>
                <div>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal