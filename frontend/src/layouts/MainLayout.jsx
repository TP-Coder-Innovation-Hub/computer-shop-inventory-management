import React from 'react'
import Sidebar from '../components/Sidebar'

function MainLayout({ children }) {
    return (
        <div className='grid grid-cols-12 sticky top-0 relative'>
            <Sidebar/>
            <div className='bg-white col-span-10'>
                <div className='m-5 p-10'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default MainLayout