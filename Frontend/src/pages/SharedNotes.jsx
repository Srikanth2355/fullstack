import React, { useEffect, useState } from 'react'
import { useLoading } from '../utils/loader'

function SharedNotes() {    
    return (
        <div className=' w-full h-[80vh] md:h-full flex justify-center items-center'>
            <div className='m-4 bg-white rounded-lg shadow-md w-3/4 h-2/4 md:w-2/3 md:h-2/3  relative'>
            <div className='absolute right-0 bottom-0 top-0 left-0 bg-[#F7F7F7] opacity-50 w-full h-full flex justify-center items-center font-semibold text-3xl '>
                <p className=''>Comming Soon</p> 
            </div>

            </div>
        </div>
    )
}

export default SharedNotes
