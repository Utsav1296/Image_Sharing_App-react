import React from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { IoMdAdd, IoMdSearch } from 'react-icons/io';

const Navbar = ({ searchTerm, setSearchTerm, user }) => {
    const navigate = useNavigate();
    // { console.log(user) }
    // if (!user) return null;
    return (
        <div className='flex gap-2 md:gap-5 w-full mt-5'>
            <div className="flex justify-start items-center px-2 w-full rounded-lg bg-white border-none outline-none focus-within:shadow-sm">
                <IoMdSearch fontSize={21} className='ml-1' />
                <input type="text" name="search-text" id="search" placeholder='Search here' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onFocus={() => navigate('/search')}
                    className='p-2 w-full outline-none bg-white' />
            </div>

            {/* <div className="flex gap-3"> */}
            <Link to={`user-profile/${user?._id}`} className='hidden md:block'>
                <img src={user?.image} alt='user' className='w-14 h-12 rounded-md border-4 border-x-blue-900' />
            </Link>
            <Link to={`create-pin`}>
                <IoMdAdd fontSize={50} className='mr-1 bg-black text-white rounded-md' />
            </Link>
            {/* </div> */}
        </div>
    )
}

export default Navbar