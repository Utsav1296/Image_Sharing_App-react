import React from 'react'
import { Circles } from 'react-loader-spinner'

const Spinner = ({ message }) => {
    return (
        <div className='flex flex-col gap-3 justify-center items-center w-full h-full'>
            <Circles
                color='#009ab5'
                height={50}
                width={200}
                wrapperClass='mt-5'
            />
            <p className='text-gray-700 text-center px-2 text-xl font-mono'>{message}</p>
        </div>
    )
}

export default Spinner